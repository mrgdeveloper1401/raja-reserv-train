// app/component/dashboard/WorkersPanel.tsx
import { Card } from "../../component/ui/Card";
import { Badge } from "../../component/ui/Badge";
import { Cpu, Activity, AlertCircle, PauseCircle } from "lucide-react";
import type { Worker } from "../../types/index.type";

const statusConfig = {
  running: {
    label: "در حال اجرا",
    icon: Activity,
    color: "text-blue-300 bg-blue-500/10 border-blue-500/30",
    dot: "bg-blue-400 animate-pulse",
  },
  idle: {
    label: "آماده",
    icon: PauseCircle,
    color: "text-amber-300 bg-amber-500/10 border-amber-500/30",
    dot: "bg-amber-400",
  },
  error: {
    label: "خطا",
    icon: AlertCircle,
    color: "text-rose-300 bg-rose-500/10 border-rose-500/30",
    dot: "bg-rose-400",
  },
};

export function WorkersPanel({ workers }: { workers: Worker[] }) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-amber-500/10 p-5">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-amber-400" />
          <h2 className="text-base font-bold text-amber-50">Workerها</h2>
        </div>
        <span className="text-xs text-amber-100/40">{workers.length} فعال</span>
      </div>

      <div className="divide-y divide-amber-500/5">
        {workers.map((w) => {
          const cfg = statusConfig[w.status];
          return (
            <div
              key={w.id}
              className="flex items-center justify-between gap-3 p-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  <p className="text-sm font-medium text-amber-50">{w.name}</p>
                </div>
                <p className="mt-1 truncate text-xs text-amber-100/40">
                  {w.route}
                </p>
              </div>
              <Badge className={cfg.color}>
                <cfg.icon className="h-3 w-3" />
                {cfg.label}
              </Badge>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
