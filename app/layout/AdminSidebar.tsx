// app/layout/AdminSidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ListOrdered,
  Users,
  LogOut,
  Sparkles,
  // RotateCcw,
} from "lucide-react";

const items = [
  { label: "داشبورد", href: "/admin", icon: LayoutDashboard },
  { label: "سفارشات", href: "/admin/orders", icon: ListOrdered },
  { label: "مشتریان", href: "/admin/customers", icon: Users },
  { label: "ثبت سفارش", href: "/admin/create_order", icon: ListOrdered },
  // { label: "استرداد بلیط", href: "/admin/restitution", icon: RotateCcw },
  { label: "حساب رجا", href: "/admin/raja_account", icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-l border-amber-500/10 bg-[#0f0d0a]">
      {/* لوگو */}
      <div className="flex h-16 items-center gap-2 border-b border-amber-500/10 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
          <Sparkles className="h-5 w-5 text-[#0f0d0a]" />
        </span>
        <div>
          <p className="text-sm font-black bg-gradient-to-l from-amber-400 to-orange-500 bg-clip-text text-transparent">
            رجا
          </p>
          <p className="text-[10px] text-amber-200/40">پنل مدیریت</p>
        </div>
      </div>

      {/* منو */}
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-amber-500/15 text-amber-100 border border-amber-500/30"
                  : "text-amber-100/60 hover:bg-amber-500/10 hover:text-amber-100 border border-transparent"
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* دکمه خروج (با فرم) */}
      <div className="border-t border-amber-500/10 p-3">
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="h-4.5 w-4.5" />
            خروج از حساب
          </button>
        </form>
      </div>

      <div className="border-t border-amber-500/10 p-4 text-[10px] text-amber-200/30">
        نسخه ۱.۰.۰
      </div>
    </aside>
  );
}
