"use client";

import { useState } from "react";
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { processOrderAction, shipOrderAction } from "@/lib/actions/seller-order-actions";
import { formatRupiah } from "@/lib/formatters";
import { showToast } from "@/lib/toast";
import type { OrderTracking, OrderFulfillmentStatus } from "@/lib/contracts";

type Props = {
  orders: OrderTracking[];
};

type FilterTab = "all" | "ready" | "shipped" | "delivered";

const filterLabel: Record<FilterTab, string> = {
  all: "Semua",
  ready: "Perlu Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
};

const statusConfig: Record<string, { label: string; color: string }> = {
  "pending-payment": { label: "Menunggu Bayar", color: "bg-amber-100 text-amber-800" },
  "ready-to-process": { label: "Siap Diproses", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Diproses", color: "bg-purple-100 text-purple-800" },
  shipped: { label: "Dikirim", color: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Selesai", color: "bg-emerald-100 text-emerald-800" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-800" },
};

function getFulfillmentStatus(order: OrderTracking): OrderFulfillmentStatus {
  if (order.fulfillments.length > 0) {
    return order.fulfillments[0].status;
  }
  if (order.paymentStatus === "paid") {
    return "ready-to-process";
  }
  return "pending-payment";
}

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status];
  if (!cfg) return <span className="text-xs text-ink-500">{status}</span>;
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

export function OrderManagement({ orders }: Props) {
  const [filter, setFilter] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [shipModal, setShipModal] = useState<{ open: boolean; orderId: string }>({
    open: false,
    orderId: "",
  });
  const [trackingInput, setTrackingInput] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const status = getFulfillmentStatus(order);
    if (filter === "ready") return status === "ready-to-process" || status === "processing";
    if (filter === "shipped") return status === "shipped";
    if (filter === "delivered") return status === "delivered";
    return true;
  }).filter((order) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return order.id.toLowerCase().includes(q);
  });

  const handleProcess = async (orderId: string) => {
    setActionLoading(orderId);
    const res = await processOrderAction(orderId);
    setActionLoading(null);
    if (res.ok) {
      showToast("Pesanan sedang diproses.", "success");
    } else {
      showToast(res.error ?? "Gagal memproses.", "error");
    }
  };

  const handleShip = async () => {
    if (!trackingInput.trim()) {
      showToast("Nomor resi wajib diisi.", "warning");
      return;
    }
    setActionLoading(shipModal.orderId);
    const res = await shipOrderAction(shipModal.orderId, trackingInput.trim());
    setActionLoading(null);
    setShipModal({ open: false, orderId: "" });
    setTrackingInput("");
    if (res.ok) {
      showToast("Pesanan berhasil dikirim.", "success");
    } else {
      showToast(res.error ?? "Gagal mengirim.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-line bg-white-soft p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-base font-extrabold text-brand-950">Pesanan Masuk</h3>
          <p className="text-xs text-ink-600 mt-1">Kelola pesanan dari pembeli dan perbarui status pengiriman</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {(["all", "ready", "shipped", "delivered"] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                  filter === tab
                    ? "bg-brand-900 text-white-soft"
                    : "bg-cream-100 text-brand-950 hover:bg-cream-200"
                }`}
              >
                {filterLabel[tab]}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-600" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID pesanan..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full border border-line bg-cream-50 text-xs font-semibold outline-none focus:border-brand-900"
            />
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="rounded-[28px] border border-line bg-white-soft p-12 text-center space-y-3">
          <Package className="h-8 w-8 mx-auto text-ink-600/30" />
          <p className="text-sm font-bold text-ink-600">Tidak ada pesanan</p>
          <p className="text-xs text-ink-500">
            {filter === "all" ? "Belum ada pesanan yang masuk." : "Tidak ada pesanan dengan status ini."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const fulfillmentStatus = getFulfillmentStatus(order);
            const isProcessing = fulfillmentStatus === "ready-to-process";
            const isShipped = fulfillmentStatus === "shipped";
            const isDelivered = fulfillmentStatus === "delivered";
            const isCancelled = fulfillmentStatus === "cancelled";
            const canProcess = isProcessing && actionLoading !== order.id;
            const canShip = isProcessing && actionLoading !== order.id;
            const isLoading = actionLoading === order.id;

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-line bg-white-soft p-4 sm:p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <p className="font-mono text-xs font-bold text-brand-950 truncate">
                      {order.id}
                    </p>
                    <p className="text-[10px] text-ink-600 font-semibold">
                      {new Date(order.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <StatusBadge status={fulfillmentStatus} />
                </div>

                <div className="divide-y divide-line/30 text-xs">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-brand-950 truncate">{item.name}</p>
                        <p className="text-[10px] text-ink-600">
                          {item.quantity} × {formatRupiah(item.unitPrice.amount)}
                        </p>
                      </div>
                      <span className="font-extrabold text-brand-900 ml-3 shrink-0">
                        {formatRupiah(item.subtotal.amount)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-line/30">
                  <span className="text-xs font-extrabold text-brand-950">
                    Total: {formatRupiah(order.grandTotal.amount)}
                  </span>
                  <div className="flex gap-2">
                    {canProcess && (
                      <button
                        onClick={() => handleProcess(order.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-brand-900 text-white-soft text-[10px] font-bold hover:bg-brand-800 transition-colors cursor-pointer"
                      >
                        <Clock className="h-3 w-3" />
                        Proses
                      </button>
                    )}
                    {canShip && (
                      <button
                        onClick={() => setShipModal({ open: true, orderId: order.id })}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-blue-600 text-white-soft text-[10px] font-bold hover:bg-blue-700 transition-colors cursor-pointer"
                      >
                        <Truck className="h-3 w-3" />
                        Kirim
                      </button>
                    )}
                    {isLoading && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-cream-100 text-ink-600 text-[10px] font-bold">
                        <div className="size-3 animate-spin rounded-full border-2 border-ink-600 border-t-transparent" />
                        Memproses...
                      </span>
                    )}
                    {isShipped && order.fulfillments[0]?.trackingNumber && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700">
                        <ExternalLink className="h-3 w-3" />
                        {order.fulfillments[0].trackingNumber}
                      </span>
                    )}
                    {isDelivered && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                        <CheckCircle className="h-3 w-3" />
                        Terkirim
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700">
                        <XCircle className="h-3 w-3" />
                        Dibatalkan
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {shipModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white-soft rounded-3xl border border-line p-6 w-full max-w-sm mx-4 shadow-xl space-y-4">
            <h4 className="text-sm font-extrabold text-brand-950">Kirim Pesanan</h4>
            <p className="text-[11px] text-ink-600 font-semibold">
              Masukkan nomor resi pengiriman untuk pesanan {shipModal.orderId.slice(0, 12)}...
            </p>
            <input
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder="Nomor resi..."
              className="w-full px-4 py-2.5 rounded-full border border-line bg-cream-50 text-xs font-semibold outline-none focus:border-brand-900"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setShipModal({ open: false, orderId: "" }); setTrackingInput(""); }}
                className="px-4 py-2 rounded-full border border-line text-[11px] font-bold text-ink-600 hover:bg-cream-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleShip}
                disabled={!trackingInput.trim()}
                className="px-4 py-2 rounded-full bg-blue-600 text-white-soft text-[11px] font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors cursor-pointer"
              >
                Kirim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
