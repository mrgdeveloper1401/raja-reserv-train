// app/component/dashboard/ServersGrid.tsx
import { Card } from "../ui/Card";
import { Server as ServerIcon, AlertTriangle, XCircle } from "lucide-react";
import type { Server } from "../../types/index.type";

const statusConfig = {
  healthy: {
    label: "سالم",
    icon: ServerIcon,
    color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
    bar: "bg-emerald-500",
  },
  overloaded: {
    label: "بار بالا",
    icon: AlertTriangle,
    color: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    bar: "bg-amber-500",
  },
  down: {
    label: "قطع",
    icon: XCircle,
    color: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    bar: "bg-rose-500",
  },
};

export function ServersGrid({ servers }: { servers: Server[] }) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-amber-500/10 p-5">
        <div>
          <h2 className="text-base font-bold text-amber-50">سلامت سرورها</h2>
          <p className="mt-1 text-xs text-amber-100/40">
            {servers.filter((s) => s.status === "healthy").length} از{" "}
            {servers.length} سالم
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {servers.map((s) => {
          const cfg = statusConfig[s.status];
          return (
            <div
              key={s.id}
              className="rounded-xl border border-amber-500/10 bg-[#0f0d0a]/60 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <cfg.icon className="h-4 w-4 text-amber-400/60" />
                  <span className="text-sm font-medium text-amber-50">
                    {s.name}
                  </span>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}
                >
                  {cfg.label}
                </span>
              </div>

              {/* نوار CPU */}
              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-amber-100/40">CPU</span>
                  <span className="font-mono text-amber-100/70">{s.cpu}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-amber-500/10">
                  <div
                    className={`h-full rounded-full transition-all ${
                      s.cpu > 85 ? "bg-rose-500" : s.cpu > 70 ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                    style={{ width: `${s.cpu}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span className="text-amber-100/40">
                  سفارش: {s.activeOrders}/{s.maxOrders}
                </span>
                <span className="font-mono text-amber-100/60" dir="ltr">
                  {s.latency}ms
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}