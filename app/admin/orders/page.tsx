// app/admin/orders/page.tsx
"use client";
import { useMemo, useState } from "react";
import { OrdersTabs, type TabKey } from "../../component/orders/OrdersTabs";
import { OrdersFilterBar } from "../../component/orders/OrdersFilterBar";
import { OrdersDataTable } from "../../component/orders/OrdersDataTable";
import { mockOrders } from "../../lib/mock-data";

const PAGE_SIZE = 8;

export default function AdminOrdersPage() {
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);

  // شمارش برای هر تب
  const counts = useMemo(
    () => ({
      all: mockOrders.length,
      active: mockOrders.filter((o) =>
        ["pending", "processing", "booking", "payment_ready"].includes(o.status)
      ).length,
      success: mockOrders.filter((o) => o.status === "success").length,
      failed: mockOrders.filter((o) => o.status === "failed").length,
      cancelled: mockOrders.filter((o) => o.status === "cancelled").length,
    }),
    []
  );

  // فیلتر
  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      // تب
      if (tab === "active") {
        if (!["pending", "processing", "booking", "payment_ready"].includes(o.status))
          return false;
      } else if (tab === "success" && o.status !== "success") return false;
      else if (tab === "failed" && o.status !== "failed") return false;
      else if (tab === "cancelled" && o.status !== "cancelled") return false;

      // جستجو
      if (search) {
        const q = search.toLowerCase();
        const hay = `${o.code} ${o.from} ${o.to}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      // تاریخ
      if (date && o.date !== date) return false;

      return true;
    });
  }, [tab, search, date]);

  // بازگرداندن به صفحه‌ی ۱ هنگام تغییر فیلترها
  const handleTab = (t: TabKey) => {
    setTab(t);
    setPage(1);
  };
  const handleSearch = (v: string) => {
    setSearch(v);
    setPage(1);
  };
  const handleDate = (v: string) => {
    setDate(v);
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* سرصفحه */}
      <div>
        <h1 className="text-2xl font-black text-amber-50">سفارشات</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          مدیریت و پیگیری تمام سفارشات سیستم
        </p>
      </div>

      {/* تب‌ها */}
      <OrdersTabs current={tab} onChange={handleTab} counts={counts} />

      {/* فیلترها */}
      <OrdersFilterBar
        search={search}
        onSearch={handleSearch}
        date={date}
        onDate={handleDate}
      />

      {/* جدول */}
      <OrdersDataTable
        orders={filtered}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}