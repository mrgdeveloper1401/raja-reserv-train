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
  Clock,
  CheckSquare,
  DollarSign, // آیکون برای قیمت
  Hash, // آیکون برای شماره قطار
  DoorOpen, // آیکون برای سالن
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
import { StationCombobox } from "../ui/StationCombobox";

interface Props {
  token: string;
  rajaAccounts: RajaAccountOption[];
  stations: { Name: string }[];
}

export function CreateOrderForm({ token, rajaAccounts, stations }: Props) {
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
    gender: "male",
    phone: "",
    birth_date: "",
    // سفر
    origin: "",
    destination: "",
    travel_date: "",
    to_date: "",
    passenger_type: "normal",
    trip_type: "outbound",
    coupe_type: "",
    order_by: "clock",
    // اکانت رجا
    raja_account_id: rajaAccounts[0]?.id || "",

    // --- فیلدهای جدید ---
    is_exclusive: false,
    departure_time_from: "",
    departure_time_to: "",
    arrival_time_from: "",
    arrival_time_to: "",
    // --- فیلدهای قیمت و قطار ---
    from_price: "",
    to_price: "",
    train_number: "",
    salon: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.national_id.length !== 10) {
      setError("کد ملی باید ۱۰ رقم باشد.");
      setIsLoading(false);
      return;
    }

    try {
      const gregorianBirthDate = birthDate
        ?.convert(gregorian)
        .format("YYYY-MM-DD");
      const gregorianTravelDate = travelDate
        ?.convert(gregorian)
        .format("YYYY-MM-DD");
      const gregorianToDate = toDate?.convert(gregorian).format("YYYY-MM-DD");

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
        salon: formData.salon || null,
        train_number: formData.train_number || null,

        // تبدیل مقادیر به عدد یا بولین
        raja_account_id: Number(formData.raja_account_id),
        is_exclusive: Boolean(formData.is_exclusive),

        // تبدیل قیمت‌ها به عدد اعشاری
        from_price: formData.from_price ? Number(formData.from_price) : null,
        to_price: formData.to_price ? Number(formData.to_price) : null,

        departure_time_from: formData.departure_time_from
          ? Number(formData.departure_time_from)
          : null,
        departure_time_to: formData.departure_time_to
          ? Number(formData.departure_time_to)
          : null,
        arrival_time_from: formData.arrival_time_from
          ? Number(formData.arrival_time_from)
          : null,
        arrival_time_to: formData.arrival_time_to
          ? Number(formData.arrival_time_to)
          : null,
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

  const inputClass =
    "w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50";
  const timeInputClass = `${inputClass} font-mono text-center`;

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
              className={inputClass}
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
              className={inputClass}
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
              className={`${inputClass} font-mono`}
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Users className="h-3.5 w-3.5" /> جنسیت
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClass}
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
              className={`${inputClass} font-mono`}
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Calendar className="h-3.5 w-3.5" /> تاریخ تولد
            </label>
            <DatePicker
              placeholder="برای نمایش کلیک کنید"
              onChange={setBirthDate}
              calendar={persian}
              locale={persian_fa}
              name="birth_date"
              required
              portal
              inputClass={`${inputClass} font-mono`}
            />
          </div>
        </div>
      </Card>

      {/* بخش ۲: اطلاعات سفر */}
      <Card className="relative z-20">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-50">
          <Train className="h-5 w-5 text-amber-400" /> اطلاعات سفر
        </h2>

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
            <StationCombobox
              stations={stations}
              value={formData.origin}
              onChange={(val) => setFormData({ ...formData, origin: val })}
              placeholder="انتخاب مبدا..."
              required
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <MapPin className="h-3.5 w-3.5" /> مقصد
            </label>
            <StationCombobox
              stations={stations}
              value={formData.destination}
              onChange={(val) => setFormData({ ...formData, destination: val })}
              placeholder="انتخاب مقصد..."
              required
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Calendar className="h-3.5 w-3.5" /> تاریخ سفر{" "}
              {formData.trip_type === "outbound_and_return" && "(رفت)"}
            </label>
            <DatePicker
              placeholder="برای نمایش کلیک کنید"
              inputClass={`${inputClass} font-mono`}
              required
              portal
              name="travel_date"
              onChange={setTravelDate}
              minDate={new Date()}
              calendar={persian}
              locale={persian_fa}
            />
          </div>
          {formData.trip_type === "outbound_and_return" && (
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
                <Calendar className="h-3.5 w-3.5" /> تاریخ برگشت
              </label>
              <DatePicker
                placeholder="برای نمایش کلیک کنید"
                inputClass={`${inputClass} font-mono`}
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
              className={inputClass}
            >
              <option value="normal">عادی</option>
              <option value="man">ویژه برادران</option>
              <option value="woman">ویژه خواهران</option>
            </select>
          </div>
        </div>
      </Card>

      {/* بخش ۳: تنظیمات رزرو و زمان‌بندی */}
      <Card className="relative z-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-50">
          <ListFilter className="h-5 w-5 text-amber-400" /> تنظیمات رزرو
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <BedDouble className="h-3.5 w-3.5" /> نوع کوپه (اختیاری)
            </label>
            <select
              name="coupe_type"
              value={formData.coupe_type}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">همه انواع</option>
              <option value="four">چهار تخته</option>
              <option value="six">شش تخته</option>
              <option value="for_row">سالنی ۴ ردیفه</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <ArrowLeftRight className="h-3.5 w-3.5" /> مرتب‌سازی نتایج
            </label>
            <select
              name="order_by"
              value={formData.order_by}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="clock">ساعت حرکت</option>
              <option value="cheap">ارزان‌ترین</option>
              <option value="expensive">گران‌ترین</option>
              <option value="owner">مالک</option>
            </select>
          </div>
        </div>

        {/* --- فیلدهای جدید قیمت و اطلاعات قطار --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border-t border-amber-500/10 pt-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <DollarSign className="h-3.5 w-3.5" /> حداقل قیمت (هزار تومان)
            </label>
            <input
              type="number"
              name="from_price"
              value={formData.from_price}
              onChange={handleChange}
              placeholder="مثلاً 1500"
              className={`${inputClass} font-mono`}
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <DollarSign className="h-3.5 w-3.5" /> حداکثر قیمت (هزار تومان)
            </label>
            <input
              type="number"
              name="to_price"
              value={formData.to_price}
              onChange={handleChange}
              placeholder="مثلاً 2500"
              className={`${inputClass} font-mono`}
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Hash className="h-3.5 w-3.5" /> شماره قطار
            </label>
            <input
              type="text"
              name="train_number"
              value={formData.train_number}
              onChange={handleChange}
              placeholder="مثلاً 123"
              className={`${inputClass} font-mono`}
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <DoorOpen className="h-3.5 w-3.5" /> نوع سالن
            </label>
            <select
              name="salon"
              value={formData.salon}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">همه سالن‌ها</option>
              <option value="4_star_4_coupe">4 ستاره 4 تخته</option>
              <option value="4_star_5_coupe">4 ستاره 5 تخته</option>
              <option value="5_star">5 ستاره</option>
              <option value="3_star_6_coupe">3 ستاره 6 تخته</option>
            </select>
          </div>
        </div>

        {/* ---------------------------------- */}

        {/* --- فیلد کوپه دربست --- */}
        <div className="mb-6 flex items-center gap-2 bg-[#0f0d0a] p-3 rounded-lg border border-amber-500/10">
          <input
            type="checkbox"
            id="is_exclusive"
            name="is_exclusive"
            checked={formData.is_exclusive}
            onChange={handleCheckboxChange}
            className="h-4 w-4 rounded border-amber-500/20 bg-[#0f0d0a] text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
          />
          <label
            htmlFor="is_exclusive"
            className="flex items-center gap-2 cursor-pointer text-sm text-amber-50"
          >
            <CheckSquare className="h-4 w-4 text-amber-400" />
            درخواست کوپه دربست (اختصاصی)
          </label>
        </div>
        {/* ---------------------------------- */}

        <div className="border-t border-amber-500/10 pt-5 mb-5 space-y-5">
          <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <Clock className="h-4 w-4" /> فیلترهای زمانی (اختیاری)
          </h3>
          <div>
            <label className="mb-2 block text-xs text-amber-100/60">
              زمان حرکت (قطار رفت)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-amber-100/40 mb-1 block">
                  از ساعت
                </span>
                <input
                  type="number"
                  name="departure_time_from"
                  value={formData.departure_time_from}
                  onChange={handleChange}
                  className={timeInputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <span className="text-[10px] text-amber-100/40 mb-1 block">
                  تا ساعت
                </span>
                <input
                  type="number"
                  name="departure_time_to"
                  value={formData.departure_time_to}
                  onChange={handleChange}
                  className={timeInputClass}
                  dir="ltr"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs text-amber-100/60">
              زمان ورود به ایستگاه (مقصد)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-amber-100/40 mb-1 block">
                  از ساعت
                </span>
                <input
                  type="number"
                  name="arrival_time_from"
                  value={formData.arrival_time_from}
                  onChange={handleChange}
                  className={timeInputClass}
                  dir="ltr"
                />
              </div>
              <div>
                <span className="text-[10px] text-amber-100/40 mb-1 block">
                  تا ساعت
                </span>
                <input
                  type="number"
                  name="arrival_time_to"
                  value={formData.arrival_time_to}
                  onChange={handleChange}
                  className={timeInputClass}
                  dir="ltr"
                />
              </div>
            </div>
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
            className={inputClass}
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
