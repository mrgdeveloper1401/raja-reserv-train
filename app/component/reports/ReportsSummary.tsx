// app/component/reports/ReportsSummary.tsx
import { TrendingUp, TrendingDown, Target, Clock } from "lucide-react";
import { Card } from "../../component/ui/Card";

interface Props {
  totalOrders: number;
  successRate: number;
  avgResponse: number;
  growth: number;
}

export function ReportsSummary({ totalOrders, successRate, avgResponse, growth }: Props) {
  const items = [
    { label: "کل سفارشات امروز", value: totalOrders, icon: Target, tone: "text-amber-400 bg-amber-500/10", hint: `+${growth}% نسبت به دیروز` },
    { label: "نرخ موفقیت", value: `${successRate}%`, icon: TrendingUp, tone: "text-emerald-400 bg-emerald-500/10", hint: "میانگین ۷ روز اخیر" },
    { label: "میانگین پاسخ", value: `${avgResponse}s`, icon: Clock, tone: "text-violet-400 bg-violet-500/10", hint: "پاسخ سیستم" },
    { label: "نرخ شکست", value: `${100 - successRate}%`, icon: TrendingDown, tone: "text-rose-400 bg-rose-500/10", hint: "در ۲۴ ساعت اخیر" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-amber-100/50">{it.label}</p>
              <p className="mt-2 text-2xl font-black text-amber-50">{it.value}</p>
              <p className="mt-1 text-[10px] text-amber-100/40">{it.hint}</p>
            </div>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${it.tone}`}>
              <it.icon className="h-4.5 w-4.5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}