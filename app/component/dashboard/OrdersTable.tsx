// app/component/dashboard/OrdersTable.tsx
import Link from "next/link";
import { ArrowLeft, Clock, Phone, User } from "lucide-react";
import { Card } from "../ui/Card";
import { StatusBadge } from "../ui/StatusBadge";
import type { Reservation } from "../../types/index.type";

interface Props {
  reservations: Reservation[];
}

export function OrdersTable({ reservations }: Props) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-amber-500/10 p-5">
        <div>
          <h2 className="text-base font-bold text-amber-50">۵ رزرو اخیر</h2>
          <p className="mt-1 text-xs text-amber-100/40">
            {reservations.length} رزرو
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
              <th className="px-5 py-3 font-medium">شناسه</th>
              <th className="px-5 py-3 font-medium">مسافر</th>
              <th className="px-5 py-3 font-medium">موبایل</th>
              <th className="px-5 py-3 font-medium">مسیر</th>
              <th className="px-5 py-3 font-medium">تاریخ سفر</th>
              {/* <th className="px-5 py-3 font-medium">وضعیت</th> */}
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr
                key={r.id}
                className="border-b border-amber-500/5 transition hover:bg-amber-500/5"
              >
                <td className="px-5 py-4 font-mono text-amber-400">
                  #{r.id}
                </td>
                <td className="px-5 py-4 text-amber-50">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-amber-100/40" />
                    {r.passenger_first_name} {r.passenger_last_name}
                  </div>
                </td>
                <td className="px-5 py-4 text-amber-100/60" dir="ltr">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-amber-100/40" />
                    {r.passenger_phone}
                  </div>
                </td>
                <td className="px-5 py-4 text-amber-50">
                  {r.origin} ← {r.destination}
                </td>
                <td className="px-5 py-4 text-amber-100/60" dir="ltr">
                  {r.travel_date}
                </td>
                {/* <td className="px-5 py-4">
                  <StatusBadge status={r.status} />
                </td> */}
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-amber-100/30">
                  <Clock className="mx-auto mb-2 h-8 w-8 text-amber-500/30" />
                  رزروی ثبت نشده است
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}