// app/admin/reports/page.tsx
import { ReportsSummary } from "../../component/reports/ReportsSummary";
import { SuccessRateChart } from "../../component/reports/SuccessRateChart";
import { DailyOrdersChart } from "../../component/reports/DailyOrdersChart";
import { ServerPerformanceTable } from "../../component/reports/ServerPerformanceTable";
import { mockStats } from "../../lib/mock-data";

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-amber-50">گزارشات</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          تحلیل عملکرد سیستم و سرورها
        </p>
      </div>

      <ReportsSummary
        totalOrders={125}
        successRate={84}
        avgResponse={mockStats.avgResponseTime}
        growth={12}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SuccessRateChart />
        <DailyOrdersChart />
      </div>

      <ServerPerformanceTable />
    </div>
  );
}