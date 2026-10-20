// app/error.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0d0a] px-4 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-400 to-red-600 shadow-2xl shadow-rose-500/30">
          <AlertTriangle className="h-10 w-10 text-[#0f0d0a]" />
        </div>

        <h1 className="text-2xl font-bold text-amber-50">مشکلی پیش آمد</h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-amber-100/50">
          متأسفانه در پردازش درخواست شما خطایی رخ داده. می‌تونی دوباره تلاش کنی یا به خانه برگردی.
        </p>

        {error.digest && (
          <p className="mt-3 text-[11px] font-mono text-amber-100/30" dir="ltr">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={() => reset()}
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-6 py-3 font-bold text-[#0f0d0a] shadow-lg shadow-amber-500/25 transition hover:brightness-110"
          >
            <RefreshCw className="h-4 w-4 transition group-hover:rotate-180" />
            تلاش مجدد
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-amber-500/25 px-6 py-3 text-sm text-amber-100/70 transition hover:bg-amber-500/10 hover:text-amber-100"
          >
            <Home className="h-4 w-4" />
            صفحه‌ی اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}