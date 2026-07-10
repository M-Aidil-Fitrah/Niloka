"use client";

import { useState, useCallback } from "react";
import {
  Package,
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  CreditCard,
  History,
} from "lucide-react";
import {
  processOrderAction,
  shipOrderAction,
  getSellerOrderDetailAction,
} from "@/lib/actions/seller-order-actions";
import type { SellerOrderDetail } from "@/lib/actions/seller-order-actions";
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

const paymentStatusLabel: Record<string, string> = {
  pending: "Menunggu",
  paid: "Lunas",
  failed: "Gagal",
  expired: "Kadaluarsa",
};

const paymentStatusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  paid: "bg-emerald-100 text-emerald-800",
  failed: "bg-red-100 text-red-800",
  expired: "bg-red-100 text-red-800",
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
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [orderDetails, setOrderDetails] = useState<Record<string, SellerOrderDetail>>({});
  const [loadingDetails, setLoadingDetails] = useState<Set<string>>(new Set());

  const toggleExpand = useCallback(async (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });

    if (!orderDetails[orderId] && !loadingDetails.has(orderId)) {
      setLoadingDetails((prev) => new Set(prev).add(orderId));
      try {
        const detail = await getSellerOrderDetailAction(orderId);
        if (detail) {
          setOrderDetails((prev) => ({ ...prev, [orderId]: detail }));
        }
      } catch {
        showToast("Gagal memuat detail pesanan.", "error");
      } finally {
        setLoadingDetails((prev) => {
          const next = new Set(prev);
          next.delete(orderId);
          return next;
        });
      }
    }
  }, [orderDetails, loadingDetails]);

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
            const isExpanded = expandedOrders.has(order.id);
            const detail = orderDetails[order.id];
            const isLoadingDetail = loadingDetails.has(order.id);

            return (
              <div
                key={order.id}
                className="rounded-2xl border border-line bg-white-soft shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(order.id)}
                  className="w-full text-left p-4 sm:p-5 space-y-3 cursor-pointer hover:bg-cream-50/50 transition-colors"
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
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={fulfillmentStatus} />
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-ink-600" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-ink-600" />
                      )}
                    </div>
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
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
                </button>

                {isExpanded && (
                  <div className="border-t border-line/40 bg-cream-50/50 px-4 sm:px-5 py-4 space-y-4 text-xs animate-in slide-in-from-top-2 duration-200">
                    {isLoadingDetail ? (
                      <div className="flex items-center gap-2 text-ink-600 py-2">
                        <div className="size-3 animate-spin rounded-full border-2 border-ink-600 border-t-transparent" />
                        Memuat detail...
                      </div>
                    ) : detail ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h4 className="font-extrabold text-brand-950 flex items-center gap-1.5">
                              <User className="h-3.5 w-3.5 text-brand-700" />
                              Pembeli
                            </h4>
                            <div className="bg-white-soft rounded-xl p-3 border border-line/40 space-y-1.5">
                              <p className="font-bold text-brand-950">{detail.buyer.name}</p>
                              <p className="text-ink-600">{detail.buyer.email}</p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-extrabold text-brand-950 flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-brand-700" />
                              Alamat Pengiriman
                            </h4>
                            <div className="bg-white-soft rounded-xl p-3 border border-line/40 space-y-1.5">
                              <p className="font-bold text-brand-950">{detail.shipping.receiverName}</p>
                              <p className="text-ink-600">{detail.shipping.receiverPhone}</p>
                              <p className="text-ink-600">{detail.shipping.address}</p>
                              <p className="text-ink-600">
                                {detail.shipping.city}, {detail.shipping.province}
                              </p>
                              {detail.shipping.courierName && (
                                <p className="text-ink-600">
                                  Kurir: {detail.shipping.courierName} ({detail.shipping.courierCode})
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <h4 className="font-extrabold text-brand-950 flex items-center gap-1.5">
                              <CreditCard className="h-3.5 w-3.5 text-brand-700" />
                              Pembayaran
                            </h4>
                            <div className="bg-white-soft rounded-xl p-3 border border-line/40 space-y-1.5">
                              {detail.payments.map((p) => (
                                <div key={p.id} className="flex items-center justify-between">
                                  <span className="text-ink-600">{p.method ?? "—"}</span>
                                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${paymentStatusColor[p.status] ?? ""}`}>
                                    {paymentStatusLabel[p.status] ?? p.status}
                                  </span>
                                </div>
                              ))}
                              <div className="flex items-center justify-between pt-1 border-t border-line/30 font-bold text-brand-950">
                                <span>Total</span>
                                <span>{formatRupiah(detail.grandTotalAmount)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="font-extrabold text-brand-950 flex items-center gap-1.5">
                              <History className="h-3.5 w-3.5 text-brand-700" />
                              Riwayat Pengiriman
                            </h4>
                            <div className="bg-white-soft rounded-xl p-3 border border-line/40 space-y-2">
                              {detail.fulfillments.length === 0 ? (
                                <p className="text-ink-500">Belum ada pengiriman.</p>
                              ) : (
                                detail.fulfillments.map((f) => (
                                  <div key={f.id} className="flex items-center justify-between">
                                    <div>
                                      <StatusBadge status={f.status} />
                                      {f.trackingNumber && (
                                        <p className="text-[10px] text-indigo-700 font-semibold mt-1">
                                          Resi: {f.trackingNumber}
                                        </p>
                                      )}
                                    </div>
                                    <span className="text-[10px] text-ink-500">
                                      {new Date(f.updatedAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                      })}
                                    </span>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white-soft rounded-xl p-3 border border-line/40">
                          <h4 className="font-extrabold text-brand-950 mb-2">Rincian Biaya</h4>
                          <div className="space-y-1 text-[11px]">
                            <div className="flex justify-between text-ink-600">
                              <span>Subtotal</span>
                              <span>{formatRupiah(detail.subtotalAmount)}</span>
                            </div>
                            <div className="flex justify-between text-ink-600">
                              <span>Biaya Platform</span>
                              <span>{formatRupiah(detail.platformFeeAmount)}</span>
                            </div>
                            <div className="flex justify-between text-ink-600">
                              <span>Ongkos Kirim</span>
                              <span>{formatRupiah(detail.shippingEstimateAmount)}</span>
                            </div>
                            {detail.discountAmount > 0 && (
                              <div className="flex justify-between text-emerald-700">
                                <span>Diskon</span>
                                <span>-{formatRupiah(detail.discountAmount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between font-extrabold text-brand-950 pt-1 border-t border-line/30">
                              <span>Total</span>
                              <span>{formatRupiah(detail.grandTotalAmount)}</span>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-ink-500 text-center py-2">Detail tidak tersedia.</p>
                    )}
                  </div>
                )}
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
