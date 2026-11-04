// app/component/raja/RajaAccountsTable.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Search, UserCircle, Trash2, Edit, Loader2 } from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import {
  deleteRajaAccount,
  createRajaAccount,
  updateRajaAccount,
} from "../../lib/api";
import type {
  PaginatedRajaAccounts,
  RajaAccountItem,
} from "../../types/index.type";

interface Props {
  data: PaginatedRajaAccounts;
  token: string;
  currentSearch: string;
}

export function RajaAccountsTable({ data, token, currentSearch }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);

  // --- Stateهای مربوط به Modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // state برای تشخیص حالت ساخت یا ویرایش
  const [editingAccount, setEditingAccount] = useState<RajaAccountItem | null>(
    null,
  );

  // فیلدهای فرم
  const [formData, setFormData] = useState({
    username: "",
    password: "", // در حالت ویرایش ممکن است خالی بماند
    is_active: true,
  });

  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));

  // --- هندل کردن جستجو ---
  const handleSearch = (e: React.SubmitEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // --- باز کردن Modal برای ساخت جدید ---
  const openCreateModal = () => {
    setEditingAccount(null);
    setFormData({ username: "", password: "", is_active: true });
    setError("");
    setIsModalOpen(true);
  };

  // --- باز کردن Modal برای ویرایش ---
  const openEditModal = (acc: RajaAccountItem) => {
    setEditingAccount(acc);
    setFormData({
      username: acc.username,
      password: "", // رمز عبور را برای امنیت خالی می‌گذاریم (اگر کاربر تایپ کرد، تغییر می‌کند)
      is_active: acc.is_active,
    });
    setError("");
    setIsModalOpen(true);
  };

  // --- ثبت فرم (ساخت یا ویرایش) ---
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (editingAccount) {
        // حالت ویرایش
        const payload: any = {
          username: formData.username,
          is_active: formData.is_active,
        };
        // فقط اگر رمز جدیدی وارد شده بود، آن را بفرست
        if (formData.password) {
          payload.password = formData.password;
        }
        await updateRajaAccount(token, editingAccount.id, payload);
      } else {
        // حالت ساخت
        if (!formData.password) {
          throw new Error("وارد کردن رمز عبور برای اکانت جدید الزامی است.");
        }
        await createRajaAccount(token, formData);
      }

      setIsModalOpen(false);
      router.refresh(); // آپدیت لیست سرور
    } catch (err: any) {
      setError(err.message || "خطایی رخ داد");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- حذف اکانت ---
  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این اکانت مطمئن هستید؟")) return;
    try {
      await deleteRajaAccount(token, id);
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // --- لینک صفحه‌بندی ---
  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    params.set("page", newPage.toString());
    return `?${params.toString()}`;
  };

  return (
    <>
      <Card padded={false} className="overflow-hidden">
        {/* هدر و جستجو */}
        <div className="border-b border-amber-500/10 p-5 flex flex-col sm:flex-row gap-4 justify-between">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجوی شماره همراه..."
              className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] py-2.5 pr-10 pl-4 text-sm text-amber-50 outline-none focus:border-amber-400/60"
            />
          </form>
          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4 ml-1" /> اکانت جدید
          </Button>
        </div>

        {/* جدول */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-500/10 bg-[#0f0d0a]/60 text-right text-xs text-amber-100/40">
                <th className="px-5 py-3 font-medium">شناسه</th>
                <th className="px-5 py-3 font-medium">شماره همراه رجا</th>
                <th className="px-5 py-3 font-medium">وضعیت</th>
                <th className="px-5 py-3 font-medium">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((acc) => (
                <tr
                  key={acc.id}
                  className="border-b border-amber-500/5 hover:bg-amber-500/5"
                >
                  <td className="px-5 py-4 font-mono text-amber-400">
                    #{acc.id}
                  </td>
                  <td className="px-5 py-4 text-amber-50 flex items-center gap-2">
                    <UserCircle className="h-4 w-4 text-amber-500/50" />
                    <span dir="ltr" className="font-mono">
                      {acc.username}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs border ${acc.is_active ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-rose-400 border-rose-500/30 bg-rose-500/10"}`}
                    >
                      {acc.is_active ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-5 py-4 flex items-center gap-4">
                    <button
                      onClick={() => openEditModal(acc)}
                      className="text-amber-400 hover:text-amber-300"
                      title="ویرایش"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="text-rose-400 hover:text-rose-300"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-amber-100/30"
                  >
                    اکانتی یافت نشد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-amber-500/10 px-4 py-3 text-xs text-amber-100/50">
            <span>
              صفحه {data.page} از {totalPages}
            </span>
            <div className="flex gap-1">
              {data.page > 1 && (
                <a
                  href={buildPageUrl(data.page - 1)}
                  className="px-3 py-1 bg-amber-500/10 rounded"
                >
                  قبلی
                </a>
              )}
              {data.page < totalPages && (
                <a
                  href={buildPageUrl(data.page + 1)}
                  className="px-3 py-1 bg-amber-500/10 rounded"
                >
                  بعدی
                </a>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Modal ساخت / ویرایش */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="w-full max-w-md">
            <h2 className="text-lg font-bold text-amber-50 mb-4">
              {editingAccount ? "ویرایش اکانت رجا" : "افزودن اکانت رجا"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-rose-400 text-xs bg-rose-500/10 p-2 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs text-amber-100/60">
                  شماره همراه
                </label>
                <input
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  dir="ltr"
                  className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-amber-100/60">
                  رمز عبور{" "}
                  {editingAccount && (
                    <span className="text-amber-500/50">
                      (برای عدم تغییر، خالی بگذارید)
                    </span>
                  )}
                </label>
                <input
                  required={!editingAccount} // در حالت ساخت الزامی است، در ویرایش اختیاری
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  dir="ltr"
                  className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
                />
              </div>

              {/* سوییچ فعال/غیرفعال (فقط در حالت ویرایش نشان داده می‌شود) */}
              {editingAccount && (
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-amber-500/20 bg-[#0f0d0a] text-amber-500 focus:ring-amber-500/50"
                  />
                  <label
                    htmlFor="is_active"
                    className="text-sm text-amber-100/80"
                  >
                    اکانت فعال باشد
                  </label>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-amber-500/10">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  انصراف
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingAccount ? (
                    "ذخیره تغییرات"
                  ) : (
                    "ثبت اکانت"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
