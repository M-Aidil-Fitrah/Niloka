import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getBuyerOrderDto } from "@/lib/dal/orders";
import { SectionShell } from "@/components/ui/section-shell";
import { OrderDetailClient } from "@/components/orders/order-detail-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detail Pesanan - NILOKA",
};

type Props = { params: Promise<{ orderId: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const user = await requireUser();
  const { orderId } = await params;
  const order = await getBuyerOrderDto(user.id, orderId);

  if (!order) notFound();

  return (
    <SectionShell eyebrow="Orders" title="Detail Pesanan" description={`Order ID: ${order.id}`}>
      <div className="mt-8 max-w-2xl mx-auto">
        <OrderDetailClient order={order} />
      </div>
    </SectionShell>
  );
}