// app/dashboard/order/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Calendar, Train, Users, Wallet, Clock } from "lucide-react";
import { Card } from "../../../component/ui/Card";
import { StatusBadge } from "../../../component/ui/StatusBadge";
import { mockOrders, mockPassengers } from "../../../lib/mock-data";

export default async function CustomerOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = mockOrders.find((o) => o.id === id);
  if (!order) notFound();

  const passengers = mockPassengers.filter((p) => order.passengerIds.includes(p.id));

  // فقط مراحل مهم برای مشتری
  const steps = [
    { label: "ثبت سفارش", done: true, time: order.createdAt },
    {
      label: "در انتظار شروع فروش",
      done: ["pending", "processing", "booking", "payment_ready", "success", "failed"].includes(order.status),
    },
    {
      label: "در حال جستجوی ظرفیت",
      done: ["processing", "booking", "payment_ready", "success", "failed"].includes(order.status),
    },
    {
      label: "ظرفیت پیدا شد",
      done: ["booking", "payment_ready", "success"].includes(order.status),
    },
    {
      label: order.status === "failed" ? "رزرو ناموفق" : "رزرو موفق",
      done: ["success", "failed"].includes(order.status),
      error: order.status === "failed",
      time: order.updatedAt,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-amber-100/50 hover:text-amber-300">
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به داشبورد
      </Link>

      <div className="flex items-center gap-3">
        <h1 className="font-mono text-2xl font-black text-amber-400">{order.code}</h1>
        <StatusBadge status={order.status} />
      </div>

      {/* خلاصه */}
      <Card>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <InfoItem icon={MapPin} label="مسیر" value={`${order.from} ← ${order.to}`} />
          <InfoItem icon={Calendar} label="تاریخ" value={order.date} mono />
          <InfoItem icon={Train} label="قطار" value={order.trainNumbers.join(", ")} mono />
          <InfoItem icon={Users} label="مسافران" value={`${order.passengerIds.length} نفر`} />
          <InfoItem icon={Wallet} label="سقف قیمت" value={`${order.priceLimit.toLocaleString("fa-IR")} ت`} />
          <InfoItem icon={Clock} label="آخرین بروزرسانی" value={new Date(order.updatedAt).toLocaleString("fa-IR")} />
        </div>
      </Card>

      {/* پیشرفت */}
      <Card>
        <h2 className="mb-5 text-base font-bold text-amber-50">وضعیت سفارش</h2>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                s.error ? "border-rose-500/50 bg-rose-500/15 text-rose-400"
                : s.done ? "border-amber-500/50 bg-amber-500/15 text-amber-400"
                : "border-amber-500/15 bg-[#0f0d0a] text-amber-100/30"
              }`}>
                {s.done ? "✓" : i + 1}
              </div>
              <div>
                <p className={`text-sm font-medium ${s.error ? "text-rose-300" : s.done ? "text-amber-50" : "text-amber-100/30"}`}>
                  {s.label}
                </p>
                {s.time && (
                  <p className="mt-0.5 text-[11px] font-mono text-amber-100/40" dir="ltr">
                    {new Date(s.time).toLocaleString("fa-IR")}
                  </p>
                )}
                {s.error && order.errorMessage && (
                  <p className="mt-1 text-xs text-rose-400/80">⚠ {order.errorMessage}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* مسافران */}
      <Card>
        <h2 className="mb-4 text-base font-bold text-amber-50">مسافران</h2>
        <div className="space-y-2">
          {passengers.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-amber-500/10 bg-[#0f0d0a]/60 p-3">
              <div>
                <p className="text-sm font-medium text-amber-50">{p.firstName} {p.lastName}</p>
                <p className="text-[11px] font-mono text-amber-100/40" dir="ltr">{p.nationalId}</p>
              </div>
              <span className="text-xs text-amber-100/50">{p.gender === "male" ? "آقا" : "خانم"}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, mono }: { icon: typeof MapPin; label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[11px] text-amber-100/40">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className={`mt-1 text-sm font-medium text-amber-50 ${mono ? "font-mono text-xs" : ""}`} dir={mono ? "ltr" : undefined}>
        {value}
      </p>
    </div>
  );
}