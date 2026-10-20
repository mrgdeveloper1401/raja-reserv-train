// app/component/orders/OrderTimeline.tsx
import {
  FileText,
  Cpu,
  Train,
  CheckCircle2,
  CreditCard,
  XCircle,
  Clock,
} from "lucide-react";
import { Card } from "../../component/ui/Card";
import type { Order, OrderStatus } from "../../types/index.type";

interface Step {
  key: OrderStatus | "created" | "paid";
  label: string;
  time?: string;
  icon: typeof FileText;
  done?: boolean;
  error?: boolean;
}

export function OrderTimeline({ order }: { order: Order }) {
  const steps: Step[] = [
    {
      key: "created",
      label: "ثبت سفارش",
      time: order.createdAt,
      icon: FileText,
      done: true,
    },
    {
      key: "pending",
      label: "در انتظار شروع فروش",
      icon: Clock,
      done: ["pending", "processing", "booking", "payment_ready", "success", "failed"].includes(order.status),
    },
    {
      key: "processing",
      label: "در حال پردازش",
      icon: Cpu,
      done: ["processing", "booking", "payment_ready", "success", "failed"].includes(order.status),
    },
    {
      key: "booking",
      label: "ورود به رزرو",
      icon: Train,
      done: ["booking", "payment_ready", "success", "failed"].includes(order.status),
    },
    {
      key: "payment_ready",
      label: "موفق تا پرداخت",
      icon: CreditCard,
      done: ["payment_ready", "success"].includes(order.status),
    },
    {
      key: "success",
      label: order.status === "failed" ? "ناموفق" : "رزرو موفق",
      time: order.updatedAt,
      icon: order.status === "failed" ? XCircle : CheckCircle2,
      done: ["success", "failed"].includes(order.status),
      error: order.status === "failed",
    },
  ];

  return (
    <Card>
      <div className="mb-5 flex items-center gap-2">
        <Clock className="h-4 w-4 text-amber-400" />
        <h2 className="text-base font-bold text-amber-50">تایم‌لاین سفارش</h2>
      </div>

      <div className="space-y-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const Icon = step.icon;
          return (
            <div key={step.key} className="relative flex gap-3 pb-5">
              {/* خط اتصال */}
              {!isLast && (
                <div
                  className={`absolute right-[15px] top-8 h-full w-0.5 ${
                    step.done ? "bg-amber-500/40" : "bg-amber-500/10"
                  }`}
                />
              )}

              {/* آیکون */}
              <div
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition ${
                  step.error
                    ? "border-rose-500/50 bg-rose-500/15 text-rose-400"
                    : step.done
                    ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                    : "border-amber-500/15 bg-[#0f0d0a] text-amber-100/30"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>

              {/* محتوا */}
              <div className="flex-1 pt-0.5">
                <p
                  className={`text-sm font-medium ${
                    step.error
                      ? "text-rose-300"
                      : step.done
                      ? "text-amber-50"
                      : "text-amber-100/30"
                  }`}
                >
                  {step.label}
                </p>
                {step.time && (
                  <p className="mt-0.5 text-[11px] text-amber-100/40 font-mono" dir="ltr">
                    {new Date(step.time).toLocaleString("fa-IR")}
                  </p>
                )}
                {step.error && order.errorMessage && (
                  <p className="mt-1 text-xs text-rose-400/80">
                    ⚠ {order.errorMessage}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}