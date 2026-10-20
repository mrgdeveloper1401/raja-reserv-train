// app/component/workers/WorkersSummary
import { Activity, Cpu, AlertCircle, PauseCircle } from "lucide-react";
import { Card } from "../../component/ui/Card";
import type { Worker } from "../../types/index.type";

export function WorkersSummary({ workers }: { workers: Worker[] }) {
  const running = workers.filter((w) => w.status === "running").length;
  const idle = workers.filter((w) => w.status === "idle").length;
  const errors = workers.filter((w) => w.status === "error").length;

  const items = [
    { label: "کل Workerها", value: workers.length, icon: Cpu, color: "text-amber-400 bg-amber-500/10" },
    { label: "در حال اجرا", value: running, icon: Activity, color: "text-blue-400 bg-blue-500/10" },
    { label: "آماده", value: idle, icon: PauseCircle, color: "text-amber-400 bg-amber-500/10" },
    { label: "خطا", value: errors, icon: AlertCircle, color: "text-rose-400 bg-rose-500/10" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((it) => (
        <Card key={it.label}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-amber-100/50">{it.label}</p>
              <p className="mt-2 text-2xl font-black text-amber-50">{it.value}</p>
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