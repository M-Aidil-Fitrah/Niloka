"use client";

import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Info,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  NILOKA_TOAST_EVENT,
  type ToastEventDetail,
  type ToastType,
} from "@/lib/toast";
import { cn } from "@/lib/styles";

type ToastItem = Required<Pick<ToastEventDetail, "message" | "type">> &
  Pick<ToastEventDetail, "title" | "duration"> & {
    id: number;
  };

type ToastVisual = {
  title: string;
  icon: LucideIcon;
  accentClassName: string;
  titleClassName: string;
  iconClassName: string;
};

const TOAST_VISUALS: Record<ToastType, ToastVisual> = {
  error: {
    title: "ERROR",
    icon: CircleAlert,
    accentClassName: "bg-[#ff313b]",
    titleClassName: "text-[#e60012]",
    iconClassName: "text-[#ff0015]",
  },
  success: {
    title: "BERHASIL",
    icon: CheckCircle2,
    accentClassName: "bg-emerald-500",
    titleClassName: "text-emerald-700",
    iconClassName: "text-emerald-600",
  },
  warning: {
    title: "PERHATIAN",
    icon: TriangleAlert,
    accentClassName: "bg-amber-400",
    titleClassName: "text-amber-700",
    iconClassName: "text-amber-600",
  },
  info: {
    title: "INFO",
    icon: Info,
    accentClassName: "bg-sky-500",
    titleClassName: "text-sky-700",
    iconClassName: "text-sky-600",
  },
};

function normalizeToast(detail: Partial<ToastEventDetail>, id: number): ToastItem {
  const type = detail.type ?? "info";

  return {
    id,
    title: detail.title,
    message: detail.message ?? "Ada pembaruan dari NILOKA.",
    type,
    duration: detail.duration,
  };
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counterRef = useRef(0);

  useEffect(() => {
    const closeToast = (id: number) => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    };

    const handleToast = (event: Event) => {
      const customEvent = event as CustomEvent<Partial<ToastEventDetail>>;
      counterRef.current += 1;
      const toast = normalizeToast(customEvent.detail ?? {}, counterRef.current);

      setToasts((current) => [...current.slice(-2), toast]);

      window.setTimeout(() => {
        closeToast(toast.id);
      }, toast.duration ?? 4200);
    };

    window.addEventListener(NILOKA_TOAST_EVENT, handleToast);
    return () => window.removeEventListener(NILOKA_TOAST_EVENT, handleToast);
  }, []);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[calc(100vw-2rem)] max-w-[480px] flex-col gap-3 sm:right-6 sm:top-6"
    >
      {toasts.map((toast) => {
        const visual = TOAST_VISUALS[toast.type];
        const Icon = visual.icon;

        return (
          <div
            key={toast.id}
            className="niloka-toast pointer-events-auto relative min-h-[86px] overflow-hidden rounded-[14px] border border-black/5 bg-white px-5 pb-5 pt-6 text-ink-900 shadow-[0_16px_32px_rgba(15,23,42,0.14)]"
            role={toast.type === "error" ? "alert" : "status"}
          >
            <div
              className={cn(
                "absolute inset-x-0 top-0 h-1 rounded-t-[14px]",
                visual.accentClassName,
              )}
            />
            <div className="grid grid-cols-[28px_minmax(0,1fr)_24px] items-start gap-4">
              <Icon
                aria-hidden="true"
                className={cn("mt-0.5 h-5 w-5 stroke-[2.4]", visual.iconClassName)}
              />
              <div className="min-w-0">
                <p
                  className={cn(
                    "text-[15px] font-extrabold uppercase leading-none",
                    visual.titleClassName,
                  )}
                >
                  {toast.title ?? visual.title}
                </p>
                <p className="mt-3 text-[13px] font-semibold leading-relaxed text-slate-600">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup notifikasi"
                onClick={() => {
                  setToasts((current) =>
                    current.filter((currentToast) => currentToast.id !== toast.id),
                  );
                }}
                className="rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5 stroke-[1.8]" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
