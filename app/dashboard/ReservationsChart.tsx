// app/component/dashboard/ReservationsChart.tsx
"use client";

import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend, Sector } from "recharts";
import { DashboardChartStatus } from "../types/index.type";
import { Card } from "../component/ui/Card";

interface Props {
  stats: DashboardChartStatus;
}

const COLORS = {
  success: "#10b981",
  failed: "#f43f5e",
  pending: "#f59e0b",
  monitoring: "#3b82f6",
  booking: "#8b5cf6",
  redirect_gateway: "#06b6d4",
};

export function ReservationsChart({ stats }: Props) {
  const data = [
    { name: "موفق", value: stats.success_count, color: COLORS.success },
    { name: "ناموفق", value: stats.failed_count, color: COLORS.failed },
    { name: "انتظار", value: stats.pending_count, color: COLORS.pending },
    {
      name: "در حال رصد",
      value: stats.monitoring_count,
      color: COLORS.monitoring,
    },
    { name: "در حال رزرو", value: stats.booking_count, color: COLORS.booking },
    {
      name: "هدایت به درگاه",
      value: stats.redirect_gateway_count,
      color: COLORS.redirect_gateway,
    },
  ].filter((item) => item.value > 0);

  if (data.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <p className="text-amber-100/40 text-sm">
          داده‌ای برای نمایش وجود ندارد.
        </p>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <h2 className="mb-4 text-base font-bold text-amber-50">وضعیت رزروها</h2>
      <div className="h-[300px] w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              shape={(props: any) => {
                const entry = data.find((d) => d.name === props.name);
                return <Sector {...props} fill={entry?.color || "#8884d8"} />;
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f0d0a",
                border: "1px solid rgba(245, 158, 11, 0.2)",
                borderRadius: "8px",
                color: "#fffbeb",
              }}
              itemStyle={{ color: "#fffbeb" }}
              formatter={(value) => [`${value ?? 0} رزرو`, "تعداد"]}
            />
            <Legend
              position="bottom"
              formatter={(value) => (
                <span style={{ color: "#fffbeb" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
