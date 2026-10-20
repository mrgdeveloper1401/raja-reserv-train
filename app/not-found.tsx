// app/not-found.tsx
import Link from "next/link";
import { Compass, Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0f0d0a] px-4 text-center">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="relative">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl shadow-amber-500/30">
          <Compass className="h-10 w-10 text-[#0f0d0a]" />
        </div>

        <p className="text-7xl font-black bg-gradient-to-l from-amber-400 to-orange-500 bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-4 text-2xl font-bold text-amber-50">
          صفحه‌ای که دنبالش بودی پیدا نشد
        </h1>
        <p className="mt-3 max-w-md text-sm leading-7 text-amber-100/50">
          شاید آدرس اشتباه وارد شده یا این صفحه حذف شده باشد. می‌تونی به خانه برگردی.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-6 py-3 font-bold text-[#0f0d0a] shadow-lg shadow-amber-500/25 transition hover:brightness-110"
          >
            <Home className="h-4 w-4" />
            صفحه‌ی اصلی
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-amber-500/25 px-6 py-3 text-sm text-amber-100/70 transition hover:bg-amber-500/10 hover:text-amber-100"
          >
            داشبورد من
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}