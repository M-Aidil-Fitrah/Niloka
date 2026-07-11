"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  AdminValidationStatus,
  AdminValidationTarget,
  SellerVerificationStatus,
  PassportValidationStatus,
  UserRole,
  ProductTag,
  ProductStatus,
  AmpasListingStatus,
} from "@/generated/prisma/client";
import type { AdminValidationItem, Seller } from "@/lib/contracts";

function fromPrismaValidationTarget(target: AdminValidationTarget): import("@/lib/contracts").AdminValidationTarget {
  switch (target) {
    case AdminValidationTarget.SELLER:
      return "seller";
    case AdminValidationTarget.PRODUCT:
      return "product";
    case AdminValidationTarget.NILAM_PASSPORT:
      return "nilam-passport";
    case AdminValidationTarget.AMPAS_LISTING:
      return "ampas-listing";
    default:
      return "seller";
  }
}

function fromPrismaValidationStatus(status: AdminValidationStatus): "queued" | "approved" | "rejected" {
  switch (status) {
    case AdminValidationStatus.QUEUED:
      return "queued";
    case AdminValidationStatus.APPROVED:
      return "approved";
    case AdminValidationStatus.REJECTED:
      return "rejected";
  }
}

export async function getAdminValidationItemsAction(): Promise<AdminValidationItem[]> {
  await requireAdmin();

  const rows = await prisma.adminValidationItem.findMany({
    orderBy: {
      submittedAt: "desc",
    },
    take: 100,
  });

  return rows.map((row) => ({
    id: row.id,
    target: fromPrismaValidationTarget(row.target),
    targetId: row.targetId,
    status: fromPrismaValidationStatus(row.status),
    submittedBy: row.submittedBy,
    submittedAt: row.submittedAt.toISOString(),
    notes: row.notes,
  }));
}

export async function getAllSellersAction(): Promise<Seller[]> {
  await requireAdmin();

  const rows = await prisma.seller.findMany({
    orderBy: {
      joinedAt: "desc",
    },
    take: 100,
  });

  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    displayName: row.displayName,
    type: row.type.toLowerCase() as "umkm" | "distiller" | "cooperative",
    location: {
      province: row.locationProvince,
      city: row.locationCity,
      district: row.locationDistrict,
    },
    verificationStatus: row.verificationStatus.toLowerCase() as "pending" | "verified" | "rejected",
    joinedAt: row.joinedAt.toISOString(),
    ratingAverage: row.ratingAverage,
    totalReviews: row.totalReviews,
    contactChannel: row.contactChannel,
  }));
}

const validationActionSchema = z.object({
  id: z.string().min(1, "ID validasi diperlukan."),
  notes: z.string().max(500, "Catatan maksimal 500 karakter.").default(""),
});

