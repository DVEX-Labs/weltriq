"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  message?: string;
}

interface ToastContextValue {
  showToast: (variant: ToastVariant, title: string, message?: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const AUTO_DISMISS_MS = 4500;
const MAX_VISIBLE_TOASTS = 3;

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  const dismiss = useCallback((id: string) => {
    const existing = timersRef.current.get(id);
    if (existing) {
      clearTimeout(existing);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (variant: ToastVariant, title: string, message?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

      setToasts((prev) => {
        const next = [...prev, { id, variant, title, message }];
        if (next.length > MAX_VISIBLE_TOASTS) {
          const evicted = next.shift();
          if (evicted) {
            const t = timersRef.current.get(evicted.id);
            if (t) {
              clearTimeout(t);
              timersRef.current.delete(evicted.id);
            }
          }
        }
        return next;
      });

      const timer = setTimeout(() => {
        dismiss(id);
      }, AUTO_DISMISS_MS);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, message?: string) => showToast("success", title, message),
    [showToast]
  );
  const error = useCallback(
    (title: string, message?: string) => showToast("error", title, message),
    [showToast]
  );
  const info = useCallback(
    (title: string, message?: string) => showToast("info", title, message),
    [showToast]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, dismiss }}>
      {children}

      {/* Global WELTRIQ Brand Toast Stack — Positioned cleanly away from floating WhatsApp button */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          aria-atomic="true"
          className={`fixed right-3 sm:right-6 z-[70] flex flex-col gap-2.5 w-[calc(100%-1.5rem)] sm:w-full max-w-sm pointer-events-none ${
            isAdmin ? "top-16 md:top-5" : "top-20 sm:top-24"
          }`}
        >
          {toasts.map((t) => {
            const isError = t.variant === "error";
            const isInfo = t.variant === "info";

            return (
              <div
                key={t.id}
                role="status"
                className={`pointer-events-auto relative overflow-hidden rounded-2xl bg-[#0C1533]/98 text-white shadow-[0_18px_45px_rgba(12,21,51,0.38)] backdrop-blur-md border animate-in fade-in slide-in-from-top-3 duration-300 ${
                  isError
                    ? "border-red-500/40"
                    : "border-[#FFC627]/35"
                }`}
              >
                {/* Top Brand Accent Stripe */}
                <div
                  className={`h-1 w-full ${
                    isError
                      ? "bg-gradient-to-r from-red-500 via-rose-400 to-red-500"
                      : "bg-gradient-to-r from-[#FFC627] via-amber-300 to-[#FFC627]"
                  }`}
                />

                <div className="p-3.5 sm:p-4 flex items-start gap-3">
                  {/* Status Badge */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                      isError
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : isInfo
                          ? "bg-white/10 text-[#FFC627] border-white/20"
                          : "bg-[#FFC627]/15 text-[#FFC627] border-[#FFC627]/35"
                    }`}
                  >
                    {isError ? (
                      <AlertCircle className="w-5 h-5 stroke-[2.2]" />
                    ) : isInfo ? (
                      <Info className="w-5 h-5 stroke-[2.2]" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
                    )}
                  </div>

                  {/* Copy */}
                  <div className="flex-1 min-w-0 pr-1">
                    <h4 className="text-xs font-display uppercase tracking-wider font-bold text-white leading-snug">
                      {t.title}
                    </h4>
                    {t.message && (
                      <p className="text-xs text-[#FFFCEE]/80 font-sans mt-0.5 leading-relaxed">
                        {t.message}
                      </p>
                    )}
                  </div>

                  {/* Dismiss Button */}
                  <button
                    type="button"
                    onClick={() => dismiss(t.id)}
                    className="text-white/45 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
}
