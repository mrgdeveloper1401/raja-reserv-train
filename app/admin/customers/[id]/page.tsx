// app/admin/customers/[id]/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  User,
  Phone,
  CreditCard,
  Calendar,
  MapPin,
} from "lucide-react";
import { Card } from "../../../component/ui/Card";
import { CustomerActions } from "../../../component/customers/CustomerActions";
import { getPassengerDetail } from "../../../lib/api";
import { StatusBadge } from "../../../component/ui/StatusBadge"; // اگر برای نوع بلیط نیاز داشتی

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return <div className="text-amber-100/60">لطفا وارد شوید.</div>;

  let passenger;
  try {
    passenger = await getPassengerDetail(token, id);
  } catch (error) {
    notFound(); // اگر 404 بدهد، به صفحه not-found می‌رود
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-xs text-amber-100/50 hover:text-amber-300"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به لیست مشتریان
      </Link>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-amber-50">
            {passenger.first_name} {passenger.last_name}
          </h1>
          <p className="mt-1 text-sm text-amber-100/40">
            شناسه مسافر: #{passenger.id}
          </p>
        </div>
        <CustomerActions id={passenger.id} token={token} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* اطلاعات مشتری */}
        <Card className="lg:col-span-1 h-fit">
          <h2 className="mb-4 text-base font-bold text-amber-50">
            اطلاعات هویتی
          </h2>
          <div className="space-y-4 text-sm">
            <InfoRow
              icon={CreditCard}
              label="کد ملی"
              value={passenger.national_id}
              ltr
            />
            <InfoRow
              icon={Phone}
              label="شماره تماس"
              value={passenger.phone}
              ltr
            />
            <InfoRow
              icon={User}
              label="جنسیت"
              value={passenger.gender === "male" ? "مرد" : "زن"}
            />
            <InfoRow
              icon={Calendar}
              label="تاریخ تولد"
              value={passenger.birth_date || "ثبت نشده"}
              ltr
            />
          </div>
        </Card>

        {/* تاریخچه سفارشات */}
        <Card className="lg:col-span-2" padded={false}>
          <div className="border-b border-amber-500/10 p-5">
            <h2 className="text-base font-bold text-amber-50">
              تاریخچه سفارشات
            </h2>
            <p className="mt-1 text-xs text-amber-100/40">
              مجموع {passenger.orders.length} سفارش
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-amber-500/10 text-right text-xs text-amber-100/40">
                  <th className="px-5 py-3 font-medium">شناسه</th>
                  <th className="px-5 py-3 font-medium">مسیر</th>
                  <th className="px-5 py-3 font-medium">تاریخ سفر</th>
                  <th className="px-5 py-3 font-medium">نوع بلیط</th>
                </tr>
              </thead>
              <tbody>
                {passenger.orders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-b border-amber-500/5 hover:bg-amber-500/5"
                  >
                    <td className="px-5 py-4 font-mono text-amber-400">
                      #{o.id}
                    </td>
                    <td className="px-5 py-4 text-amber-50">
                      {o.origin} ← {o.destination}
                    </td>
                    <td
                      className="px-5 py-4 text-amber-100/60 font-mono"
                      dir="ltr"
                    >
                      {o.travel_date}
                    </td>
                    <td className="px-5 py-4 text-amber-100/60">
                      {o.passenger_type === "man"
                        ? "ویژه برادران"
                        : o.passenger_type === "woman"
                          ? "ویژه خواهران"
                          : "عادی"}
                    </td>
                  </tr>
                ))}
                {passenger.orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-5 py-12 text-center text-amber-100/30"
                    >
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-amber-500/30" />
                      سفارشی برای این مسافر ثبت نشده است.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  ltr,
}: {
  icon: any;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-amber-500/5 pb-3">
      <span className="flex items-center gap-2 text-amber-100/50 text-xs">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className="text-amber-50 font-medium" dir={ltr ? "ltr" : undefined}>
        {value}
      </span>
    </div>
  );
}
