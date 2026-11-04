// app/admin/orders/page.tsx
import { cookies } from "next/headers";
import { OrdersTabs } from "../../component/orders/OrdersTabs";
import { OrdersFilterBar } from "../../component/orders/OrdersFilterBar";
import { OrdersDataTable } from "../../component/orders/OrdersDataTable";
import { getOrders } from "../../lib/api";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    tab?: string;
    search?: string;
    date?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  // گرفتن توکن از کوکی
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return <div className="text-amber-100/60">لطفا وارد شوید.</div>;
  }

  // تنظیم پارامترها با مقادیر پیش‌فرض
  const currentTab = params.tab || "all";
  const currentSearch = params.search || "";
  const currentDate = params.date || "";
  const currentPage = parseInt(params.page || "1", 10);

  // واکشی دیتا از سرور
  const data = await getOrders(token, {
    tab: currentTab,
    search: currentSearch,
    date: currentDate,
    page: currentPage,
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-amber-50">سفارشات</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          مدیریت و پیگیری تمام سفارشات سیستم
        </p>
      </div>

      {/* کامپوننت‌های زیر باید "use client" باشند تا با URL بازی کنند */}
      <OrdersTabs currentTab={currentTab} counts={{ all: data.total }} />

      <OrdersFilterBar
        currentSearch={currentSearch}
        currentDate={currentDate}
      />

      <OrdersDataTable
        reservations={data.items}
        total={data.total}
        page={currentPage}
        pageSize={data.page_size}
        currentSearch={currentSearch}
        currentDate={currentDate}
        currentTab={currentTab}
      />
    </div>
  );
}
