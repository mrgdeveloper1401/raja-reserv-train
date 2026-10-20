// app/component/reports/SuccessRateChart.tsx
"use client";
import { Card } from "../../component/ui/Card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { mockDailyReports } from "../../lib/mock-data";

export function SuccessRateChart() {
  const data = mockDailyReports.map((d) => ({
    date: d.date,
    rate: d.successRate,
  }));

  return (
    <Card>
      <h2 className="mb-4 text-base font-bold text-amber-50">نرخ موفقیت (۷ روز اخیر)</h2>
      <div className="h-64 w-full" dir="ltr">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="rateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#f59e0b" strokeOpacity={0.05} />
            <XAxis dataKey="date" stroke="#d4a056" fontSize={11} />
            <YAxis stroke="#d4a056" fontSize={11} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "#161210",
                border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 12,
                fontSize: 12,
                color: "#fde68a",
              }}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#rateGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}