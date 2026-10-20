// app/component/OrdersDataTable.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpDown } from "lucide-react";
import { Card } from "../../component/ui/Card";
import { StatusBadge } from "../../component/ui/StatusBadge";
import { Button } from "../../component/ui/Button";
import type { Order } from "../../types/index.type";

type SortKey = "code" | "date" | "status";

interface Props {
  orders: Order[];
  page: number;
  pageSize: number;
  onPageChange: (p: number) => void;
}

export function OrdersDataTable({ orders, page, pageSize, onPageChange }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("code");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = [...orders].sort((a, b) => {
    const va = a[sortKey];
    const vb = b[sortKey];
    if (va < vb) return sortDir === "asc" ? -1 : 1;
    if (va > vb) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = sorted.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amber-500/10 bg-[#0f0d0a]/60 text-right text-xs text-amber-100/40">
              <th className="px-4 py-3 font-medium">
                <button
                  onClick={() => handleSort("code")}
                  className="flex items-center gap-1 hover:text-amber-200"
                >
                  شماره
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 font-medium">مسیر</th>
              <th className="px-4 py-3 font-medium">
                <button
                  onClick={() => handleSort("date")}
                  className="flex items-center gap-1 hover:text-amber-200"
                >
                  تاریخ
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 font-medium">قطار</th>
              <th className="px-4 py-3 font-medium">مسافر</th>
              <th className="px-4 py-3 font-medium">
                <button
                  onClick={() => handleSort("status")}
                  className="flex items-center gap-1 hover:text-amber-200"
                >
                  وضعیت
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {paged.map((o) => (
              <tr
                key={o.id}
                className="border-b border-amber-500/5 transition hover:bg-amber-500/5"
              >
                <td className="px-4 py-4 font-mono text-amber-400">
                  {o.code}
                </td>
                <td className="px-4 py-4 text-amber-50">
                  {o.from} ← {o.to}
                </td>
                <td className="px-4 py-4 text-amber-100/60" dir="ltr">
                  {o.date}
                </td>
                <td className="px-4 py-4 text-amber-100/60" dir="ltr">
                  {o.trainNumbers.join(", ")}
                </td>
                <td className="px-4 py-4 text-amber-100/60">
                  {o.passengerIds.length} نفر
                </td>
                <td className="px-4 py-4">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                  >
                    جزئیات
                    <ArrowLeft className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-16 text-center text-amber-100/30">
                  سفارشی با این فیلترها پیدا نشد
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
            صفحه {currentPage} از {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              قبلی
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                    p === currentPage
                      ? "bg-amber-500/20 text-amber-100 border border-amber-500/30"
                      : "text-amber-100/50 hover:bg-amber-500/10"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              بعدی
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}