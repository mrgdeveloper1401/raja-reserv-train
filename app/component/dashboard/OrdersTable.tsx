// app/component/dashboard/OrdersTable.tsx
import Link from "next/link";
import { ArrowLeft, Clock, Train } from "lucide-react";
import { Card } from "../ui/Card";
import { StatusBadge } from "../../component/ui/StatusBadge";
import type { Order } from "../../types/index.type";

interface Props {
  orders: Order[];
}

export function OrdersTable({ orders }: Props) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-amber-500/10 p-5">
        <div>
          <h2 className="text-base font-bold text-amber-50">سفارشات پیش‌فروش</h2>
          <p className="mt-1 text-xs text-amber-100/40">
            {orders.length} سفارش فعال
          </p>
        </div>
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 transition"
        >
          مشاهده‌ی همه
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amber-500/10 text-right text-xs text-amber-100/40">
              <th className="px-5 py-3 font-medium">شماره</th>
              <th className="px-5 py-3 font-medium">مسیر</th>
              <th className="px-5 py-3 font-medium">تاریخ</th>
              <th className="px-5 py-3 font-medium">قطار</th>
              <th className="px-5 py-3 font-medium">مسافر</th>
              <th className="px-5 py-3 font-medium">وضعیت</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b border-amber-500/5 transition hover:bg-amber-500/5"
              >
                <td className="px-5 py-4 font-mono text-amber-400">
                  {o.code}
                </td>
                <td className="px-5 py-4 text-amber-50">
                  {o.from} ← {o.to}
                </td>
                <td className="px-5 py-4 text-amber-100/60" dir="ltr">
                  {o.date}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-amber-100/60">
                    <Train className="h-3.5 w-3.5" />
                    <span dir="ltr">{o.trainNumbers.join(", ")}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-amber-100/60">
                  {o.passengerIds.length} نفر
                </td>
                <td className="px-5 py-4">
                  <StatusBadge status={o.status} />
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-amber-100/30">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-amber-500/30" />
                  سفارشی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}