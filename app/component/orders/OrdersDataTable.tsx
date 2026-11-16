// app/component/orders/OrdersDataTable.tsx
"use client";

import Link from "next/link";
import { Card } from "../../component/ui/Card";
import { StatusBadge } from "../../component/ui/StatusBadge";
import { Button } from "../../component/ui/Button";
import type { Reservation } from "../../types/index.type";
import { useState, useTransition } from "react";
import { Edit, Loader2, Play, Terminal, Trash2 } from "lucide-react";
import { ReservationLogsModal } from "./ReservationLogsModal";
import { useRouter } from "next/navigation";
import { deleteOrder, getOrderDetail, startRobot } from "@/app/lib/api"; // getOrderDetail اضافه شد
import { OrderEditModal } from "./OrderEditModal";
import { convertIntoDate } from "@/app/utils/config";

interface Props {
  reservations: Reservation[];
  total: number;
  page: number;
  pageSize: number;
  currentSearch?: string;
  currentDate?: string;
  currentTab?: string;
  token: string;
  stations: { Name: string }[];
}

export function OrdersDataTable({
  reservations,
  total,
  page,
  pageSize,
  currentSearch = "",
  currentDate = "",
  currentTab = "all",
  token,
  stations,
}: Props) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [selectedReservation, setSelectedReservation] = useState<number | null>(
    null,
  );
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  // تغییر: حالا به جای رکورد ساده، دیتای کامل سفارش ذخیره می‌شود
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [isFetchingOrder, setIsFetchingOrder] = useState<number | null>(null); // برای نمایش لودینگ روی دکمه

  const router = useRouter();

  const [startingId, setStartingId] = useState<number | null>(null); // برای لودینگ دکمه شروع

  // تابع جدید برای شروع ربات
  const handleStartRobot = async (orderId: number) => {
    if (!window.confirm("آیا از شروع ربات برای این سفارش مطمئن هستید؟")) {
      return;
    }
    
    setStartingId(orderId);
    try {
      await startRobot(token, orderId);
      // پس از موفقیت، صفحه را رفرش می‌کنیم تا وضعیت جدید نمایش داده شود
      startTransition(() => {
        router.refresh();
      });
    } catch (error: any) {
      console.error(error);
      alert(error.message || "خطا در شروع ربات");
    } finally {
      setStartingId(null);
    }
  };

  // تابع جدید برای واکشی اطلاعات کامل سفارش قبل از باز کردن Modal
  const handleEditClick = async (orderId: number) => {
    setIsFetchingOrder(orderId);
    try {
      const fullOrderData = await getOrderDetail(token, orderId);
      setEditingOrder(fullOrderData);
    } catch (error) {
      console.error(error);
      alert("خطا در دریافت اطلاعات سفارش");
    } finally {
      setIsFetchingOrder(null);
    }
  };

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (currentTab !== "all") params.set("tab", currentTab);
    if (currentSearch) params.set("search", currentSearch);
    if (currentDate) params.set("date", currentDate);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  const handleDelete = async (orderId: number) => {
    if (
      !window.confirm(
        "آیا از حذف این سفارش مطمئن هستید؟ این عمل قابل بازگشت نیست.",
      )
    ) {
      return;
    }

    setDeletingId(orderId);

    try {
      const res = await deleteOrder(orderId, token);

      if (!res.ok) {
        throw new Error("خطا در حذف سفارش");
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      alert("مشکلی در حذف سفارش پیش آمد.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Card padded={false} className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-500/10 bg-[#0f0d0a]/60 text-right text-xs text-amber-100/40">
                <th className="px-4 py-3 font-medium">شناسه</th>
                <th className="px-4 py-3 font-medium">مسیر</th>
                <th className="px-4 py-3 font-medium">تاریخ سفر</th>
                <th className="px-4 py-3 font-medium">شماره قطار</th>
                <th className="px-4 py-3 font-medium">وضعیت</th>
                <th className="px-4 py-3 font-medium">حذف سفارش</th>
                <th className="px-4 py-3 font-medium">ویرایش سفارش</th>
                <th className="px-4 py-3 font-medium">شروع ربات</th>
                <th className="px-4 py-3 font-medium">لاگ</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-amber-500/5 transition hover:bg-amber-500/5"
                >
                  <td className="px-4 py-4 font-mono text-amber-400">
                    #{r.id}
                  </td>
                  <td className="px-4 py-4 text-amber-50">
                    {r.origin} ← {r.destination}
                  </td>
                  <td className="px-4 py-4 text-amber-100/60" dir="ltr">
                    {r.travel_date
                      ? convertIntoDate(r.travel_date).format("YYYY/MM/DD")
                      : "-"}
                  </td>
                  <td
                    className="px-4 py-4 font-mono text-amber-100/80"
                    dir="ltr"
                  >
                    {r.train_number ?? "-"}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleDelete(r.order_id)}
                      disabled={deletingId === r.id || isPending}
                      className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 disabled:opacity-50 transition"
                      title="حذف سفارش"
                    >
                      {deletingId === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      حذف
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    {/* دکمه ویرایش: حالا دیتا را فچ می‌کند */}
                    <button
                      onClick={() => handleEditClick(r.id)}
                      disabled={isFetchingOrder === r.id}
                      className="text-amber-400 hover:text-amber-300 disabled:opacity-50"
                      title="ویرایش"
                    >
                      {isFetchingOrder === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                  {/* دکمه شروع ربات */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleStartRobot(r.id)}
                      disabled={
                        startingId === r.id ||
                        r.status === "pending" ||
                        r.status === "monitoring" ||
                        r.status === "captcha" ||
                        r.status === "redirect_gateway" ||
                        r.status === "failed" ||
                        r.status === "success"
                      }
                      className="flex items-center gap-1 text-xs text-emerald-500 hover:text-emerald-400 disabled:opacity-50 transition"
                      title="شروع ربات"
                    >
                      {startingId === r.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      شروع
                    </button>
                  </td>
                  {/* مشاهده لاگها */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => setSelectedReservation(r.id)}
                      className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
                      title="مشاهده لاگ‌ها"
                    >
                      <Terminal className="h-3 w-3" />
                      لاگ
                    </button>
                  </td>
                </tr>
              ))}
              {reservations.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-16 text-center text-amber-100/30"
                  >
                    سفارشی با این فیلترها پیدا نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-amber-500/10 px-4 py-3 text-xs text-amber-100/50">
            <span>
              صفحه {page} از {totalPages} (کل {total} آیتم)
            </span>
            <div className="flex items-center gap-1">
              {/* دکمه قبلی */}
              {page > 1 ? (
                <Link href={buildPageUrl(page - 1)}>
                  <Button size="sm" variant="outline">
                    قبلی
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  قبلی
                </Button>
              )}

              {/* شماره صفحات */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                if (
                  totalPages > 7 &&
                  Math.abs(p - page) > 2 &&
                  p !== 1 &&
                  p !== totalPages
                ) {
                  if (p === 2 || p === totalPages - 1) {
                    return (
                      <span key={p} className="px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                }

                return (
                  <Link key={p} href={buildPageUrl(p)}>
                    <button
                      className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
                        p === page
                          ? "bg-amber-500/20 text-amber-100 border border-amber-500/30"
                          : "text-amber-100/50 hover:bg-amber-500/10"
                      }`}
                    >
                      {p}
                    </button>
                  </Link>
                );
              })}

              {/* دکمه بعدی */}
              {page < totalPages ? (
                <Link href={buildPageUrl(page + 1)}>
                  <Button size="sm" variant="outline">
                    بعدی
                  </Button>
                </Link>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  بعدی
                </Button>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* ✅ مودال لاگ‌ها */}
      {selectedReservation && (
        <ReservationLogsModal
          reservationId={selectedReservation}
          token={token}
          onClose={() => setSelectedReservation(null)}
        />
      )}

      {/* ✅ مودال ویرایش */}
      {editingOrder && (
        <OrderEditModal
          order={editingOrder}
          token={token}
          stations={stations}
          onClose={() => setEditingOrder(null)}
          onRefresh={() => {
            setEditingOrder(null);
            startTransition(() => router.refresh());
          }}
        />
      )}
    </>
  );
}
