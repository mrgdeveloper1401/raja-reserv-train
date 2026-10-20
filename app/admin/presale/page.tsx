// app/admin/presale/page.tsx
import { PresaleBanner } from "../../component/presale/PresaleBanner";
import { PresaleOrderForm } from "../../component/presale/PresaleOrderForm";
import { PresaleQueue } from "../../component/presale/PresaleQueue";
import { mockOrders } from "../../lib/mock-data";

export default function PresalePage() {
  const presaleOrders = mockOrders.filter((o) => o.isPresale);

  return (
    <div className="space-y-6">
      {/* سرصفحه */}
      <div>
        <h1 className="text-2xl font-black text-amber-50">پیش‌فروش</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          مدیریت سفارشات پیش‌فروش و آماده‌سازی برای شروع فروش
        </p>
      </div>

      {/* بنر */}
      <PresaleBanner />

      {/* فرم + صف */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PresaleOrderForm />
        <PresaleQueue orders={presaleOrders} />
      </div>
    </div>
  );
}