export async function approveValidationAction(
  id: string,
  notes: string,
): Promise<{ ok: boolean; message: string }> {
  const admin = await requireAdmin();
  const parsed = validationActionSchema.safeParse({ id, notes });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const item = await prisma.adminValidationItem.findUnique({
    where: { id },
  });

  if (!item) {
    return { ok: false, message: "Item validasi tidak ditemukan." };
  }

  await prisma.$transaction(async (tx) => {
    // 1. Update status item validasi
    await tx.adminValidationItem.update({
      where: { id },
      data: {
        status: AdminValidationStatus.APPROVED,
        notes: notes || item.notes,
      },
    });

    // 2. Process side effects based on target
    if (item.target === AdminValidationTarget.SELLER) {
      const app = await tx.sellerApplication.findUnique({
        where: { id: item.targetId },
      });

      if (app) {
        // Approve application
        await tx.sellerApplication.update({
          where: { id: app.id },
          data: {
            status: AdminValidationStatus.APPROVED,
            reviewedAt: new Date(),
          },
        });

        if (app.sellerId) {
          // Verify Seller profile
          await tx.seller.update({
            where: { id: app.sellerId },
            data: {
              verificationStatus: SellerVerificationStatus.VERIFIED,
            },
          });

          // Promote User role to SELLER
          await tx.user.update({
            where: { id: app.userId },
            data: {
              role: UserRole.SELLER,
            },
          });
        }
      }
    } else if (item.target === AdminValidationTarget.NILAM_PASSPORT) {
      // Find passport
      const passport = await tx.nilamPassport.findUnique({
        where: { id: item.targetId },
        include: { product: true },
      });

      if (passport) {
        const batchCode = passport.batchCode || `NLK-${Date.now().toString().slice(-6)}`;

        // Validate passport
        await tx.nilamPassport.update({
          where: { id: passport.id },
          data: {
            validationStatus: PassportValidationStatus.VALIDATED,
            validatedBy: admin.id,
            validatedAt: new Date(),
            batchCode,
          },
        });

        // Add NILAM_PASSPORT tag to the product
        const currentTags = passport.product.tags;
        if (!currentTags.includes(ProductTag.NILAM_PASSPORT)) {
          await tx.product.update({
            where: { id: passport.productId },
            data: {
              tags: {
                set: [...currentTags, ProductTag.NILAM_PASSPORT],
              },
            },
          });
        }
      }
    } else if (item.target === AdminValidationTarget.PRODUCT) {
      await tx.product.update({
        where: { id: item.targetId },
        data: { status: ProductStatus.PUBLISHED },
      });
    } else if (item.target === AdminValidationTarget.AMPAS_LISTING) {
      await tx.ampasListing.update({
        where: { id: item.targetId },
        data: { status: AmpasListingStatus.ACTIVE },
      });
    }

    // 3. Write audit log
    await tx.auditLog.create({
      data: {
        userId: admin.id,
        action: `APPROVE_VALIDATION_${item.target}`,
        target: item.target.toString(),
        targetId: item.targetId,
        metadata: JSON.stringify({
          notes,
          validator: admin.name,
        }),
      },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/seller");
  revalidatePath("/products");
  revalidatePath("/passport");

  return { ok: true, message: "Validasi pengajuan berhasil disetujui!" };
}

export async function rejectValidationAction(
  id: string,
  notes: string,
): Promise<{ ok: boolean; message: string }> {
  const admin = await requireAdmin();
  const parsed = validationActionSchema.safeParse({ id, notes });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const item = await prisma.adminValidationItem.findUnique({
    where: { id },
  });

  if (!item) {
    return { ok: false, message: "Item validasi tidak ditemukan." };
  }

  await prisma.$transaction(async (tx) => {
    // 1. Update status item validasi
    await tx.adminValidationItem.update({
      where: { id },
      data: {
        status: AdminValidationStatus.REJECTED,
        notes: notes || item.notes,
      },
    });

    // 2. Process side effects based on target
    if (item.target === AdminValidationTarget.SELLER) {
      const app = await tx.sellerApplication.findUnique({
        where: { id: item.targetId },
      });

      if (app) {
        // Reject application
        await tx.sellerApplication.update({
          where: { id: app.id },
          data: {
            status: AdminValidationStatus.REJECTED,
            reviewedAt: new Date(),
          },
        });

        if (app.sellerId) {
          // Reject Seller profile
          await tx.seller.update({
            where: { id: app.sellerId },
            data: {
              verificationStatus: SellerVerificationStatus.REJECTED,
            },
          });
        }
      }
    } else if (item.target === AdminValidationTarget.NILAM_PASSPORT) {
      // Revert passport to DRAFT status
      await tx.nilamPassport.update({
        where: { id: item.targetId },
        data: {
          validationStatus: PassportValidationStatus.DRAFT,
        },
      });
    } else if (item.target === AdminValidationTarget.PRODUCT) {
      await tx.product.update({
        where: { id: item.targetId },
        data: { status: ProductStatus.ARCHIVED },
      });
    } else if (item.target === AdminValidationTarget.AMPAS_LISTING) {
      await tx.ampasListing.update({
        where: { id: item.targetId },
        data: { status: AmpasListingStatus.ARCHIVED },
      });
    }

    // 3. Write audit log
    await tx.auditLog.create({
      data: {
        userId: admin.id,
        action: `REJECT_VALIDATION_${item.target}`,
        target: item.target.toString(),
        targetId: item.targetId,
        metadata: JSON.stringify({
          notes,
          validator: admin.name,
        }),
      },
    });
  });

  revalidatePath("/admin");
  revalidatePath("/seller");
  revalidatePath("/products");
  revalidatePath("/passport");

  return { ok: true, message: "Pengajuan berhasil ditolak." };
}

export async function getAuditLogsAction(): Promise<
  { id: string; userId: string | null; action: string; target: string; targetId: string; metadata: string; createdAt: string }[]
> {
  await requireAdmin();

  const logs = await prisma.auditLog.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return logs.map((log) => ({
    id: log.id,
    userId: log.userId,
    action: log.action,
    target: log.target,
    targetId: log.targetId,
    metadata: log.metadata ? JSON.stringify(log.metadata) : "",
    createdAt: log.createdAt.toISOString(),
  }));
}

export async function getAdminDashboardStatsAction(): Promise<{
  validationSummary: { day: string; approved: number; rejected: number }[];
  distribution: { type: string; count: number }[];
  todayQueued: number;
  thisWeekSellers: number;
  validatedPassports: number;
  stalePassportCount: number;
}> {
  await requireAdmin();

  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const [weekItems, todayQueued, thisWeekSellers, validatedPassports, stalePassportCount] = await Promise.all([
    prisma.adminValidationItem.findMany({
      where: { submittedAt: { gte: weekAgo } },
      select: { status: true, submittedAt: true },
    }),
    prisma.adminValidationItem.count({
      where: {
        status: AdminValidationStatus.QUEUED,
        submittedAt: { gte: todayStart },
      },
    }),
    prisma.seller.count({
      where: { joinedAt: { gte: weekAgo } },
    }),
    prisma.nilamPassport.count({
      where: { validationStatus: PassportValidationStatus.VALIDATED },
    }),
    prisma.adminValidationItem.count({
      where: {
        target: AdminValidationTarget.NILAM_PASSPORT,
        status: AdminValidationStatus.QUEUED,
        submittedAt: { lte: twoDaysAgo },
      },
    }),
  ]);

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const dayMap = new Map<string, { approved: number; rejected: number }>();
  for (const name of dayNames) {
    dayMap.set(name, { approved: 0, rejected: 0 });
  }

  for (const item of weekItems) {
    const dayName = dayNames[item.submittedAt.getDay()];
    const entry = dayMap.get(dayName)!;
    if (item.status === AdminValidationStatus.APPROVED) entry.approved++;
    else if (item.status === AdminValidationStatus.REJECTED) entry.rejected++;
  }

  const targetCounts = await prisma.adminValidationItem.groupBy({
    by: ["target"],
    _count: { id: true },
  });

  const targetLabels: Record<string, string> = {
    SELLER: "Sertifikasi Mitra Baru",
    PRODUCT: "Listing Produk B2C",
    NILAM_PASSPORT: "Transparansi Nilam Passport",
    AMPAS_LISTING: "Listing Ampas B2B",
  };

  const distribution = targetCounts.map((t) => ({
    type: targetLabels[t.target] ?? t.target,
    count: t._count.id,
  }));

  const validationSummary = dayNames.map((day) => ({
    day,
    approved: dayMap.get(day)!.approved,
    rejected: dayMap.get(day)!.rejected,
  }));

  return { validationSummary, distribution, todayQueued, thisWeekSellers, validatedPassports, stalePassportCount };
}

export async function getAllUsersAction(): Promise<
  { id: string; name: string | null; email: string | null; role: string; sellerId: string | null; createdAt: string }[]
> {
  await requireAdmin();
  const rows = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return rows.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    sellerId: u.sellerId,
    createdAt: u.createdAt.toISOString(),
  }));
}

export async function getAllOrdersAction(): Promise<
  { id: string; userName: string | null; status: string; grandTotal: number; itemCount: number; createdAt: string }[]
> {
  await requireAdmin();
  const rows = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true } },
      items: { select: { quantity: true } },
    },
  });
  return rows.map((o) => ({
    id: o.id,
    userName: o.user?.name ?? "Pengguna",
    status: o.status.toLowerCase(),
    grandTotal: o.grandTotalAmount,
    itemCount: o.items.reduce((sum, i) => sum + i.quantity, 0),
    createdAt: o.createdAt.toISOString(),
  }));
}
