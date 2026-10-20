// app/admin/orders/[id]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  MapPin,
  Calendar,
  Train,
  Users,
  Wallet,
} from "lucide-react";
import { Card } from "../../../component/ui/Card";
import { StatusBadge } from "../../../component/ui/StatusBadge";
import { OrderTimeline } from "../../../component/orders/OrderTimeline";
import { OrderPassengers } from "../../../component/orders/OrderPassengers";
import { OrderActions } from "../../..//component/orders/OrderActions";
import { mockOrders, mockPassengers } from "../../../lib/mock-data";
import { TRAIN_TYPE_LABEL } from "../../../types/index.type";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = mockOrders.find((o) => o.id === id);
  if (!order) notFound();

  const passengers = mockPassengers.filter((p) =>
    order.passengerIds.includes(p.id)
  );

  return (
    <div className="space-y-6">
      {/* بازگشت */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-xs text-amber-100/50 transition hover:text-amber-300"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به لیست سفارشات
      </Link>

      {/* سرصفحه */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-2xl font-black text-amber-400">
              {order.code}
            </h1>
            <StatusBadge status={order.status} />
            {order.isPresale && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-300">
                پیش‌فروش
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-amber-100/40">
            {order.from} ← {order.to}
          </p>
        </div>
      </div>

      {/* خلاصه‌ی اطلاعات */}
      <Card>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <InfoItem icon={MapPin} label="مبدا" value={order.from} />
          <InfoItem icon={MapPin} label="مقصد" value={order.to} />
          <InfoItem icon={Calendar} label="تاریخ حرکت" value={order.date} mono />
          <InfoItem
            icon={Train}
            label="شماره قطار"
            value={order.trainNumbers.join(", ")}
            mono
          />
          <InfoItem
            icon={Users}
            label="مسافران"
            value={`${order.passengerIds.length} نفر`}
          />
          <InfoItem
            icon={Wallet}
            label="سقف قیمت"
            value={`${order.priceLimit.toLocaleString("fa-IR")} ت`}
          />
        </div>
      </Card>

      {/* دو ستون: تایم‌لاین + اقدامات */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <OrderTimeline order={order} />
          <OrderPassengers passengers={passengers} />
        </div>
        <div className="space-y-6">
          <OrderActions status={order.status} />

          {/* اطلاعات تکمیلی */}
          <Card>
            <h2 className="mb-4 text-base font-bold text-amber-50">اطلاعات تکمیلی</h2>
            <div className="space-y-3 text-sm">
              <Row label="شناسه" value={order.id} mono />
              <Row label="شناسه مشتری" value={order.userId} mono />
              <Row
                label="نوع قطار"
                value={order.trainTypes.map((t) => TRAIN_TYPE_LABEL[t]).join("، ")}
              />
              <Row
                label="بازه زمانی"
                value={order.timeRanges
                  .map((t) => `${t.from} - ${t.to}`)
                  .join(" ، ")}
                mono
              />
              <Row
                label="آخرین بروزرسانی"
                value={new Date(order.updatedAt).toLocaleString("fa-IR")}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[11px] text-amber-100/40">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p
        className={`mt-1 text-sm font-medium text-amber-50 ${
          mono ? "font-mono text-xs" : ""
        }`}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-amber-500/5 pb-2">
      <span className="text-xs text-amber-100/40">{label}</span>
      <span
        className={`text-xs text-amber-100/80 ${mono ? "font-mono" : ""}`}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </span>
    </div>
  );
}