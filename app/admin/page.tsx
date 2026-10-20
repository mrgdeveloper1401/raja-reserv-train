// app/admin/page.tsx
import {
  Activity,
  CheckCircle2,
  XCircle,
  Database,
  Server,
  Timer,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "../component/dashboard/StatCard";
import { OrdersTable } from "../component/dashboard/OrdersTable";
import { WorkersPanel } from "../component/dashboard/WorkersPanel";
import { ServersGrid } from "../component/dashboard/ServersGrid";
import { Button } from "../component/ui/Button";
import {
  mockStats,
  mockOrders,
  mockWorkers,
  mockServers,
} from "../lib/mock-data";

export default function AdminDashboardPage() {
  const presaleOrders = mockOrders.filter((o) => o.isPresale);

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
        <Link href="/admin/presale">
          <Button>
            <Rocket className="h-4 w-4" />
            حالت پیش‌فروش
          </Button>
        </Link>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="سفارشات فعال"
          value={mockStats.activeOrders}
          icon={Activity}
          tone="amber"
        />
        <StatCard
          label="ظرفیت پیدا شده"
          value={mockStats.capacitiesFound}
          icon={Database}
          tone="cyan"
        />
        <StatCard
          label="رزرو موفق"
          value={mockStats.successBookings}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="رزرو ناموفق"
          value={mockStats.failedBookings}
          icon={XCircle}
          tone="rose"
        />
        <StatCard
          label="سلامت سرورها"
          value={`${mockStats.serverHealth}%`}
          icon={Server}
          tone="blue"
        />
        <StatCard
          label="میانگین پاسخ"
          value={`${mockStats.avgResponseTime}s`}
          icon={Timer}
          tone="violet"
        />
      </div>

      {/* جدول سفارشات + Workerها */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrdersTable orders={presaleOrders} />
        </div>
        <div>
          <WorkersPanel workers={mockWorkers} />
        </div>
      </div>

      {/* سرورها */}
      <ServersGrid servers={mockServers} />
    </div>
  );
}