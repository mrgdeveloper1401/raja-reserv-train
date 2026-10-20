// app/component/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, LogIn, Sparkles } from "lucide-react";

const navItems = [
  { label: "صفحه اصلی", href: "/" },
  { label: "درباره ما", href: "#about" },
  { label: "خدمات", href: "#features" },
  { label: "تماس", href: "#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className='sticky top-0 z-50 w-full border-b transition-all duration-300 "border-transparent border-amber-500/20 bg-[#0f0d0a]/90 backdrop-blur-xl shadow-lg shadow-black/3'>
      {/* بقیه کدها بدون تغییر... */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* لوگو */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30 transition group-hover:brightness-110">
            <Sparkles className="h-5 w-5 text-[#0f0d0a]" />
          </span>
          <span className="text-xl font-black bg-gradient-to-l from-amber-400 to-orange-500 bg-clip-text text-transparent">
            رجا
          </span>
        </Link>

        {/* منوی دسکتاپ */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative rounded-lg px-4 py-2 text-sm font-medium text-amber-100/70 transition hover:text-amber-100"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute inset-0 scale-90 rounded-lg bg-amber-500/0 transition duration-200 group-hover:scale-100 group-hover:bg-amber-500/10" />
            </Link>
          ))}
        </nav>

        {/* دکمه‌ها (دسکتاپ) */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="group flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-[#0f0d0a] shadow-md shadow-amber-500/25 transition hover:shadow-amber-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            ورود
          </Link>
        </div>

        {/* دکمه‌ی همبرگری موبایل */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 text-amber-200/80 transition hover:border-amber-400/60 hover:bg-amber-500/10 hover:text-amber-100 md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* منوی موبایل */}
      <div
        className={`overflow-hidden border-t border-amber-500/10 transition-all duration-300 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4 bg-[#0f0d0a]/95 backdrop-blur-xl">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-4 py-3 text-sm font-medium text-amber-100/70 transition hover:bg-amber-500/10 hover:text-amber-100"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-5 py-3 text-sm font-bold text-[#0f0d0a] shadow-md shadow-amber-500/25 transition hover:brightness-110 active:scale-[0.98]"
          >
            <LogIn className="h-4 w-4" />
            ورود به حساب
          </Link>
        </nav>
      </div>
    </header>
  );
}
