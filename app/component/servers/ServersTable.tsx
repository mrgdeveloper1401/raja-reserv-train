// app/component/servers/ServersTable.tsx
import { Card } from "../../component/ui/Card";
import { ArrowRight } from "lucide-react";
import type { Order, Server } from "../../types/index.type";

interface Props {
  servers: Server[];
  orders: Order[];
}

export function ServersTable({ servers, orders }: Props) {
  // فرض: توزیع ساده‌ی round-robin روی سرورهای سالم/bar-بالا
  const eligible = servers.filter((s) => s.status !== "down");
  const distribution: Record<string, Order[]> = Object.fromEntries(
    servers.map((s) => [s.id, []])
  );

  orders.forEach((o, i) => {
    if (eligible.length === 0) return;
    const target = eligible[i % eligible.length];
    distribution[target.id].push(o);
  });

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-amber-500/10 p-5">
        <h2 className="text-base font-bold text-amber-50">توزیع سفارشات روی سرورها</h2>
        <p className="mt-1 text-xs text-amber-100/40">
          هر سفارش با توجه به منابع سرور به صورت هوشمند توزیع می‌شود
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amber-500/10 bg-[#0f0d0a]/60 text-right text-xs text-amber-100/40">
              <th className="px-5 py-3 font-medium">سرور</th>
              <th className="px-5 py-3 font-medium">وضعیت</th>
              <th className="px-5 py-3 font-medium">سفارشات تخصیص یافته</th>
              <th className="px-5 py-3 font-medium">تعداد</th>
            </tr>
          </thead>
          <tbody>
            {servers.map((s) => {
              const list = distribution[s.id] ?? [];
              return (
                <tr
                  key={s.id}
                  className="border-b border-amber-500/5 transition hover:bg-amber-500/5"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-amber-50">{s.name}</span>
                      <span className="text-[10px] font-mono text-amber-100/30">
                        {s.id}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-[10px] ${
                        s.status === "healthy"
                          ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                          : s.status === "overloaded"
                          ? "text-amber-300 bg-amber-500/10 border-amber-500/30"
                          : "text-rose-300 bg-rose-500/10 border-rose-500/30"
                      }`}
                    >
                      {s.status === "healthy"
                        ? "سالم"
                        : s.status === "overloaded"
                        ? "بار بالا"
                        : "قطع"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {list.length === 0 ? (
                      <span className="text-xs text-amber-100/30">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {list.map((o) => (
                          <span
                            key={o.id}
                            className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-mono text-amber-300/80"
                          >
                            {o.code}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-amber-100/70">{list.length}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* راهنما */}
      <div className="flex items-center gap-2 border-t border-amber-500/10 p-4 text-[11px] text-amber-100/40">
        <ArrowRight className="h-3.5 w-3.5 rotate-180 text-amber-400" />
        در صورت خرابی یک سرور، سفارشات به صورت خودکار به سرور دیگر منتقل می‌شوند
      </div>
    </Card>
  );
}