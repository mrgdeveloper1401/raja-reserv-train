import Link from "next/link";
import {
  Plus,
  MapPin,
  Train,
  Calendar,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { Card } from "../component/ui/Card";
import { StatusBadge } from "../component/ui/StatusBadge";
import { mockOrders } from "../lib/mock-data";

export default function CustomerDashboard() {
  const myOrders = mockOrders.filter((o) => o.userId === "u1");

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-amber-50">داشبورد من</h1>
          <p className="mt-1 text-sm text-amber-100/40">
            سفارشات و فعالیت‌های شما
          </p>
        </div>
        <Link
          href="/dashboard/orders/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-[#0f0d0a] shadow-md shadow-amber-500/25 hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          ثبت سفارش جدید
        </Link>
      </div>

      {/* کارت‌های خلاصه */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <Card>
          <p className="text-xs text-amber-100/50">کل سفارشات</p>
          <p className="mt-2 text-2xl font-black text-amber-50">
            {myOrders.length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-amber-100/50">موفق</p>
          <p className="mt-2 text-2xl font-black text-emerald-400">
            {myOrders.filter((o) => o.status === "success").length}
          </p>
        </Card>
        <Card>
          <p className="text-xs text-amber-100/50">در حال پردازش</p>
          <p className="mt-2 text-2xl font-black text-amber-400">
            {
              myOrders.filter((o) =>
                ["processing", "booking"].includes(o.status),
              ).length
            }
          </p>
        </Card>
      </div>

      {/* لیست سفارشات */}
      <div>
        <h2 className="mb-4 text-base font-bold text-amber-50">سفارشات اخیر</h2>
        <div className="space-y-3">
          {myOrders.map((o) => (
            <Card key={o.id}>
              <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10">
                    <ShoppingBag className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-amber-400">
                        {o.code}
                      </span>
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-amber-100/50">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {o.from} ← {o.to}
                      </span>
                      <span className="flex items-center gap-1" dir="ltr">
                        <Calendar className="h-3 w-3" />
                        {o.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Train className="h-3 w-3" />
                        {o.trainNumbers.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/dashboard/orders/${o.id}`}
                  className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                >
                  جزئیات <ArrowLeft className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
