// app/component/workers/WorkerCardDetailed.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Activity,
  PauseCircle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
  Clock,
  Server,
} from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
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

export function WorkerCardDetailed({ worker }: { worker: Worker }) {
  const [running, setRunning] = useState(worker.status === "running");
    const [now, setNow] = useState<number | null>(null); // زمان فعلی را در state نگه می‌داریم

  const cfg = statusConfig[worker.status];
  const elapsed = Math.max(
    0,
    Math.round((Date.now() - new Date(worker.startedAt).getTime()) / 1000)
  );
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  return (
    <Card className="relative overflow-hidden">
      <div
        className={`absolute inset-x-0 top-0 h-0.5 ${
          worker.status === "error"
            ? "bg-rose-500"
            : worker.status === "running"
            ? "bg-blue-500"
            : "bg-amber-500"
        }`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
          <h3 className="text-sm font-bold text-amber-50">{worker.name}</h3>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>

      <Link
        href={`/admin/orders/${worker.orderId}`}
        className="mt-3 block rounded-lg border border-amber-500/10 bg-[#0f0d0a]/60 p-2.5 transition hover:border-amber-400/40"
      >
        <p className="text-[10px] text-amber-100/40">سفارش مرتبط</p>
        <p className="mt-0.5 text-sm font-medium text-amber-300">
          {worker.route}
        </p>
      </Link>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-amber-500/10 bg-[#0f0d0a]/60 p-2">
          <p className="flex items-center gap-1 text-[10px] text-amber-100/40">
            <Server className="h-3 w-3" />
            سرور
          </p>
          <p className="mt-0.5 text-xs font-mono text-amber-100/80">
            {worker.serverId}
          </p>
        </div>
        <div className="rounded-lg border border-amber-500/10 bg-[#0f0d0a]/60 p-2">
          <p className="flex items-center gap-1 text-[10px] text-amber-100/40">
            <Clock className="h-3 w-3" />
            زمان اجرا
          </p>
          <p className="mt-0.5 text-xs font-mono text-amber-100/80" dir="ltr">
            {mins}m {secs}s
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {running ? (
          <Button
            size="sm"
            variant="danger"
            className="flex-1"
            onClick={() => setRunning(false)}
          >
            <Pause className="h-3.5 w-3.5" />
            توقف
          </Button>
        ) : (
          <Button
            size="sm"
            className="flex-1"
            onClick={() => setRunning(true)}
          >
            <Play className="h-3.5 w-3.5" />
            اجرا
          </Button>
        )}
        <Button size="sm" variant="outline">
          <RefreshCw className="h-3.5 w-3.5" />
          ریست
        </Button>
      </div>
    </Card>
  );
}