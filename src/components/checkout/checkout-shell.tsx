"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { CartItemsList } from "./cart-items-list";
import { ShippingForm } from "./shipping-form";
import { OrderSummaryCard } from "./order-summary-card";
import { PaymentCoreModal } from "./payment-core-modal";
import {
  Calendar,
  Printer,
  Receipt,
  RefreshCw,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import type {
  AmpasListing,
  CartItem,
  Money,
  PaymentInstruction,
  PaymentStatus,
  Product,
  Promo,
  PromoValidationResult,
} from "@/lib/contracts";
import {
  checkoutAction,
  confirmPaymentAction,
  fetchOrderHistoryAction,
} from "@/lib/actions/checkout-actions";

type CheckoutShellProps = {
  products: Product[];
  ampasListings: AmpasListing[];
  promos: Promo[];
};

type OrderHistoryItem = {
  orderId: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    kind: string;
  }[];
  shippingAddress: {
    receiverName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
  };
  courier: string;
  paymentMethod: string;
  subtotal: number;
  platformFee: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
};

function validatePromoCodeFromDb(
  codeInput: string,
  items: CartItem[],
  promos: Promo[],
  shippingFee: number,
): PromoValidationResult {
  const code = codeInput.trim().toUpperCase();

  if (!code) {
    return {
      status: "empty",
      promo: null,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Masukkan kode promo terlebih dahulu.",
    };
  }

  const promo = promos.find((item) => item.code.toUpperCase() === code);

  if (!promo) {
    return {
      status: "not-found",
      promo: null,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Kode promo tidak ditemukan.",
    };
  }

  const now = new Date();
  const startsAt = new Date(promo.startsAt);
  const endsAt = new Date(promo.endsAt);

  if (promo.status !== "active" || now < startsAt || now > endsAt) {
    return {
      status: promo.status === "scheduled" ? "scheduled" : "expired",
      promo: null,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Promo belum aktif atau sudah berakhir.",
    };
  }

  if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
    return {
      status: "usage-limit-reached",
      promo: null,
      discountAmount: 0,
      eligibleSubtotal: 0,
      message: "Kuota promo sudah habis.",
    };
  }

  const eligibleSubtotal = items.reduce((total, item) => {
    const isEligible =
      promo.productIds.length === 0 ||
      (item.productId ? promo.productIds.includes(item.productId) : false);

    return isEligible ? total + item.unitPrice.amount * item.quantity : total;
  }, 0);

  if (eligibleSubtotal <= 0) {
    return {
      status: "no-eligible-items",
      promo: null,
      discountAmount: 0,
      eligibleSubtotal,
      message: "Promo tidak berlaku untuk item di keranjang ini.",
    };
  }

  if (eligibleSubtotal < promo.minSubtotal.amount) {
    return {
      status: "minimum-subtotal-not-met",
      promo: null,
      discountAmount: 0,
      eligibleSubtotal,
      message: `Minimal belanja Rp ${promo.minSubtotal.amount.toLocaleString("id-ID")}.`,
    };
  }

  const discountAmount =
    promo.type === "percentage"
      ? Math.floor((eligibleSubtotal * promo.value) / 100)
      : promo.type === "fixed-amount"
        ? Math.min(eligibleSubtotal, promo.value)
        : shippingFee;

  return {
    status: "valid",
    promo,
    discountAmount,
    eligibleSubtotal,
    message: "Promo berhasil diterapkan.",
  };
}

