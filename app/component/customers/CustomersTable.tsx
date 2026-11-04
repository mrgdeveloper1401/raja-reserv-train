// app/component/customers/CustomersTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, User, Phone, ShoppingBag, ArrowLeft } from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import type { PassengerListItem } from "../../types/index.type";

interface Props {
  passengers: PassengerListItem[];
  total: number;
  page: number;
  pageSize: number;
  currentSearch: string;
}

export function CustomersTable({
  passengers,
  total,
  page,
  pageSize,
  currentSearch,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // هندل کردن جستجو
  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // ساخت لینک صفحه‌بندی با حفظ فیلتر جستجو
  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-amber-500/10 p-5">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/50" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی مشتری (نام یا موبایل)..."
            className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] py-2.5 pr-10 pl-4 text-sm text-amber-50 placeholder:text-amber-200/20 outline-none focus:border-amber-400/60"
          />
        </form>
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
            {passengers.map((c) => (
              <tr
                key={c.id}
                className="border-b border-amber-500/5 hover:bg-amber-500/5"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-amber-50">
                      {c.full_name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="flex items-center gap-1.5 font-mono text-amber-100/70"
                    dir="ltr"
                  >
                    <Phone className="h-3.5 w-3.5 text-amber-400/60" />
                    {c.phone}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="flex items-center gap-1.5 text-amber-100/70">
                    <ShoppingBag className="h-3.5 w-3.5 text-amber-400/60" />
                    {c.orders_count} سفارش
                  </span>
                </td>
                <td className="px-5 py-4 font-mono text-amber-100/60" dir="ltr">
                  {c.last_order_date || "—"}
                </td>
                <td className="px-5 py-4">
                  <Link
                    href={`/admin/customers/${c.id}`}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                  >
                    جزئیات <ArrowLeft className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
            {passengers.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-12 text-center text-amber-100/30"
                >
                  مشتری‌ای با این مشخصات پیدا نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-amber-500/10 px-4 py-3 text-xs text-amber-100/50">
          <span>
            صفحه {page} از {totalPages} (کل {total} مشتری)
          </span>
          <div className="flex items-center gap-1">
            {page > 1 ? (
              <Link href={buildPageUrl(page - 1)}>
                <Button size="sm" variant="outline">
                  قبلی
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" disabled>
                قبلی
              </Button>
            )}

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <Link key={p} href={buildPageUrl(p)}>
                  <button
                    className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                      p === page
                        ? "bg-amber-500/20 text-amber-100 border border-amber-500/30"
                        : "text-amber-100/50 hover:bg-amber-500/10"
                    }`}
                  >
                    {p}
                  </button>
                </Link>
              );
            })}

            {page < totalPages ? (
              <Link href={buildPageUrl(page + 1)}>
                <Button size="sm" variant="outline">
                  بعدی
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="outline" disabled>
                بعدی
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
