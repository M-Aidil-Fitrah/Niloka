export type ToastType = "success" | "error" | "warning" | "info";

export type ToastEventDetail = {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
};

export const NILOKA_TOAST_EVENT = "show-niloka-toast";

export function showToast(
  message: string,
  type: ToastType = "info",
  options: Omit<ToastEventDetail, "message" | "type"> = {},
) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>(NILOKA_TOAST_EVENT, {
      detail: {
        message,
        type,
        ...options,
      },
    }),
  );
}
