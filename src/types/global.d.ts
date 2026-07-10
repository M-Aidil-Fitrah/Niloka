declare module "midtrans-client";

interface Window {
  snap?: {
    pay: (
      token: string,
      options?: {
        onSuccess?: () => void;
        onPending?: () => void;
        onClose?: () => void;
        onError?: () => void;
      },
    ) => void;
  };
}