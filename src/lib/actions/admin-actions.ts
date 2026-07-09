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
} from "@/generated/prisma/client";
import type { AdminValidationItem, Seller } from "@/lib/contracts";

function fromPrismaValidationTarget(target: AdminValidationTarget): "seller" | "product" | "nilam-passport" {
  switch (target) {
    case AdminValidationTarget.SELLER:
      return "seller";
    case AdminValidationTarget.PRODUCT:
      return "product";
    case AdminValidationTarget.NILAM_PASSPORT:
      return "nilam-passport";
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