export function CheckoutShell({ products, ampasListings, promos }: CheckoutShellProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [courier, setCourier] = useState("jne");
  const [paymentMethod, setPaymentMethod] = useState("qris");

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [payError, setPayError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");
  const [paymentInstruction, setPaymentInstruction] = useState<PaymentInstruction | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState("");

  const [ordersHistory, setOrdersHistory] = useState<OrderHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [invoiceItems, setInvoiceItems] = useState<
    (CartItem & {
      name: string;
      imageSrc: string;
      imageAlt: string;
      wholesaleEnabled?: boolean;
      wholesaleMinQtyKg?: number;
      wholesalePricePerKg?: Money | null;
      normalPricePerKg?: Money | null;
    })[]
  >([]);
  const [invoiceSubtotal, setInvoiceSubtotal] = useState(0);
  const [invoiceShippingFee, setInvoiceShippingFee] = useState(0);
  const [invoicePlatformFee, setInvoicePlatformFee] = useState(0);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceGrandTotal, setInvoiceGrandTotal] = useState(0);

  const courierRates: Record<string, number> = {
    jne: 15000,
    jnt: 18000,
    sicepat: 12000,
    gosend: 25000,
  };

  const courierNames: Record<string, string> = {
    jne: "JNE Regular",
    jnt: "J&T Express",
    sicepat: "SiCepat Halu",
    gosend: "GoSend Instant",
  };

  const resolvedItems = useMemo(
    () =>
      items.map((item) => {
        if (item.kind === "product") {
          const prod = products.find((product) => product.id === item.productId);
          return {
            ...item,
            name: prod?.name || "Produk Nilam",
            imageSrc:
              prod?.image.src ||
              "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
            imageAlt: prod?.image.alt || "Produk",
            wholesaleEnabled: false,
            wholesaleMinQtyKg: 0,
            wholesalePricePerKg: null,
            normalPricePerKg: prod?.price || item.unitPrice,
          };
        }

        const ampas = ampasListings.find((listing) => listing.id === item.ampasListingId);
        return {
          ...item,
          name: ampas
            ? ampas.slug
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : "Ampas Nilam B2B",
          imageSrc:
            ampas?.image.src ||
            "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
          imageAlt: ampas?.image.alt || "Ampas Nilam",
          wholesaleEnabled: ampas?.wholesaleEnabled || false,
          wholesaleMinQtyKg: ampas?.wholesaleMinQtyKg || 0,
          wholesalePricePerKg: ampas?.wholesalePricePerKg || null,
          normalPricePerKg: ampas?.pricePerKg || item.unitPrice,
        };
      }),
    [ampasListings, items, products],
  );

  const subtotal = resolvedItems.reduce(
    (acc, item) => acc + item.unitPrice.amount * item.quantity,
    0,
  );
  const platformFee = subtotal > 0 ? 2000 : 0;
  const shippingFee = subtotal > 0 ? courierRates[courier] : 0;
  const appliedPromoResult = appliedPromo
    ? validatePromoCodeFromDb(appliedPromo.code, items, promos, shippingFee)
    : null;
  const discountAmount =
    appliedPromoResult?.status === "valid" ? appliedPromoResult.discountAmount : 0;
  const grandTotal = Math.max(0, subtotal + platformFee + shippingFee - discountAmount);
  const isFormValid = receiverName && phone && address && city && province;

  const loadOrderHistory = useCallback(async () => {
    try {
      const data = await fetchOrderHistoryAction();
      setOrdersHistory(data);
    } catch (error) {
      console.error("Failed to load order history", error);
    }
  }, []);

  const completePaidOrder = useCallback(async () => {
    setIsPaymentOpen(false);
    setIsSuccess(true);
    clearCart();
    await loadOrderHistory();
  }, [clearCart, loadOrderHistory]);

  const handleConfirmPayment = useCallback(async () => {
    if (!generatedOrderId || isConfirmingPayment) return;

    setIsConfirmingPayment(true);
    setPayError("");

    try {
      const result = await confirmPaymentAction(generatedOrderId);
      if (result.ok) {
        setPaymentStatus("paid");
        await completePaidOrder();
      } else {
        setPayError(result.message || "Gagal mengonfirmasi pembayaran.");
      }
    } catch {
      setPayError("Koneksi server gagal.");
    } finally {
      setIsConfirmingPayment(false);
    }
  }, [completePaidOrder, generatedOrderId, isConfirmingPayment]);

  const checkPaymentStatus = useCallback(
    async (orderId = generatedOrderId) => {
      if (!orderId) return;

      setIsCheckingPayment(true);
      setPayError("");

      try {
        const response = await fetch(`/api/payments/${orderId}/status`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          paymentStatus?: PaymentStatus;
          payment?: PaymentInstruction | null;
          message?: string;
        };

        if (!response.ok) {
          setPayError(payload.message || "Gagal mengecek status pembayaran.");
          return;
        }

        if (payload.payment) {
          setPaymentInstruction(payload.payment);
        }

        if (payload.paymentStatus) {
          setPaymentStatus(payload.paymentStatus);
        }

        if (payload.paymentStatus === "paid") {
          await completePaidOrder();
        } else if (payload.paymentStatus === "failed" || payload.paymentStatus === "expired") {
          setPayError("Pembayaran sudah berstatus final. Silakan buat pesanan baru bila diperlukan.");
        }
      } catch (error) {
        console.error(error);
        setPayError("Koneksi server gagal saat mengecek status pembayaran.");
      } finally {
        setIsCheckingPayment(false);
      }
    },
    [completePaidOrder, generatedOrderId],
  );

  useEffect(() => {
    if (!isPaymentOpen || !generatedOrderId || paymentStatus !== "pending") return;

    const intervalId = window.setInterval(() => {
      void checkPaymentStatus(generatedOrderId);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, [checkPaymentStatus, generatedOrderId, isPaymentOpen, paymentStatus]);

  const handleApplyPromo = () => {
    setPromoError("");
    const result = validatePromoCodeFromDb(promoCodeInput, items, promos, shippingFee);

    if (result.status === "valid" && result.promo) {
      setAppliedPromo(result.promo);
    } else {
      setAppliedPromo(null);
      setPromoError(result.message);
    }

    setPromoCodeInput("");
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  const handlePayClick = async () => {
    if (!isFormValid || isCreatingPayment) return;

    setIsCreatingPayment(true);
    setPayError("");
    setPaymentStatus("pending");

    setInvoiceSubtotal(subtotal);
    setInvoiceShippingFee(shippingFee);
    setInvoicePlatformFee(platformFee);
    setInvoiceDiscount(discountAmount);
    setInvoiceGrandTotal(grandTotal);
    setInvoiceItems(resolvedItems);

    try {
      const response = await checkoutAction({
        receiverName,
        phone,
        address,
        city,
        province,
        courierCode: courier,
        paymentMethod,
        promoCode: appliedPromo?.code ?? "",
      });

      if (response.ok && response.orderId && response.payment) {
        setGeneratedOrderId(response.orderId);
        setPaymentInstruction(response.payment);
        setPaymentStatus(response.payment.status);
        setIsPaymentOpen(true);
      } else {
        setPayError(response.message || "Gagal memproses transaksi.");
      }
    } catch (error) {
      console.error(error);
      setPayError("Koneksi server gagal.");
    } finally {
      setIsCreatingPayment(false);
    }
  };

  const handleToggleHistory = () => {
    if (!showHistory && ordersHistory.length === 0) {
      void loadOrderHistory();
    }

    setShowHistory((current) => !current);
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="rounded-[32px] border border-line bg-white-soft py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-cream-100 text-brand-900">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h3 className="mt-5 text-xl font-bold text-brand-950">Keranjang Anda Kosong</h3>
          <p className="mt-2 text-xs text-ink-600 px-6 max-w-md mx-auto leading-relaxed">
            Anda belum menambahkan produk nilam atsiri B2C atau listing ampas B2B ke dalam keranjang belanja.
          </p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link
              href="/products"
              className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold transition-all inline-flex items-center justify-center gap-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              style={{ touchAction: "manipulation" }}
            >
              Beli Produk B2C
            </Link>
            <Link
              href="/ampas"
              className="h-10 px-5 rounded-xl border border-line bg-white-soft text-brand-900 hover:bg-cream-50 text-xs font-bold transition-all inline-flex items-center justify-center gap-2 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500"
              style={{ touchAction: "manipulation" }}
            >
              Bursa Ampas B2B
            </Link>
            <button
              onClick={handleToggleHistory}
              className="h-10 px-5 rounded-xl border border-brand-900/20 text-brand-900 text-xs font-bold hover:bg-brand-50 transition-all cursor-pointer"
              type="button"
            >
              {showHistory ? "Sembunyikan Pesanan" : "Pesanan Saya"}
            </button>
          </div>
        </div>

        {showHistory && ordersHistory.length > 0 && (
          <div className="rounded-[32px] border border-line bg-white-soft p-6 space-y-6 shadow-sm animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-brand-900" />
                <h4 className="text-base font-extrabold text-brand-950">Pesanan Saya</h4>
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {ordersHistory.map((order) => (
                <div
                  key={order.orderId}
                  className="rounded-2xl border border-line/60 bg-white p-4 space-y-3 text-xs hover:border-brand-900/30 transition-colors"
                >
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="font-mono font-bold text-brand-950 text-sm block">
                        {order.orderId}
                      </span>
                      <span className="text-[10px] text-ink-600 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <span className="inline-block bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                      DB-backed
                    </span>
                  </div>

                  <div className="border-t border-line/40 pt-2 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={`${order.orderId}-${item.kind}-${idx}`} className="flex justify-between text-ink-700">
                        <span>
                          {item.name} <span className="text-[10px] text-ink-600">x{item.quantity}</span>
                        </span>
                        <span className="font-semibold text-brand-950">
                          Rp {(item.unitPrice * item.quantity).toLocaleString("id-ID")}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-line/45 pt-2 flex justify-between items-center font-bold text-brand-950">
                    <span>Total Pembayaran:</span>
                    <span>Rp {order.grandTotal.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500 print:p-0 print:border-0">
        <div className="rounded-[32px] border border-line bg-white-soft p-6 sm:p-8 space-y-6 shadow-xl print:shadow-none print:border-none print:p-0">
          <div className="text-center print:hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-brand-950 font-serif-accent italic">
              Transaksi Berhasil!
            </h3>
            <p className="mt-1 text-xs text-ink-600">
              Pembayaran Anda telah diverifikasi melalui Midtrans Core.
            </p>
          </div>

          <hr className="border-line/60 print:hidden" />

          <div className="flex justify-between items-start text-xs border-b border-line pb-4 flex-wrap gap-2">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">
                Order ID
              </span>
              <span className="font-mono font-bold text-brand-950 text-sm">{generatedOrderId}</span>
            </div>
            <div className="text-right">
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">
                Status Pembayaran
              </span>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mt-0.5">
                Paid / Lunas
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">
              Rincian Barang
            </span>
            <div className="divide-y divide-line/60 border border-line rounded-2xl overflow-hidden bg-white px-4">
              {invoiceItems.map((item) => {
                const isWholesaleActive = !!(
                  item.wholesaleEnabled &&
                  item.wholesaleMinQtyKg &&
                  item.wholesalePricePerKg &&
                  item.quantity >= item.wholesaleMinQtyKg
                );
                const savings =
                  isWholesaleActive && item.normalPricePerKg
                    ? (item.normalPricePerKg.amount - item.unitPrice.amount) * item.quantity
                    : 0;

                return (
                  <div key={item.id} className="py-3.5 flex flex-col justify-center text-xs gap-1.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-brand-950">{item.name}</span>
                        <span className="text-[10px] text-ink-600 block">
                          Qty: {item.quantity} x Rp {item.unitPrice.amount.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <span className="font-bold text-brand-950">
                        Rp {(item.unitPrice.amount * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                    {isWholesaleActive && (
                      <div className="rounded-xl border border-emerald-250 bg-emerald-50/50 px-3 py-2 text-[10px] text-emerald-800 flex justify-between items-center font-semibold">
                        <span className="flex items-center gap-1.5 font-bold">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Harga Grosir Diterapkan
                        </span>
                        <span>Hemat Rp {savings.toLocaleString("id-ID")}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs pt-2">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">
                Penerima
              </span>
              <span className="font-bold text-brand-950 block mt-0.5">{receiverName}</span>
              <span className="text-ink-700">{phone}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">
                Alamat Pengiriman
              </span>
              <p className="text-ink-700 block mt-0.5 leading-relaxed">
                {address}, {city}, {province}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs border-t border-line/60 pt-4">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">
                Metode Pengiriman
              </span>
              <span className="font-bold text-brand-950 block mt-0.5">{courierNames[courier]}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">
                Metode Pembayaran
              </span>
              <span className="font-bold text-brand-950 block mt-0.5 uppercase">
                {paymentMethod} (Midtrans Core)
              </span>
            </div>
          </div>

          <hr className="border-line/60" />

          <div className="space-y-2.5 text-xs pt-2">
            <div className="flex justify-between items-center text-ink-600">
              <span>Subtotal Pembelian:</span>
              <span className="font-bold text-brand-950">
                Rp {invoiceSubtotal.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-600">
              <span>Biaya Platform:</span>
              <span className="font-semibold text-brand-950">
                Rp {invoicePlatformFee.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between items-center text-ink-600">
              <span>Biaya Pengiriman:</span>
              <span className="font-semibold text-brand-950">
                Rp {invoiceShippingFee.toLocaleString("id-ID")}
              </span>
            </div>
            {invoiceDiscount > 0 && (
              <div className="flex justify-between items-center text-emerald-700 font-bold">
                <span>Diskon Promo:</span>
                <span>-Rp {invoiceDiscount.toLocaleString("id-ID")}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-line/60">
              <span className="font-bold text-brand-950 text-sm">Grand Total:</span>
              <span className="text-lg font-extrabold text-brand-950">
                Rp {invoiceGrandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-line/60 print:hidden">
            <button
              onClick={() => window.print()}
              className="h-11 px-5 rounded-2xl border border-line bg-cream-50 hover:bg-cream-100 text-brand-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              type="button"
            >
              <Printer className="h-4 w-4" />
              Cetak Invoice
            </button>
            <Button
              onClick={() => setIsSuccess(false)}
              className="h-11 px-6 rounded-2xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Belanja Lagi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start animate-in fade-in duration-300">
      <div className="space-y-6">
        <CartItemsList
          resolvedItems={resolvedItems}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />

        <ShippingForm
          receiverName={receiverName}
          setReceiverName={setReceiverName}
          phone={phone}
          setPhone={setPhone}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
          province={province}
          setProvince={setProvince}
          courier={courier}
          setCourier={setCourier}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </div>

      <aside className="space-y-6 lg:sticky lg:top-28">
        <OrderSummaryCard
          subtotal={subtotal}
          platformFee={platformFee}
          shippingFee={shippingFee}
          discountAmount={discountAmount}
          grandTotal={grandTotal}
          isFormValid={!!isFormValid && !isCreatingPayment}
          promoCodeInput={promoCodeInput}
          onPromoCodeInputChange={setPromoCodeInput}
          appliedPromo={appliedPromo}
          availablePromos={promos}
          onApplyPromo={handleApplyPromo}
          onRemovePromo={handleRemovePromo}
          promoError={payError || promoError}
          onPayClick={handlePayClick}
          onPromoSelect={(code) => {
            setPromoError("");
            const result = validatePromoCodeFromDb(code, items, promos, shippingFee);
            if (result.status === "valid" && result.promo) {
              setAppliedPromo(result.promo);
              setPromoCodeInput("");
            } else {
              setAppliedPromo(null);
              setPromoError(result.message);
              setPromoCodeInput(code);
            }
          }}
        />
      </aside>

      {isPaymentOpen && paymentInstruction && (
        <PaymentCoreModal
          orderId={generatedOrderId}
          payment={paymentInstruction}
paymentStatus={paymentStatus}
           isChecking={isCheckingPayment}
           isConfirming={isConfirmingPayment}
           payError={payError}
           onClose={() => setIsPaymentOpen(false)}
           onCheckStatus={() => void checkPaymentStatus(generatedOrderId)}
           onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
}
