// app/component/customer/CustomersTable.tsx
"use client";
import { useState } from "react";
import { Search, User, Phone, ShoppingBag, ArrowLeft } from "lucide-react";
import { Card } from "../../component/ui/Card";

const mockCustomers = [
  { id: "u1", name: "علی رضایی", phone: "09121234567", orders: 12, lastOrder: "2025-11-18" },
  { id: "u2", name: "مریم احمدی", phone: "09129876543", orders: 8, lastOrder: "2025-11-17" },
  { id: "u3", name: "حسین کریمی", phone: "09125554433", orders: 5, lastOrder: "2025-11-15" },
  { id: "u4", name: "فاطمه محمدی", phone: "09121112222", orders: 15, lastOrder: "2025-11-18" },
  { id: "u5", name: "رضا نوری", phone: "09123334444", orders: 3, lastOrder: "2025-11-10" },
];

export function CustomersTable() {
  const [search, setSearch] = useState("");

  const filtered = mockCustomers.filter((c) =>
    `${c.name} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-amber-500/10 p-5">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی مشتری..."
            className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] py-2.5 pr-10 pl-4 text-sm text-amber-50 placeholder:text-amber-200/20 outline-none focus:border-amber-400/60"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amber-500/10 bg-[#0f0d0a]/60 text-right text-xs text-amber-100/40">
              <th className="px-5 py-3 font-medium">مشتری</th>
              <th className="px-5 py-3 font-medium">تماس</th>
              <th className="px-5 py-3 font-medium">تعداد سفارش</th>
              <th className="px-5 py-3 font-medium">آخرین سفارش</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-amber-500/5 hover:bg-amber-500/5">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-amber-50">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 font-mono text-amber-100/70" dir="ltr">
                    <Phone className="h-3.5 w-3.5 text-amber-400/60" />
                    {c.phone}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 text-amber-100/70">
                    <ShoppingBag className="h-3.5 w-3.5 text-amber-400/60" />
                    {c.orders} سفارش
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-amber-100/60" dir="ltr">{c.lastOrder}</td>
                <td className="px-5 py-4">
                  <button className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300">
                    جزئیات <ArrowLeft className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}