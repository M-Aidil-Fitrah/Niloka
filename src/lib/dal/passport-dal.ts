import "server-only";

import type { NilamPassport } from "@/lib/contracts";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  fromPrismaPassportStatus,
  fromPrismaProductForm,
  fromPrismaProductFunction,
} from "@/lib/prisma-mappers";

type PassportRow = Prisma.NilamPassportGetPayload<{
  select: {
    id: true;
    productId: true;
    origin: true;
    productKind: true;
    aromaProfile: true;
    functions: true;
    usage: true;
    safetyNotes: true;
    validationStatus: true;
    validatedBy: true;
    validatedAt: true;
    batchCode: true;
    farmerGroup: true;
    gpsCoordinates: true;
  };
}>;

function toIsoString(date: Date): string {
  return date.toISOString();
}

function mapPassport(row: PassportRow): NilamPassport {
  return {
    id: row.id,
    productId: row.productId,
    origin: row.origin,
    productKind: fromPrismaProductForm(row.productKind),
    aromaProfile: row.aromaProfile,
    functions: row.functions.map(fromPrismaProductFunction),
    usage: row.usage,
    safetyNotes: row.safetyNotes,
    validationStatus: fromPrismaPassportStatus(row.validationStatus),
    validatedBy: row.validatedBy ?? "",
    validatedAt: row.validatedAt ? toIsoString(row.validatedAt) : "",
    batchCode: row.batchCode ?? undefined,
    farmerGroup: row.farmerGroup ?? undefined,
    gpsCoordinates: row.gpsCoordinates ?? undefined,
  };
}

export async function getPassportByProductIdDto(
  productId: string,
): Promise<NilamPassport | null> {
  const row = await prisma.nilamPassport.findUnique({
    where: {
      productId,
    },
  });

  return row ? mapPassport(row) : null;
}

export async function getPassportsDto(): Promise<NilamPassport[]> {
  const rows = await prisma.nilamPassport.findMany({
    orderBy: {
      validatedAt: "desc",
    },
  });

  return rows.map(mapPassport);
}

export async function getFeaturedPassportDto(): Promise<NilamPassport | null> {
  const row = await prisma.nilamPassport.findFirst({
    orderBy: {
      validatedAt: "desc",
    },
  });

  return row ? mapPassport(row) : null;
}
