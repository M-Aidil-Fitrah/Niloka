"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  SellerType,
  SellerVerificationStatus,
  AdminValidationTarget,
  AdminValidationStatus,
} from "@/generated/prisma/client";
import { z } from "zod";

const sellerApplySchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter"),
  phone: z.string().min(10, "Format nomor tidak valid"),
  nik: z.string().length(16, "NIK harus terdiri dari 16 digit"),
  shopName: z.string().min(3, "Nama toko minimal 3 karakter"),
  businessType: z.enum(["umkm", "distiller", "cooperative"]),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  province: z.string().default("Aceh"),
  city: z.string().min(1, "Kota/Kabupaten wajib diisi"),
  district: z.string().min(1, "Kecamatan wajib diisi"),
  detailAddress: z.string().min(1, "Alamat lengkap wajib diisi"),
});

function toPrismaSellerType(type: string): SellerType {
  switch (type) {
    case "umkm":
      return SellerType.UMKM;
    case "distiller":
      return SellerType.DISTILLER;
    case "cooperative":
      return SellerType.COOPERATIVE;
    default:
      return SellerType.UMKM;
  }
}

export async function submitSellerApplicationAction(
  input: unknown,
): Promise<{ ok: boolean; message: string }> {
  const user = await requireUser();

  const validated = sellerApplySchema.safeParse(input);
  if (!validated.success) {
    return {
      ok: false,
      message:
        validated.error.issues[0]?.message ??
        "Data permohonan tidak valid.",
    };
  }

  const data = validated.data;

  // Check if user is already a seller
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true, sellerId: true },
  });

  if (dbUser?.role === "SELLER" || dbUser?.sellerId) {
    return {
      ok: false,
      message: "Anda sudah terdaftar sebagai penjual.",
    };
  }

  // Check if there is already a queued application
  const existingApp = await prisma.sellerApplication.findFirst({
    where: {
      userId: user.id,
      status: AdminValidationStatus.QUEUED,
    },
  });

  if (existingApp) {
    return {
      ok: false,
      message: "Anda sudah mengirimkan permohonan pendaftaran penjual. Harap tunggu verifikasi admin.",
    };
  }

  const sellerId = `seller-${user.id.slice(-6)}-${Date.now().toString().slice(-4)}`;
  const sellerSlug = data.shopName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const mappedType = toPrismaSellerType(data.businessType);

  await prisma.$transaction(async (tx) => {
    // 1. Create Seller in PENDING status
    await tx.seller.create({
      data: {
        id: sellerId,
        slug: `${sellerSlug}-${sellerId.slice(-4)}`,
        displayName: data.shopName,
        type: mappedType,
        locationProvince: data.province,
        locationCity: data.city,
        locationDistrict: data.district,
        verificationStatus: SellerVerificationStatus.PENDING,
        joinedAt: new Date(),
        contactChannel: data.phone,
      },
    });

    // 2. Link Seller to User
    await tx.user.update({
      where: { id: user.id },
      data: {
        sellerId: sellerId,
        locationProvince: data.province,
        locationCity: data.city,
        locationDistrict: data.district,
      },
    });

    // 3. Create Seller Application
    const app = await tx.sellerApplication.create({
      data: {
        userId: user.id,
        sellerId: sellerId,
        businessName: data.shopName,
        businessType: mappedType,
        locationProvince: data.province,
        locationCity: data.city,
        locationDistrict: data.district,
        notes: `Pemilik: ${data.name}. NIK: ${data.nik}. Deskripsi: ${data.description}. Alamat: ${data.detailAddress}. Kontak: ${data.phone}`,
        status: AdminValidationStatus.QUEUED,
      },
    });

    // 4. Create Admin Validation Item
    await tx.adminValidationItem.create({
      data: {
        id: `val-seller-${app.id.slice(-8)}`,
        target: AdminValidationTarget.SELLER,
        targetId: app.id,
        status: AdminValidationStatus.QUEUED,
        submittedBy: sellerId,
        submittedAt: new Date(),
        notes: `Pendaftaran Mitra Baru: ${data.shopName} (${data.businessType.toUpperCase()}). Pemilik: ${data.name}, Kota: ${data.city}.`,
      },
    });

    // 5. Create Audit Log
    await tx.auditLog.create({
      data: {
        userId: user.id,
        action: "SUBMIT_SELLER_APPLICATION",
        target: "SellerApplication",
        targetId: app.id,
        metadata: JSON.stringify({
          shopName: data.shopName,
          businessType: data.businessType,
        }),
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/admin");

  return { ok: true, message: "Pendaftaran penjual berhasil dikirim!" };
}
