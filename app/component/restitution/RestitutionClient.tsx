// app/component/restitution/RestitutionClient.tsx
"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  RotateCcw,
  Plus,
  Search,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Restitution, RestitutionsResponse } from "@/app/types/index.type";
import { baseUrl } from "@/app/utils/config";

// --- اسکیما اعتبارسنجی ---
const restitutionSchema = z.object({
  serial_number: z.string().min(1, "سریال بلیط الزامی است"),
  phone: z.string().min(10, "شماره موبایل باید حداقل ۱۰ رقم باشد"),
  train_number: z.string().min(1, "شماره قطار الزامی است"),
  hall_number: z.string().min(1, "شماره سالن الزامی است"),
});

type RestitutionFormValues = z.infer<typeof restitutionSchema>;

interface Props {
  initialData: RestitutionsResponse;
  token: string;
}

export function RestitutionClient({ initialData, token }: Props) {
  const [restitutions, setRestitutions] = useState<Restitution[]>(
    initialData.items,
  );
  const [totalCount, setTotalCount] = useState(initialData.total);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(initialData.total / 20),
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RestitutionFormValues>({
    resolver: zodResolver(restitutionSchema),
    defaultValues: {
      serial_number: "",
      phone: "",
      train_number: "",
      hall_number: "",
    },
  });

  // دریافت لیست (برای صفحه‌بندی و رفرش)
  const fetchRestitutions = useCallback(
    async (pageNumber: number = 1) => {
      setIsLoadingList(true);
      try {
        const res = await fetch(
          `${baseUrl}/admin/restitution?page=${pageNumber}&page_size=20`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) throw new Error("خطا در دریافت لیست");
        const data = await res.json();

        setRestitutions(data.items || data.results || []);
        setTotalCount(data.total || data.count || 0);
        setTotalPages(Math.ceil((data.total || data.count || 0) / 20));
      } catch (error) {
        toast.error("خطا در دریافت لیست استردادها");
      } finally {
        setIsLoadingList(false);
      }
    },
    [token],
  );

  // ثبت استرداد جدید
  const onSubmit = async (data: RestitutionFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/admin/restitution`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, status: "pending" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "خطا در ثبت استرداد");
      }

      toast.success("درخواست استرداد با موفقیت ثبت شد");
      reset();
      setPage(1);
      fetchRestitutions(1);
    } catch (error: any) {
      toast.error(error.message || "خطا در ثبت استرداد");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full text-xs">
            <CheckCircle2 size={14} /> موفق
          </span>
        );
      case "failed":
        return (
          <span className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-2 py-1 rounded-full text-xs">
            <XCircle size={14} /> ناموفق
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full text-xs">
            <Clock size={14} /> در انتظار
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-amber-50 flex items-center gap-2">
            <RotateCcw className="text-amber-500" />
            استرداد بلیط
          </h1>
          <p className="mt-1 text-sm text-amber-100/40">
            مدیریت و پیگیری درخواست‌های استرداد
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ستون فرم */}
        <div className="lg:col-span-1">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-amber-50 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-amber-500" />
              ثبت استرداد جدید
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm text-amber-100/60 mb-1">
                  سریال بلیط
                </label>
                <input
                  {...register("serial_number")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-amber-50 focus:outline-none focus:border-amber-500/50 transition"
                  placeholder="مثلاً 123456789"
                />
                {errors.serial_number && (
                  <p className="text-rose-400 text-xs mt-1">
                    {errors.serial_number.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-amber-100/60 mb-1">
                  شماره موبایل
                </label>
                <input
                  {...register("phone")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-amber-50 focus:outline-none focus:border-amber-500/50 transition"
                  placeholder="09123456789"
                />
                {errors.phone && (
                  <p className="text-rose-400 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-amber-100/60 mb-1">
                    شماره قطار
                  </label>
                  <input
                    {...register("train_number")}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-amber-50 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="مثلاً 123"
                  />
                  {errors.train_number && (
                    <p className="text-rose-400 text-xs mt-1">
                      {errors.train_number.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-amber-100/60 mb-1">
                    شماره سالن
                  </label>
                  <input
                    {...register("hall_number")}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-amber-50 focus:outline-none focus:border-amber-500/50 transition"
                    placeholder="مثلاً 4"
                  />
                  {errors.hall_number && (
                    <p className="text-rose-400 text-xs mt-1">
                      {errors.hall_number.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 rounded-lg transition flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}
                {isSubmitting ? "در حال ثبت..." : "ثبت درخواست"}
              </button>
            </form>
          </Card>
        </div>

        {/* ستون جدول */}
        <div className="lg:col-span-2">
          <Card className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-amber-50">
                لیست درخواست‌ها ({totalCount})
              </h2>
              <button
                onClick={() => fetchRestitutions(page)}
                className="p-2 rounded-lg hover:bg-white/5 text-amber-100/50 hover:text-amber-50 transition"
                title="بروزرسانی"
              >
                <RefreshCw
                  size={18}
                  className={isLoadingList ? "animate-spin" : ""}
                />
              </button>
            </div>

            {isLoadingList ? (
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <Loader2 className="animate-spin text-amber-500" size={32} />
              </div>
            ) : restitutions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[300px] text-amber-100/30">
                <Search size={48} className="mb-4 opacity-50" />
                <p>هیچ درخواست استردادی یافت نشد.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-amber-100/50">
                        <th className="pb-3 px-2 font-medium">سریال بلیط</th>
                        <th className="pb-3 px-2 font-medium">موبایل</th>
                        <th className="pb-3 px-2 font-medium">قطار / سالن</th>
                        <th className="pb-3 px-2 font-medium">تاریخ ثبت</th>
                        <th className="pb-3 px-2 font-medium">وضعیت</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {restitutions.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-white/5 transition"
                        >
                          <td className="py-3 px-2 text-amber-50 font-mono">
                            {item.serial_number}
                          </td>
                          <td
                            className="py-3 px-2 text-amber-100/80 font-mono"
                            dir="ltr"
                          >
                            {item.phone}
                          </td>
                          <td className="py-3 px-2 text-amber-100/80">
                            {item.train_number}{" "}
                            <span className="text-amber-100/30">/</span>{" "}
                            {item.hall_number}
                          </td>
                          <td className="py-3 px-2 text-amber-100/60 text-xs">
                            {new Date(item.created_at).toLocaleDateString(
                              "fa-IR",
                            )}
                          </td>
                          <td className="py-3 px-2">
                            {getStatusBadge(item.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => {
                        const newPage = Math.max(1, page - 1);
                        setPage(newPage);
                        fetchRestitutions(newPage);
                      }}
                      disabled={page === 1}
                      className="px-3 py-1 text-sm rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
                    >
                      قبلی
                    </button>
                    <span className="text-amber-100/60 text-sm">
                      صفحه {page} از {totalPages}
                    </span>
                    <button
                      onClick={() => {
                        const newPage = Math.min(totalPages, page + 1);
                        setPage(newPage);
                        fetchRestitutions(newPage);
                      }}
                      disabled={page === totalPages}
                      className="px-3 py-1 text-sm rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 transition"
                    >
                      بعدی
                    </button>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
