// app/component/server/LoadBalancerPanel.tsx
import { Card } from "../../component/ui/Card";
import { ArrowLeftRight, Route } from "lucide-react";
import type { Server } from "../../types/index.type";

interface Props {
  servers: Server[];
}

export function LoadBalancerPanel({ servers }: Props) {
  const totalOrders = servers.reduce((a, s) => a + s.activeOrders, 0);

  return (
    <Card>
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <ArrowLeftRight className="h-4 w-4 text-amber-400" />
          <h2 className="text-base font-bold text-amber-50">Load Balancer</h2>
        </div>
        <span className="rounded-full border border-amber-500/25 bg-amber-500/5 px-2.5 py-1 text-[11px] text-amber-100/60">
          {totalOrders} مسیر همزمان در حال توزیع
        </span>
      </div>

      {/* نمای توزیع */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        {/* ورودی */}
        <div className="flex flex-col items-center gap-2 rounded-xl border border-amber-500/15 bg-[#0f0d0a]/60 p-5 text-center">
          <Route className="h-6 w-6 text-amber-400" />
          <p className="text-sm font-bold text-amber-50">صف سفارشات</p>
          <p className="text-2xl font-black text-amber-400">{totalOrders}</p>
          <p className="text-[11px] text-amber-100/40">سفارش فعال آماده اجرا</p>
        </div>

        {/* فلش */}
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 lg:rotate-0 rotate-90">
          <ArrowLeftRight className="h-4 w-4 text-amber-400" />
        </div>

        {/* خروجی: توزیع روی سرورها */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {servers.map((s) => {
            const load = s.maxOrders ? Math.round((s.activeOrders / s.maxOrders) * 100) : 0;
            const tone =
              s.status === "down"
                ? "border-rose-500/30 bg-rose-500/5"
                : s.status === "overloaded"
                ? "border-amber-500/30 bg-amber-500/5"
                : "border-emerald-500/20 bg-emerald-500/5";
            return (
              <div
                key={s.id}
                className={`rounded-lg border ${tone} p-2.5 text-center`}
              >
                <p className="text-[11px] font-medium text-amber-50">{s.name}</p>
                <p className="mt-1 text-lg font-black text-amber-100">
                  {s.activeOrders}
                  <span className="text-[11px] text-amber-100/40">/{s.maxOrders}</span>
                </p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-amber-500/10">
                  <div
                    className={`h-full rounded-full ${
                      load > 85 ? "bg-rose-500" : load > 70 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${load}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* توضیح سناریو */}
      <div className="mt-5 rounded-xl border border-amber-500/15 bg-[#0f0d0a]/60 p-3 text-[11px] leading-6 text-amber-100/50">
        سناریوی اجرا: <span className="text-amber-300">۶ سرور</span> × روی هر کدام{" "}
        <span className="text-amber-300">۵ سفارش فعال</span> ={" "}
        <span className="text-amber-300">۳۰ مسیر همزمان</span>. در صورت خرابی یک
        سرور، سفارشات به صورت خودکار به سرور دیگر منتقل می‌شود.
      </div>
    </Card>
  );
}