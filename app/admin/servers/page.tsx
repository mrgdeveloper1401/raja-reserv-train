// app/admin/server/page.tsx
import { ServersSummary } from "../../component/servers/ServersSummary";
import { LoadBalancerPanel } from "../../component/servers/LoadBalancerPanel";
import { ServerCard } from "../../component/servers/ServerCard";
import { ServersTable } from "../../component/servers/ServersTable";
import { mockServers, mockOrders } from "../../lib/mock-data";

export default function AdminServersPage() {
  // RAM ساختگی برای هر سرور
  const ramByServer: Record<string, number> = {
    s1: 48,
    s2: 72,
    s3: 88,
    s4: 35,
    s5: 0,
    s6: 22,
  };

  // کد سفارشات تقریبی هر سرور (برای نمایش داخل کارت)
  const codesByServer: Record<string, string[]> = {
    s1: ["#2154", "#2155", "#2158", "#2159"],
    s2: ["#2156", "#2160", "#2161", "#2162", "#2163"],
    s3: ["#2157", "#2164", "#2165", "#2166", "#2167"],
    s4: ["#2168", "#2169", "#2170"],
    s5: [],
    s6: ["#2171", "#2172"],
  };

  return (
    <div className="space-y-6">
      {/* سرصفحه */}
      <div>
        <h1 className="text-2xl font-black text-amber-50">سرورها و Load Balancer</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          پایش لحظه‌ای سلامت سرورها و توزیع بار
        </p>
      </div>

      {/* خلاصه */}
      <ServersSummary servers={mockServers} />

      {/* Load Balancer */}
      <LoadBalancerPanel servers={mockServers} />

      {/* کارت‌های تفصیلی */}
      <div>
        <h2 className="mb-4 text-base font-bold text-amber-50">جزئیات سرورها</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {mockServers.map((s) => (
            <ServerCard
              key={s.id}
              server={s}
              ram={ramByServer[s.id] ?? 0}
              orderCodes={codesByServer[s.id] ?? []}
            />
          ))}
        </div>
      </div>

      {/* جدول توزیع */}
      <ServersTable servers={mockServers} orders={mockOrders} />
    </div>
  );
}