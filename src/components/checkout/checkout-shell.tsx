"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { CartItemsList } from "./cart-items-list";
import { ShippingForm } from "./shipping-form";
import { OrderSummaryCard } from "./order-summary-card";
import { PaymentSnapModal } from "./payment-snap-modal";
import { ShieldCheck, ShoppingCart, Calendar, Receipt, Trash2, Printer, RefreshCw } from "lucide-react";
import type { Product, AmpasListing, CartItem, Promo } from "@/lib/contracts";
import { getPublicPromoSuggestions, validatePromoCode } from "@/lib/mock-queries";

type CheckoutShellProps = {
  products: Product[];
  ampasListings: AmpasListing[];
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

export function CheckoutShell({ products, ampasListings }: CheckoutShellProps) {
  const { items, updateQuantity, removeItem, clearCart } = useCart();

  const [localProducts, setLocalProducts] = useState<Product[]>(products);
  const [localListings, setLocalListings] = useState<AmpasListing[]>(ampasListings);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedProds = localStorage.getItem("niloka_products");
      if (storedProds) {
        setLocalProducts(JSON.parse(storedProds));
      }
      const storedListings = localStorage.getItem("niloka_ampas_listings");
      if (storedListings) {
        setLocalListings(JSON.parse(storedListings));
      }
    }
  }, []);

  // Form State
  const [receiverName, setReceiverName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [courier, setCourier] = useState("jne");
  const [paymentMethod, setPaymentMethod] = useState("qris");

  // UI Flow State
  const [isSnapOpen, setIsSnapOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  // Promo Coupon State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<Promo | null>(null);
  const [promoError, setPromoError] = useState("");
  const availablePromos = getPublicPromoSuggestions();

  // Order History State
  const [ordersHistory, setOrdersHistory] = useState<OrderHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const loadOrderHistory = () => {
    try {
      const stored = localStorage.getItem("niloka_orders");
      setOrdersHistory(stored ? JSON.parse(stored) : []);
    } catch (e) {
      console.error("Failed to load order history", e);
    }
  };

  // Persistent Snapshots for Invoice Display (after cart is cleared)
  const [invoiceItems, setInvoiceItems] = useState<
    (CartItem & {
      name: string;
      imageSrc: string;
      imageAlt: string;
      wholesaleEnabled?: boolean;
      wholesaleMinQtyKg?: number;
      wholesalePricePerKg?: any;
      normalPricePerKg?: any;
    })[]
  >([]);
  const [invoiceSubtotal, setInvoiceSubtotal] = useState(0);
  const [invoiceShippingFee, setInvoiceShippingFee] = useState(0);
  const [invoicePlatformFee, setInvoicePlatformFee] = useState(0);
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);
  const [invoiceGrandTotal, setInvoiceGrandTotal] = useState(0);

  // Courier Rates mapping
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

  // Helper: resolve item details (name, image, price)
  const resolvedItems = items.map((item) => {
    if (item.kind === "product") {
      const prod = localProducts.find((p) => p.id === item.productId);
      return {
        ...item,
        name: prod?.name || "Produk Nilam",
        imageSrc: prod?.image.src || "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
        imageAlt: prod?.image.alt || "Produk",
        wholesaleEnabled: false,
        wholesaleMinQtyKg: 0,
        wholesalePricePerKg: null,
        normalPricePerKg: prod?.price || item.unitPrice,
      };
    } else {
      const ampas = localListings.find((a) => a.id === item.ampasListingId);
      return {
        ...item,
        name: ampas
          ? ampas.slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
          : "Ampas Nilam B2B",
        imageSrc: ampas?.image.src || "https://images.unsplash.com/photo-1515377905703-c4788e51af15",
        imageAlt: ampas?.image.alt || "Ampas Nilam",
        wholesaleEnabled: ampas?.wholesaleEnabled || false,
        wholesaleMinQtyKg: ampas?.wholesaleMinQtyKg || 0,
        wholesalePricePerKg: ampas?.wholesalePricePerKg || null,
        normalPricePerKg: ampas?.pricePerKg || item.unitPrice,
      };
    }
  });

  // Calculate costs
  const subtotal = resolvedItems.reduce((acc, item) => acc + item.unitPrice.amount * item.quantity, 0);
  const platformFee = subtotal > 0 ? 2000 : 0;
  const shippingFee = subtotal > 0 ? courierRates[courier] : 0;

  const appliedPromoResult = appliedPromo
    ? validatePromoCode(appliedPromo.code, items, shippingFee)
    : null;
  const discountAmount =
    appliedPromoResult?.status === "valid" ? appliedPromoResult.discountAmount : 0;

  const grandTotal = Math.max(0, subtotal + platformFee + shippingFee - discountAmount);

  // Validation
  const isFormValid = receiverName && phone && address && city && province;

  const handlePayClick = () => {
    if (!isFormValid) return;
    setIsSnapOpen(true);
  };

  const handleApplyPromo = () => {
    setPromoError("");
    const result = validatePromoCode(promoCodeInput, items, shippingFee);

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

  const handleSimulateSuccess = () => {
    setIsPaying(true);
    setPayError("");
    setTimeout(() => {
      setIsPaying(false);
      setIsSnapOpen(false);
      setIsSuccess(true);
      const newOrderId = `NLK-TX-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedOrderId(newOrderId);
      
      // Snapshot states for receipt display
      setInvoiceSubtotal(subtotal);
      setInvoiceShippingFee(shippingFee);
      setInvoicePlatformFee(platformFee);
      setInvoiceDiscount(discountAmount);
      setInvoiceGrandTotal(grandTotal);
      setInvoiceItems(resolvedItems);

      // Save order to history
      try {
        const stored = localStorage.getItem("niloka_orders");
        const list = stored ? JSON.parse(stored) : [];
        const newOrder: OrderHistoryItem = {
          orderId: newOrderId,
          date: new Date().toISOString(),
          items: resolvedItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice.amount,
            kind: item.kind,
          })),
          shippingAddress: {
            receiverName,
            phone,
            address,
            city,
            province,
          },
          courier: courierNames[courier],
          paymentMethod,
          subtotal,
          platformFee,
          shippingFee,
          discount: discountAmount,
          grandTotal,
        };
        const nextOrdersHistory = [newOrder, ...list];
        localStorage.setItem("niloka_orders", JSON.stringify(nextOrdersHistory));
        setOrdersHistory(nextOrdersHistory);
      } catch (e) {
        console.error("Failed to persist order to local storage", e);
      }

      clearCart();
    }, 1500);
  };

  const handleSimulateFailure = () => {
    setIsPaying(true);
    setPayError("");
    setTimeout(() => {
      setIsPaying(false);
      setPayError("Pembayaran ditolak. Silakan periksa kembali saldo atau kartu Anda.");
    }, 1200);
  };

  const clearOrderHistory = () => {
    if (confirm("Hapus semua riwayat transaksi Niloka dari perangkat ini?")) {
      localStorage.removeItem("niloka_orders");
      setOrdersHistory([]);
    }
  };

  const handleToggleHistory = () => {
    if (!showHistory && ordersHistory.length === 0) {
      loadOrderHistory();
    }

    setShowHistory((current) => !current);
  };

  // 1. EMPTY CART STATE
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
            <Link href="/products">
              <Button className="h-10 px-5 rounded-xl bg-brand-900 hover:bg-brand-800 text-white-soft text-xs font-bold transition-all">
                Beli Produk B2C
              </Button>
            </Link>
            <Link href="/ampas">
              <Button variant="secondary" className="h-10 px-5 rounded-xl border-line text-xs font-bold hover:bg-cream-50 transition-all">
                Bursa Ampas B2B
              </Button>
            </Link>
            {ordersHistory.length > 0 && (
              <button
                onClick={handleToggleHistory}
                className="h-10 px-5 rounded-xl border border-brand-900/20 text-brand-900 text-xs font-bold hover:bg-brand-50 transition-all cursor-pointer"
              >
                {showHistory ? "Sembunyikan Riwayat" : `Riwayat Transaksi (${ordersHistory.length})`}
              </button>
            )}
          </div>
        </div>

        {/* Local Orders History List */}
        {showHistory && ordersHistory.length > 0 && (
          <div className="rounded-[32px] border border-line bg-white-soft p-6 space-y-6 shadow-sm animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center border-b border-line/60 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-brand-900" />
                <h4 className="text-base font-extrabold text-brand-950">Riwayat Transaksi Lokal</h4>
              </div>
              <button
                onClick={clearOrderHistory}
                className="text-xs font-bold text-red-650 hover:text-red-500 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Hapus Semua
              </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {ordersHistory.map((order) => (
                <div key={order.orderId} className="rounded-2xl border border-line/60 bg-white p-4 space-y-3 text-xs hover:border-brand-900/30 transition-colors">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <span className="font-mono font-bold text-brand-950 text-sm block">{order.orderId}</span>
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
                      Paid / Lunas
                    </span>
                  </div>

                  <div className="border-t border-line/40 pt-2 space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-ink-700">
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

  // 2. SUCCESS INVOICE VIEW
  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in duration-500 print:p-0 print:border-0">
        <div className="rounded-[32px] border border-line bg-white-soft p-6 sm:p-8 space-y-6 shadow-xl print:shadow-none print:border-none print:p-0">
          
          {/* Header Success Check */}
          <div className="text-center print:hidden">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-brand-950 font-serif-accent italic">Transaksi Berhasil!</h3>
            <p className="mt-1 text-xs text-ink-600">
              Pembayaran Anda telah sukses diverifikasi melalui sistem Midtrans mock.
            </p>
          </div>

          <hr className="border-line/60 print:hidden" />

          {/* Invoice Meta */}
          <div className="flex justify-between items-start text-xs border-b border-line pb-4 flex-wrap gap-2">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Order ID</span>
              <span className="font-mono font-bold text-brand-950 text-sm">{generatedOrderId}</span>
            </div>
            <div className="text-right">
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Status Pembayaran</span>
              <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full mt-0.5">
                Paid / Lunas
              </span>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-3">
            <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Rincian Barang</span>
            <div className="divide-y divide-line/60 border border-line rounded-2xl overflow-hidden bg-white px-4">
              {invoiceItems.map((item) => {
                const isWholesaleActive = !!(
                  item.wholesaleEnabled &&
                  item.wholesaleMinQtyKg &&
                  item.wholesalePricePerKg &&
                  item.quantity >= item.wholesaleMinQtyKg
                );
                const savings = isWholesaleActive && item.normalPricePerKg
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

          {/* Buyer Details */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs pt-2">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Penerima</span>
              <span className="font-bold text-brand-950 block mt-0.5">{receiverName}</span>
              <span className="text-ink-700">{phone}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Alamat Pengiriman</span>
              <p className="text-ink-700 block mt-0.5 leading-relaxed">
                {address}, {city}, {province}
              </p>
            </div>
          </div>

          {/* Courier & Payment Method */}
          <div className="grid gap-4 sm:grid-cols-2 text-xs border-t border-line/60 pt-4">
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Metode Pengiriman</span>
              <span className="font-bold text-brand-950 block mt-0.5">{courierNames[courier]}</span>
            </div>
            <div>
              <span className="text-ink-600 block text-[9px] font-bold uppercase tracking-widest">Metode Pembayaran</span>
              <span className="font-bold text-brand-950 block mt-0.5 uppercase">{paymentMethod} (Midtrans Mock)</span>
            </div>
          </div>

          <hr className="border-line/60" />

          {/* Costs breakdown */}
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
                <span>
                  -Rp {invoiceDiscount.toLocaleString("id-ID")}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-line/60">
              <span className="font-bold text-brand-950 text-sm">Grand Total:</span>
              <span className="text-lg font-extrabold text-brand-950">
                Rp {invoiceGrandTotal.toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          {/* Action buttons (Print and Shop Again) */}
          <div className="flex gap-3 justify-end pt-4 border-t border-line/60 print:hidden">
            <button
              onClick={() => window.print()}
              className="h-11 px-5 rounded-2xl border border-line bg-cream-50 hover:bg-cream-100 text-brand-950 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
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

  // 3. EDIT CART & CHECKOUT FORM
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start animate-in fade-in duration-300">
      {/* LEFT COLUMN: Cart items table + Shipping Form */}
      <div className="space-y-6">
        
        {/* Cart Item List */}
        <CartItemsList
          resolvedItems={resolvedItems}
          updateQuantity={updateQuantity}
          removeItem={removeItem}
        />

        {/* Shipping Form */}
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

      {/* RIGHT COLUMN: Sticky Summary checkout card */}
      <aside className="space-y-6 lg:sticky lg:top-28">
        <OrderSummaryCard
          subtotal={subtotal}
          platformFee={platformFee}
          shippingFee={shippingFee}
          discountAmount={discountAmount}
          grandTotal={grandTotal}
          isFormValid={!!isFormValid}
          promoCodeInput={promoCodeInput}
          onPromoCodeInputChange={setPromoCodeInput}
          appliedPromo={appliedPromo}
          availablePromos={availablePromos}
          onApplyPromo={handleApplyPromo}
          onRemovePromo={handleRemovePromo}
          promoError={promoError}
          onPayClick={handlePayClick}
          onPromoSelect={(code) => {
            setPromoError("");
            const result = validatePromoCode(code, items, shippingFee);
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

      {/* MIDTRANS SNAP POPUP SIMULATOR OVERLAY */}
      {isSnapOpen && (
        <PaymentSnapModal
          grandTotal={grandTotal}
          paymentMethod={paymentMethod}
          isPaying={isPaying}
          payError={payError}
          onClose={() => setIsSnapOpen(false)}
          onSimulateSuccess={handleSimulateSuccess}
          onSimulateFailure={handleSimulateFailure}
        />
      )}
    </div>
  );
}
