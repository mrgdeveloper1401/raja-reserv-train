// app/component/customers/EditCustomerForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Phone,
  Calendar,
  Users,
  Loader2,
} from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import { updatePassenger } from "../../lib/api";
import type { PassengerDetail } from "../../types/index.type";

interface Props {
  token: string;
  initialData: PassengerDetail;
}

export function EditCustomerForm({ token, initialData }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // مقداردهی اولیه State با دیتای فعلی
  const [formData, setFormData] = useState({
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    national_id: initialData.national_id || "",
    gender: initialData.gender || "male",
    birth_date: initialData.birth_date || "",
    phone: initialData.phone || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // اعتبارسنجی سمت کلاینت
    if (formData.national_id.length !== 10) {
      setError("کد ملی باید دقیقاً ۱۰ رقم باشد.");
      setIsLoading(false);
      return;
    }
    if (!/^09\d{9}$/.test(formData.phone)) {
      setError("شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.");
      setIsLoading(false);
      return;
    }

    try {
      // ارسال درخواست PATCH به سرور
      await updatePassenger(token, initialData.id, {
        ...formData,
        birth_date: formData.birth_date || null,
      });

      // هدایت به صفحه جزئیات و رفرش دیتا
      router.push(`/admin/customers/${initialData.id}`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "خطایی در ویرایش اطلاعات رخ داد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-300">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* نام */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <User className="h-3.5 w-3.5" /> نام
            </label>
            <input
              required
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            />
          </div>

          {/* نام خانوادگی */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <User className="h-3.5 w-3.5" /> نام خانوادگی
            </label>
            <input
              required
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            />
          </div>

          {/* کد ملی */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <CreditCard className="h-3.5 w-3.5" /> کد ملی
            </label>
            <input
              required
              name="national_id"
              dir="ltr"
              maxLength={10}
              value={formData.national_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          {/* جنسیت */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Users className="h-3.5 w-3.5" /> جنسیت
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            >
              <option value="male">مرد</option>
              <option value="female">زن</option>
            </select>
          </div>

          {/* شماره موبایل */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Phone className="h-3.5 w-3.5" /> شماره موبایل
            </label>
            <input
              required
              name="phone"
              dir="ltr"
              placeholder="09..."
              maxLength={11}
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            />
          </div>

          {/* تاریخ تولد */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Calendar className="h-3.5 w-3.5" /> تاریخ تولد (اختیاری)
            </label>
            <input
              name="birth_date"
              type="date"
              dir="ltr"
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            />
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-amber-500/10">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/customers/${initialData.id}`)}
            disabled={isLoading}
          >
            انصراف
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
                در حال ذخیره...
              </>
            ) : (
              "ذخیره تغییرات"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
