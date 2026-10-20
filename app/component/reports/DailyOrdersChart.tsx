// app/component/reports/DailyOrdersChart.tsx
"use client";
import { Card } from "../../component/ui/Card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { mockDailyReports } from "../../lib/mock-data";

export function DailyOrdersChart() {
  const data = mockDailyReports.map((d) => ({
    date: d.date,
    success: d.successCount,
    failed: d.failedCount,
  }));

  return (
    <Card>
      <h2 className="mb-4 text-base font-bold text-amber-50">سفارشات روزانه</h2>
      <div className="h-64 w-full" dir="ltr">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke="#f59e0b" strokeOpacity={0.05} />
            <XAxis dataKey="date" stroke="#d4a056" fontSize={11} />
            <YAxis stroke="#d4a056" fontSize={11} />
            <Tooltip
              contentStyle={{
                background: "#161210",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 12,
                fontSize: 12,
                color: "#fde68a",
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, color: "#d4a056" }} />
            <Bar dataKey="success" name="موفق" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="failed" name="ناموفق" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}