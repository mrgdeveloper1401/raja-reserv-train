// app/component/presale/PresaleQueue
"use client";
import { useState } from "react";
import { Play, Trash2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { StatusBadge } from "../ui/StatusBadge";
import type { Order } from "../../types/index.type";

interface Props {
  orders: Order[];
}

export function PresaleQueue({ orders }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const allSelected = selected.length === orders.length && orders.length > 0;

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(allSelected ? [] : orders.map((o) => o.id));
  };

  const pending = orders.filter((o) => o.status === "pending");
  const others = orders.filter((o) => o.status !== "pending");

  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex flex-col items-start justify-between gap-3 border-b border-amber-500/10 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAll}
            className={`flex h-5 w-5 items-center justify-center rounded-md border transition ${
              allSelected
                ? "border-amber-400 bg-amber-400"
                : "border-amber-500/30"
            }`}
          >
            {allSelected && (
              <span className="h-2 w-2 rounded-sm bg-[#0f0d0a]" />
            )}
          </button>
          <div>
            <h2 className="text-base font-bold text-amber-50">صف هوشمند</h2>
            <p className="mt-0.5 text-xs text-amber-100/40">
              {pending.length} سفارش در انتظار · {others.length} در حال پردازش
            </p>
          </div>
        </div>

        <Button size="sm" disabled={selected.length === 0}>
          <Play className="h-3.5 w-3.5" />
          شروع پردازش {selected.length > 0 ? `(${selected.length})` : "همه"}
        </Button>
      </div>

      <div className="divide-y divide-amber-500/5">
        {orders.length === 0 && (
          <div className="p-12 text-center text-amber-100/30">
            <Clock className="mx-auto mb-3 h-10 w-10 text-amber-500/20" />
            صف خالی است
          </div>
        )}

        {orders.map((o) => {
          const checked = selected.includes(o.id);
          const isPending = o.status === "pending";
          return (
            <div
              key={o.id}
              className={`flex flex-col items-start gap-3 p-4 transition sm:flex-row sm:items-center ${
                checked ? "bg-amber-500/5" : "hover:bg-amber-500/5"
              }`}
            >
              {/* چک‌باکس */}
              {isPending ? (
                <button
                  type="button"
                  onClick={() => toggle(o.id)}
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                    checked
                      ? "border-amber-400 bg-amber-400"
                      : "border-amber-500/30"
                  }`}
                >
                  {checked && (
                    <span className="h-2 w-2 rounded-sm bg-[#0f0d0a]" />
                  )}
                </button>
              ) : (
                <div className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {o.status === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : o.status === "failed" ? (
                    <AlertCircle className="h-4 w-4 text-rose-400" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-400/60" />
                  )}
                </div>
              )}

              {/* محتوا */}
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm text-amber-400">
                    {o.code}
                  </span>
                  <span className="text-sm font-medium text-amber-50">
                    {o.from} ← {o.to}
                  </span>
                  <StatusBadge status={o.status} />
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-amber-100/40">
                  <span dir="ltr">{o.date}</span>
                  <span>قطار: {o.trainNumbers.join(", ")}</span>
                  <span>{o.passengerIds.length} مسافر</span>
                </div>
                {o.errorMessage && (
                  <p className="mt-1 text-xs text-rose-400/80">
                    ⚠ {o.errorMessage}
                  </p>
                )}
              </div>

              {/* اکشن‌ها */}
              <div className="flex items-center gap-1.5">
                {isPending && (
                  <button
                    type="button"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-400/60 transition hover:bg-rose-500/10 hover:text-rose-400"
                    aria-label="حذف سفارش"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}