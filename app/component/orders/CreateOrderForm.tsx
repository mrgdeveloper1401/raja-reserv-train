// app/component/orders/CreateOrderForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  Train,
  Loader2,
} from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import { createOrder } from "../../lib/api";
import type { RajaAccountOption } from "../../types/index.type";

interface Props {
  token: string;
  rajaAccounts: RajaAccountOption[];
}

export function CreateOrderForm({ token, rajaAccounts }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    // مسافر
    first_name: "",
    last_name: "",
    national_id: "",
    gender: "male",
    phone: "",
    birth_date: "", // این مقدار همیشه به صورت میلادی (YYYY-MM-DD) ذخیره می‌شود
    // سفر
    origin: "",
    destination: "",
    travel_date: "", // این مقدار همیشه به صورت میلادی (YYYY-MM-DD) ذخیره می‌شود
    passenger_type: "normal",
    // اکانت رجا
    raja_account_id: rajaAccounts[0]?.id || "",
  });

  // هندلرهای جداگانه برای DatePicker که مقدار میلادی را در state ذخیره می‌کنند
  const handleBirthDateChange = (dateObject: DateObject | null) => {
    if (dateObject) {
      // تبدیل به میلادی و فرمت YYYY-MM-DD
      const gregorianStr = dateObject.convert("gregorian").format("YYYY-MM-DD");
      setFormData((prev) => ({ ...prev, birth_date: gregorianStr }));
    } else {
      setFormData((prev) => ({ ...prev, birth_date: "" }));
    }
  };

  const handleTravelDateChange = (dateObject: DateObject | null) => {
    if (dateObject) {
      const gregorianStr = dateObject.convert("gregorian").format("YYYY-MM-DD");
      setFormData((prev) => ({ ...prev, travel_date: gregorianStr }));
    } else {
      setFormData((prev) => ({ ...prev, travel_date: "" }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.national_id.length !== 10) {
      setError("کد ملی باید ۱۰ رقم باشد.");
      setIsLoading(false);
      return;
    }

    if (!formData.birth_date || !formData.travel_date) {
      setError("تاریخ تولد و تاریخ سفر الزامی هستند.");
      setIsLoading(false);
      return;
    }

    try {
      // 🟢 اینجا تاریخ‌ها را به میلادی تبدیل می‌کنیم 🟢
      let gregorianBirthDate = formData.birth_date;
      let gregorianTravelDate = formData.travel_date;

      // اگر تاریخ شامل '/' بود (یعنی هنوز شمسی است)
      if (formData.birth_date.includes("/")) {
        gregorianBirthDate = new DateObject({
          date: formData.birth_date,
          calendar: persian,
        })
          .convert("gregorian")
          .format("YYYY-MM-DD");
      }

      if (formData.travel_date.includes("/")) {
        gregorianTravelDate = new DateObject({
          date: formData.travel_date,
          calendar: persian,
        })
          .convert("gregorian")
          .format("YYYY-MM-DD");
      }

      // ساخت آبجکت نهایی برای ارسال
      const payload = {
        ...formData,
        birth_date: gregorianBirthDate,
        travel_date: gregorianTravelDate,
      };

      console.log("Payload to send:", payload);

      await createOrder(token, payload); // ارسال payload میلادی

      router.push("/admin/orders");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "خطایی در ثبت سفارش رخ داد.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      {error && (
        <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-300">
          {error}
        </div>
      )}

      {/* بخش ۱: اطلاعات مسافر */}
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-50">
          <User className="h-5 w-5 text-amber-400" /> اطلاعات مسافر
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ... فیلدهای نام، نام خانوادگی، کد ملی، موبایل بدون تغییر ... */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              نام
            </label>
            <input
              required
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              نام خانوادگی
            </label>
            <input
              required
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            />
          </div>
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
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Phone className="h-3.5 w-3.5" /> موبایل
            </label>
            <input
              required
              name="phone"
              dir="ltr"
              maxLength={11}
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            />
          </div>
          {/* فیلد تاریخ تولد با DatePicker */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Calendar className="h-3.5 w-3.5" /> تاریخ تولد
            </label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={formData.birth_date ? formData.birth_date : ""}
              onChange={handleBirthDateChange}
              format="YYYY/MM/DD"
              portal
              inputClass="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            />
          </div>
        </div>
      </Card>

      {/* بخش ۲: اطلاعات سفر */}
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-50">
          <Train className="h-5 w-5 text-amber-400" /> اطلاعات سفر
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <MapPin className="h-3.5 w-3.5" /> مبدا
            </label>
            <input
              required
              name="origin"
              value={formData.origin}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <MapPin className="h-3.5 w-3.5" /> مقصد
            </label>
            <input
              required
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            />
          </div>
          {/* فیلد تاریخ سفر با DatePicker */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Calendar className="h-3.5 w-3.5" /> تاریخ سفر
            </label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={formData.travel_date ? formData.travel_date : ""}
              onChange={handleTravelDateChange}
              format="YYYY/MM/DD"
              portal
              inputClass="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              نوع بلیط
            </label>
            <select
              name="passenger_type"
              value={formData.passenger_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            >
              <option value="normal">عادی</option>
              <option value="man">ویژه برادران</option>
              <option value="woman">ویژه خواهران</option>
            </select>
          </div>
        </div>
      </Card>

      {/* بخش ۳: اکانت رجا (بدون تغییر) */}
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-50">
          <User className="h-5 w-5 text-amber-400" /> اکانت رزرو
        </h2>
        <div>
          <label className="mb-1.5 block text-xs text-amber-100/60">
            اکانت رجا برای انجام رزرو
          </label>
          <select
            required
            name="raja_account_id"
            value={formData.raja_account_id}
            onChange={handleChange}
            className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
          >
            <option value="" disabled>
              انتخاب کنید...
            </option>
            {rajaAccounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.username}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          انصراف
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin ml-2" /> در حال ثبت...
            </>
          ) : (
            "ثبت سفارش و شروع رزرو"
          )}
        </Button>
      </div>
    </form>
  );
}
