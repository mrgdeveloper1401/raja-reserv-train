// app/component/reports/ServerPerformanceTable.tsx
import { Card } from "../../component/ui/Card";
import { mockServers } from "../../lib/mock-data";

export function ServerPerformanceTable() {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="border-b border-amber-500/10 p-5">
        <h2 className="text-base font-bold text-amber-50">عملکرد سرورها</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-amber-500/10 bg-[#0f0d0a]/60 text-right text-xs text-amber-100/40">
              <th className="px-5 py-3 font-medium">سرور</th>
              <th className="px-5 py-3 font-medium">وضعیت</th>
              <th className="px-5 py-3 font-medium">سفارشات</th>
              <th className="px-5 py-3 font-medium">CPU</th>
              <th className="px-5 py-3 font-medium">Latency</th>
            </tr>
          </thead>
          <tbody>
            {mockServers.map((s) => (
              <tr key={s.id} className="border-b border-amber-500/5 hover:bg-amber-500/5">
                <td className="px-5 py-3 font-medium text-amber-50">{s.name}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] ${
                    s.status === "healthy" ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                    : s.status === "overloaded" ? "text-amber-300 bg-amber-500/10 border-amber-500/30"
                    : "text-rose-300 bg-rose-500/10 border-rose-500/30"
                  }`}>
                    {s.status === "healthy" ? "سالم" : s.status === "overloaded" ? "بار بالا" : "قطع"}
                  </span>
                </td>
                <td className="px-5 py-3 font-mono text-amber-100/70">{s.activeOrders}/{s.maxOrders}</td>
                <td className="px-5 py-3 font-mono text-amber-100/70">{s.cpu}%</td>
                <td className="px-5 py-3 font-mono text-amber-100/70" dir="ltr">{s.latency}ms</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}