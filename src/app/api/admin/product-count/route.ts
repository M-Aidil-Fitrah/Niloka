import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { ProductStatus } from "@/generated/prisma/client";

export async function GET() {
  await requireAdmin();

  const count = await prisma.product.count({
    where: {
      status: ProductStatus.PUBLISHED,
    },
  });

  return Response.json({ count });
}
