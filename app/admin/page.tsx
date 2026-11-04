// app/admin/page.tsx
import { cookies } from "next/headers";
import { Activity, CheckCircle2, XCircle } from "lucide-react";
import { StatCard } from "../component/dashboard/StatCard";
import { OrdersTable } from "../component/dashboard/OrdersTable";
import { getDashboardStatus, getFiveLastReservations } from "../lib/api";

export default async function AdminDashboardPage() {
  // خواندن توکن از کوکی (حتما باید توکن در کوکی ذخیره شده باشد)
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // اگر توکن نبود، می‌توانید کاربر را ریدایرکت کنید یا خطا بدهید
  if (!token) {
    return (
      <div className="flex h-96 items-center justify-center text-amber-100/60">
        لطفا ابتدا وارد حساب کاربری خود شوید.
      </div>
    );
  }

  // دریافت دیتاها به صورت موازی
  const [stats, reservations] = await Promise.all([
    getDashboardStatus(token),
    getFiveLastReservations(token),
  ]);

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

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3">
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
      </div>

      {/* جدول سفارشات */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-1">
        <div className="lg:col-span-2">
          {/* دیتا را به کامپوننت پاس می‌دهیم */}
          <OrdersTable reservations={reservations} />
        </div>
      </div>
    </div>
  );
}
