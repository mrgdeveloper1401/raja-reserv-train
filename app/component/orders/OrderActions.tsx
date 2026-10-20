// app/component/orders/OrderActions.tsx
"use client";
import { RefreshCw, XCircle, Rocket } from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import type { OrderStatus } from "../../types/index.type";

export function OrderActions({ status }: { status: OrderStatus }) {
  const canRetry = status === "failed" || status === "cancelled";
  const canCancel = ["pending", "processing", "booking"].includes(status);
  const canRun = status === "pending";

  return (
    <Card>
      <h2 className="mb-4 text-base font-bold text-amber-50">اقدامات</h2>
      <div className="flex flex-col gap-2">
        {canRun && (
          <Button size="md">
            <Rocket className="h-4 w-4" />
            شروع پردازش
          </Button>
        )}
        {canRetry && (
          <Button size="md" variant="primary">
            <RefreshCw className="h-4 w-4" />
            تلاش مجدد
          </Button>
        )}
        {canCancel && (
          <Button size="md" variant="danger">
            <XCircle className="h-4 w-4" />
            لغو سفارش
          </Button>
        )}
        {!canRun && !canRetry && !canCancel && (
          <p className="rounded-lg border border-amber-500/15 bg-[#0f0d0a]/60 p-3 text-center text-xs text-amber-100/40">
            این سفارش در وضعیت نهایی است و اقدام دیگری نیاز نیست.
          </p>
        )}
      </div>
    </Card>
  );
}