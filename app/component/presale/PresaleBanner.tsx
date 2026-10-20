// app/component/presale/PresaleBanner.tsx
"use client";
import { useState } from "react";
import { Rocket, AlertCircle } from "lucide-react";

export function PresaleBanner() {
  const [active, setActive] = useState(true);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 transition ${
        active
          ? "border-amber-500/40 bg-gradient-to-l from-amber-500/15 to-orange-500/5"
          : "border-amber-500/15 bg-[#161210]/70"
      }`}
    >
      {/* هاله‌ی نوری */}
      {active && (
        <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-amber-500/20 blur-3xl" />
      )}

      <div className="relative flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
              active
                ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
                : "bg-amber-500/10 border border-amber-500/20"
            }`}
          >
            <Rocket
              className={`h-6 w-6 ${active ? "text-[#0f0d0a]" : "text-amber-400/60"}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-amber-50">
                حالت پیش‌فروش
              </h2>
              {active ? (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  فعال
                </span>
              ) : (
                <span className="rounded-full bg-zinc-500/15 px-2 py-0.5 text-[10px] font-bold text-zinc-400 border border-zinc-500/30">
                  غیرفعال
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-amber-100/50">
              {active
                ? "سیستم به صورت خودکار باز شدن فروش را تشخیص می‌دهد و سفارشات را با اولویت بالا پردازش می‌کند."
                : "با فعال‌سازی، سیستم وارد حالت پیش‌فروش می‌شود و صف را اجرا می‌کند."}
            </p>
          </div>
        </div>

        {/* کلید سوییچ */}
        <button
          type="button"
          onClick={() => setActive((v) => !v)}
          aria-label="تغییر وضعیت پیش‌فروش"
          className={`relative h-9 w-16 shrink-0 rounded-full border transition ${
            active
              ? "border-amber-400/50 bg-amber-500/30"
              : "border-amber-500/20 bg-[#0f0d0a]"
          }`}
        >
          <span
            className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full transition-all ${
              active
                ? "right-1 bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40"
                : "right-8 bg-amber-500/20"
            }`}
          >
            {active && <Rocket className="h-3.5 w-3.5 text-[#0f0d0a]" />}
          </span>
        </button>
      </div>

      {active && (
        <div className="relative mt-4 flex items-start gap-2 rounded-xl bg-amber-500/5 border border-amber-500/15 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <p className="text-xs leading-6 text-amber-100/60">
            در این حالت، ۳۰ سفارش همزمان در صف اجرا قرار می‌گیرند و بسته به
            منابع سرور توزیع می‌شوند.
          </p>
        </div>
      )}
    </div>
  );
}