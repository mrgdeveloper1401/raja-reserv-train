// app/component/servers/ServersSummary.tsx
import { Server as ServerIcon, CheckCircle2, AlertTriangle, XCircle, Gauge } from "lucide-react";
import { Card } from "../../component/ui/Card";
import type { Server } from "../../types/index.type";

interface Props {
  servers: Server[];
}

export function ServersSummary({ servers }: Props) {
  const healthy = servers.filter((s) => s.status === "healthy").length;
  const overloaded = servers.filter((s) => s.status === "overloaded").length;
  const down = servers.filter((s) => s.status === "down").length;
  const totalActive = servers.reduce((a, s) => a + s.activeOrders, 0);
  const totalMax = servers.reduce((a, s) => a + s.maxOrders, 0);
  const capacityPct = totalMax ? Math.round((totalActive / totalMax) * 100) : 0;

  const items = [
    { label: "کل سرورها", value: servers.length, icon: ServerIcon, color: "text-amber-400 bg-amber-500/10" },
    { label: "سالم", value: healthy, icon: CheckCircle2, color: "text-emerald-400 bg-emerald-500/10" },
    { label: "بار بالا", value: overloaded, icon: AlertTriangle, color: "text-amber-400 bg-amber-500/10" },
    { label: "قطع", value: down, icon: XCircle, color: "text-rose-400 bg-rose-500/10" },
    {
      label: "ظرفیت اشغال",
      value: `${totalActive}/${totalMax} (${capacityPct}%)`,
      icon: Gauge,
      color: "text-cyan-400 bg-cyan-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {items.map((it) => (
        <Card key={it.label} className="relative overflow-hidden">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-amber-100/50">{it.label}</p>
              <p className="mt-2 text-xl font-black text-amber-50">{it.value}</p>
            </div>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${it.color}`}>
              <it.icon className="h-4.5 w-4.5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}