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
  Users,
  ArrowLeftRight,
  BedDouble,
  ListFilter,
} from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import { createOrder } from "../../lib/api";
import type { RajaAccountOption } from "../../types/index.type";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { toEnglishDigits } from "@/app/utils/config";

interface Props {
  token: string;
  rajaAccounts: RajaAccountOption[];
}

export function CreateOrderForm({ token, rajaAccounts }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [birthDate, setBirthDate] = useState<DateObject | null>(null);
  const [travelDate, setTravelDate] = useState<DateObject | null>(null);
  const [toDate, setToDate] = useState<DateObject | null>(null);

  const [formData, setFormData] = useState({
    // مسافر
    first_name: "",
    last_name: "",
    national_id: "",
    gender: "male", // مقدار پیش‌فرض
    phone: "",
    birth_date: "",
    // سفر
    origin: "",
    destination: "",
    travel_date: "",
    to_date: "", // در حالت تک‌سفره خالی می‌ماند
    passenger_type: "normal",
    trip_type: "outbound", // مقدار پیش‌فرض
    coupe_type: "", // اختیاری
    order_by: "clock", // مقدار پیش‌فرض
    // اکانت رجا
    raja_account_id: rajaAccounts[0]?.id || "",
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

    // اعتبارسنجی‌های سمت کلاینت
    if (formData.national_id.length !== 10) {
      setError("کد ملی باید ۱۰ رقم باشد.");
      setIsLoading(false);
      return;
    }

    // if (!formData.birth_date || !formData.travel_date) {
    //   setError("تاریخ تولد و تاریخ سفر الزامی هستند.");
    //   setIsLoading(false);
    //   return;
    // }

    // if (formData.trip_type === "outbound_and_return" && !formData.to_date) {
    //   setError("برای سفر رفت و برگشت، وارد کردن تاریخ برگشت الزامی است.");
    //   setIsLoading(false);
    //   return;
    // }

    try {
      //  تبدیل تاریخ تولد از شمسی به میلادی در لحظه ارسال
      const gregorianBirthDate = birthDate
        ?.convert(gregorian)
        .format("YYYY-MM-DD");
      const gregorianTravelDate = travelDate
        ?.convert(gregorian)
        .format("YYYY-MM-DD");
      const gregorianToDate = toDate?.convert(gregorian).format("YYYY-MM-DD");

      // اگر سفر تک‌سفره است، مطمئن می‌شویم to_date خالی (null) ارسال شود
      const payload = {
        ...formData,
        birth_date: gregorianBirthDate
          ? toEnglishDigits(gregorianBirthDate)
          : null,
        travel_date: gregorianTravelDate
          ? toEnglishDigits(gregorianTravelDate)
          : null,
        to_date:
          formData.trip_type === "outbound_and_return" && gregorianToDate
            ? toEnglishDigits(gregorianToDate)
            : null,
        coupe_type: formData.coupe_type || null,
      };

      console.log("Payload to send:", payload);
      await createOrder(token, payload);
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
          {/* فیلد جنسیت اضافه شد */}
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
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Calendar className="h-3.5 w-3.5" /> تاریخ تولد
            </label>
            {/* <input
              required
              type="date"
              name="birth_date"
              dir="ltr"
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            /> */}
            <DatePicker
              placeholder="برای نمایش کلیک کنید"
              onChange={setBirthDate}
              calendar={persian}
              locale={persian_fa}
              name="birth_date"
              required
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

        {/* نوع سفر (تک سفره / رفت و برگشت) */}
        <div className="mb-4 flex items-center gap-4 bg-[#0f0d0a] p-3 rounded-lg border border-amber-500/10">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trip_type"
              value="outbound"
              checked={formData.trip_type === "outbound"}
              onChange={handleChange}
              className="text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-amber-50">تک سفره</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="trip_type"
              value="outbound_and_return"
              checked={formData.trip_type === "outbound_and_return"}
              onChange={handleChange}
              className="text-amber-500 focus:ring-amber-500"
            />
            <span className="text-sm text-amber-50">رفت و برگشت</span>
          </label>
        </div>

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

          {/* تاریخ سفر */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Calendar className="h-3.5 w-3.5" /> تاریخ سفر{" "}
              {formData.trip_type === "outbound_and_return" && "(رفت)"}
            </label>
            {/* <input
              required
              type="date"
              name="travel_date"
              dir="ltr"
              value={formData.travel_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
            /> */}
            <DatePicker
              placeholder="برای نمایش کلیک کنید"
              inputClass="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
              required
              portal
              name="travel_date"
              onChange={setTravelDate}
              minDate={new Date()}
              calendar={persian}
              locale={persian_fa}
            />
          </div>

          {/* تاریخ برگشت (فقط در صورت انتخاب رفت و برگشت نمایش داده می‌شود) */}
          {formData.trip_type === "outbound_and_return" && (
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
                <Calendar className="h-3.5 w-3.5" /> تاریخ برگشت
              </label>
              {/* <input
                required
                type="date"
                name="to_date"
                dir="ltr"
                value={formData.to_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
              /> */}
              <DatePicker
                placeholder="برای نمایش کلیک کنید"
                inputClass="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 font-mono"
                required
                portal
                name="to_date"
                minDate={new Date().setDate(new Date().getDate() + 1)}
                onChange={setToDate}
                calendar={persian}
                locale={persian_fa}
              />
            </div>
          )}

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

      {/* بخش ۳: فیلترها و اکانت رجا */}
      <Card>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-50">
          <ListFilter className="h-5 w-5 text-amber-400" /> تنظیمات رزرو
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* نوع کوپه */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <BedDouble className="h-3.5 w-3.5" /> نوع کوپه (اختیاری)
            </label>
            <select
              name="coupe_type"
              value={formData.coupe_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            >
              <option value="">همه انواع</option>
              <option value="four">چهار تخته</option>
              <option value="six">شش تخته</option>
              <option value="for_row">سالنی ۴ ردیفه</option>
            </select>
          </div>

          {/* مرتب‌سازی */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <ArrowLeftRight className="h-3.5 w-3.5" /> مرتب‌سازی نتایج
            </label>
            <select
              name="order_by"
              value={formData.order_by}
              onChange={handleChange}
              className="w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50"
            >
              <option value="clock">ساعت حرکت</option>
              <option value="cheap">ارزان‌ترین</option>
              <option value="expensive">گران‌ترین</option>
              <option value="owner">مالک</option>
            </select>
          </div>
        </div>

        <div className="border-t border-amber-500/10 pt-4">
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
