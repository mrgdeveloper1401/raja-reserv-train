// app/component/customers/CreateCustomerForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, CreditCard, Calendar } from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import { createPassenger } from "../../lib/api";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";

export function CreateCustomerForm({ token }: { token: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    national_id: "",
    birth_date: "",
  });

  // تاریخ ذخیره‌شده میلادی است؛ برای نمایش به شمسی تبدیل می‌شود.
  const birthDateValue = formData.birth_date
    ? new DateObject({
        date: formData.birth_date,
        format: "YYYY-MM-DD",
        calendar: gregorian,
        locale: gregorian_en,
      }).convert(persian, persian_fa)
    : null;

  const handleBirthDateChange = (date: DateObject | null) => {
    const birthDate =
      date && date.isValid
        ? new DateObject(date)
            .convert(gregorian, gregorian_en)
            .format("YYYY-MM-DD")
        : "";

    setFormData((previous) => ({
      ...previous,
      birth_date: birthDate,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // اعتبارسنجی ساده
    if (formData.national_id.length !== 10) {
      setError("کد ملی باید ۱۰ رقم باشد.");
      setIsLoading(false);
      return;
    }

    try {
      await createPassenger(token, {
        ...formData,
        birth_date: formData.birth_date || null,
      });
      router.push("/admin/customers");
      router.refresh(); // رفرش دیتای سرور
    } catch (err: any) {
      setError(err.message || "خطایی رخ داد.");
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

          {/* تاریخ تولد (اختیاری) */}
          <div>
            <label
              htmlFor="birth_date"
              className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60"
            >
              <Calendar className="h-3.5 w-3.5" />
              تاریخ تولد (اختیاری)
            </label>

            <DatePicker
              id="birth_date"
              name="birth_date"
              placeholder="تاریخ تولد را انتخاب کنید"
              calendar={persian}
              locale={persian_fa}
              format="YYYY/MM/DD"
              value={birthDateValue}
              onChange={handleBirthDateChange}
              maxDate={new Date()}
              disabled={isLoading}
              portal
              containerClassName="w-full"
              inputClass="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            />

            {formData.birth_date && (
              <button
                type="button"
                onClick={() => handleBirthDateChange(null)}
                disabled={isLoading}
                className="mt-2 text-xs text-amber-100/50 hover:text-rose-300 disabled:opacity-50"
              >
                پاک کردن تاریخ
              </button>
            )}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/customers")}
            disabled={isLoading}
          >
            انصراف
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "در حال ذخیره..." : "ثبت مشتری"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
