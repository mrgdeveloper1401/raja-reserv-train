// app/dashboard/layout.tsx
import Link from "next/link";
import { Sparkles, Plus, User, LogOut } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f0d0a]">
      <header className="sticky top-0 z-40 border-b border-amber-500/15 bg-[#0f0d0a]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
              <Sparkles className="h-5 w-5 text-[#0f0d0a]" />
            </span>
            <span className="text-xl font-black bg-gradient-to-l from-amber-400 to-orange-500 bg-clip-text text-transparent">
              رجا
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/orders/new"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-4 py-2 text-sm font-bold text-[#0f0d0a] shadow-md shadow-amber-500/25 hover:brightness-110"
            >
              <Plus className="h-4 w-4" />
              سفارش جدید
            </Link>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 text-amber-100/60 hover:bg-amber-500/10">
              <User className="h-4 w-4" />
            </button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/20 text-rose-400/70 hover:bg-rose-500/10">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}