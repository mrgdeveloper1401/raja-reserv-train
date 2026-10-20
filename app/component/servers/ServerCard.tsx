// app/component/servers/ServerCard.tsx
import {
  Server as ServerIcon,
  Cpu,
  MemoryStick,
  Timer,
  Activity,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Card } from "../../component/ui/Card";
import type { Server } from "../../types/index.type";

const statusConfig = {
  healthy: {
    label: "سالم",
    icon: ServerIcon,
    color: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  },
  overloaded: {
    label: "بار بالا",
    icon: AlertTriangle,
    color: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  },
  down: {
    label: "قطع",
    icon: XCircle,
    color: "text-rose-300 bg-rose-500/10 border-rose-500/30",
  },
};

interface Props {
  server: Server;
  ram?: number; // درصد مصرف RAM (اختیاری، mock)
  orderCodes?: string[];
}

export function ServerCard({ server, ram = 55, orderCodes = [] }: Props) {
  const cfg = statusConfig[server.status];
  const loadPct = server.maxOrders
    ? Math.round((server.activeOrders / server.maxOrders) * 100)
    : 0;

  return (
    <Card
      className={`relative overflow-hidden transition ${
        server.status === "down"
          ? "border-rose-500/25"
          : server.status === "overloaded"
          ? "border-amber-500/25"
          : "border-emerald-500/15"
      }`}
    >
      {/* خط تزئینی بالای کارت */}
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          server.status === "down"
            ? "bg-rose-500"
            : server.status === "overloaded"
            ? "bg-amber-500"
            : "bg-emerald-500"
        }`}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <cfg.icon className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-50">{server.name}</p>
            <p className="text-[10px] text-amber-100/40 font-mono">{server.id}</p>
          </div>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      {/* معیارها */}
      <div className="mt-5 space-y-3">
        <Metric
          icon={Activity}
          label="سفارشات فعال"
          value={`${server.activeOrders}/${server.maxOrders}`}
          percent={loadPct}
          tone={loadPct > 85 ? "rose" : loadPct > 70 ? "amber" : "emerald"}
        />
        <Metric
          icon={Cpu}
          label="CPU"
          value={`${server.cpu}%`}
          percent={server.cpu}
          tone={server.cpu > 85 ? "rose" : server.cpu > 70 ? "amber" : "emerald"}
        />
        <Metric
          icon={MemoryStick}
          label="RAM"
          value={`${ram}%`}
          percent={ram}
          tone={ram > 85 ? "rose" : ram > 70 ? "amber" : "emerald"}
        />
      </div>

      {/* latency */}
      <div className="mt-4 flex items-center justify-between border-t border-amber-500/10 pt-3 text-[11px]">
        <div className="flex items-center gap-1.5 text-amber-100/50">
          <Timer className="h-3.5 w-3.5 text-amber-400/60" />
          <span>Latency</span>
        </div>
        <span
          className={`font-mono ${
            server.latency > 300
              ? "text-rose-300"
              : server.latency > 150
              ? "text-amber-300"
              : "text-emerald-300"
          }`}
          dir="ltr"
        >
          {server.latency}ms
        </span>
      </div>

      {/* سفارشات روی سرور */}
      {orderCodes.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {orderCodes.slice(0, 5).map((c) => (
            <span
              key={c}
              className="rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-mono text-amber-300/80"
            >
              {c}
            </span>
          ))}
          {orderCodes.length > 5 && (
            <span className="text-[10px] text-amber-100/40">
              +{orderCodes.length - 5}
            </span>
          )}
        </div>
      )}
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  percent,
  tone,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
  percent: number;
  tone: "emerald" | "amber" | "rose";
}) {
  const barColor =
    tone === "rose" ? "bg-rose-500" : tone === "amber" ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="flex items-center gap-1.5 text-amber-100/50">
          <Icon className="h-3.5 w-3.5" />
          {label}
        </span>
        <span className="font-mono text-amber-100/70">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-amber-500/10">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}