"use client";

import * as Toast from "@radix-ui/react-toast";
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastVariant = "success" | "error";

type ToastItem = {
  id: string;
  title: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  toast: (title: string, options?: { variant?: ToastVariant }) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(
    (title: string, options?: { variant?: ToastVariant }) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const variant: ToastVariant = options?.variant ?? "success";
    setToasts((prev) => [...prev, { id, title, variant }]);
    },
    []
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      <Toast.Provider swipeDirection="right" duration={2500}>
        {children}

        {toasts.map((t) => (
          <Toast.Root
            key={t.id}
            className={
              "pointer-events-auto flex w-[360px] items-start gap-3 rounded-xl px-4 py-3 shadow-lg " +
              (t.variant === "success"
                ? "border border-green-700/20 bg-green-600 text-white"
                : "border border-red-700/20 bg-red-600 text-white")
            }
            onOpenChange={(open) => {
              if (!open) setToasts((prev) => prev.filter((x) => x.id !== t.id));
            }}
            defaultOpen
          >
            <div className="flex-1">
              <Toast.Title className="text-sm font-semibold">{t.title}</Toast.Title>
            </div>
            <Toast.Close asChild>
              <button
                type="button"
                className="rounded-md px-2 py-1 text-sm text-white/90 hover:bg-white/15"
                aria-label="Close"
              >
                ×
              </button>
            </Toast.Close>
          </Toast.Root>
        ))}

        <Toast.Viewport className="fixed right-4 top-4 z-50 flex max-h-screen w-[360px] flex-col gap-2 outline-none" />
      </Toast.Provider>
    </ToastContext.Provider>
  );
}
