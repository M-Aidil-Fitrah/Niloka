import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { getBuyerOrdersDto } from "@/lib/dal/orders";
import { SectionShell } from "@/components/ui/section-shell";
import { ChevronRight, Package } from "lucide-react";
import { PriceDisplay } from "@/components/ui/price-display";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pesanan Saya - NILOKA",
  description: "Daftar semua pesanan Anda.",
};

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await getBuyerOrdersDto(user.id);

  return (
    <SectionShell eyebrow="Orders" title="Pesanan Saya" description="Riwayat dan status semua pesanan Anda.">
      <div className="mt-8 max-w-2xl mx-auto space-y-4">
        {orders.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <Package className="h-10 w-10 mx-auto text-ink-600/30" />
            <p className="text-sm font-bold text-ink-600">Belum ada pesanan</p>
            <Link href="/products" className="inline-flex h-10 px-5 rounded-xl bg-brand-900 text-white-soft text-xs font-bold items-center">Mulai Belanja</Link>
          </div>
        )}
        {orders.map((order) => (
          <Link key={order.id} href={`/orders/${order.id}`} className="block rounded-2xl border border-line bg-white-soft p-4 shadow-sm hover:border-brand-900/30 transition-colors">
            <div className="flex items-center justify-between">
              <div className="space-y-1 text-xs">
                <p className="font-mono font-bold text-brand-950">{order.id}</p>
                <p className="text-ink-600">{new Date(order.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                <p className="font-semibold flex items-center gap-1">
                  {order.items.length} barang — <PriceDisplay amount={order.grandTotal.amount} />
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${order.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-800" : order.paymentStatus === "pending" ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"}`}>
                  {order.paymentStatus === "paid" ? "Lunas" : order.paymentStatus === "pending" ? "Pending" : "Gagal"}
                </span>
                <ChevronRight className="h-4 w-4 text-ink-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </SectionShell>
  );
}