// app/admin/page.tsx
import { cookies } from "next/headers";
import { Activity, CheckCircle2, XCircle, ShieldAlert, BarChart3 } from "lucide-react";
import { StatCard } from "../component/dashboard/StatCard";
import { OrdersTable } from "../component/dashboard/OrdersTable";
import {
  getDashboardStatus,
  getFiveLastReservations,
  getDashboardChartStatus,
} from "../lib/api";
import { ReservationsChart } from "../dashboard/ReservationsChart";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return (
      <div className="flex h-96 items-center justify-center text-amber-100/60">
        لطفا ابتدا وارد حساب کاربری خود شوید.
      </div>
    );
  }

  // واکشی همزمان هر سه دیتا
  const [stats, reservations, chartStats] = await Promise.all([
    getDashboardStatus(token),
    getFiveLastReservations(token),
    getDashboardChartStatus(token),
  ]);

  const totalStats =
    stats.active_orders_count +
    stats.success_count +
    stats.failed_count +
    stats.solve_captcha;

  return (
    <div className="space-y-6">
      {/* سرصفحه */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-amber-50">داشبورد</h1>
          <p className="mt-1 text-sm text-amber-100/40">
            نمای زنده‌ی وضعیت سیستم و سفارشات
          </p>
        </div>
      </div>

      {/* بخش بالایی: کارت‌ها + نمودار */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ستون سمت راست (کارت‌های آمار + جدول) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="مجموع کل فعالیت‌ها"
              value={totalStats}
              icon={BarChart3}
              tone="blue"
            />
            <StatCard
              label="سفارشات فعال"
              value={stats.active_orders_count}
              icon={Activity}
              tone="amber"
            />
            <StatCard
              label="رزرو موفق"
              value={stats.success_count}
              icon={CheckCircle2}
              tone="emerald"
            />
            <StatCard
              label="رزرو ناموفق"
              value={stats.failed_count}
              icon={XCircle}
              tone="rose"
            />
            <StatCard
              label="حل کپچا"
              value={stats.solve_captcha}
              icon={ShieldAlert}
              tone={"violet"}
            />
          </div>
          <OrdersTable reservations={reservations} />
        </div>

        {/* ستون سمت چپ (نمودار) */}
        <div className="lg:col-span-1">
          <ReservationsChart stats={chartStats} />
        </div>
      </div>
    </div>
  );
}
