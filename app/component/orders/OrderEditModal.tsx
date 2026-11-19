// app/component/orders/OrderEditModal.tsx
"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { updateOrder } from "@/app/lib/api";
import { Loader2, Save, Plus, Trash2, User } from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { toEnglishDigits } from "@/app/utils/config";
import { StationCombobox } from "../ui/StationCombobox";
import { EditOrderType, Passenger } from "@/app/types/index.type";

interface PassengerFormData {
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string;
}

interface Props {
  order: EditOrderType;
  token: string;
  stations: { Name: string }[]; // <--- اضافه شد
  onClose: () => void;
  onRefresh: () => void;
}

export function OrderEditModal({
  order,
  token,
  stations,
  onClose,
  onRefresh,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // تبدیل تاریخ میلادی به شمسی
  const initialTravelDate = order.travel_date
    ? new DateObject({ date: order.travel_date, calendar: gregorian }).convert(
        persian,
        persian_fa,
      )
    : null;
  const [travelDate, setTravelDate] = useState<DateObject | null>(
    initialTravelDate,
  );

  // استیت فرم اصلی
  const [formData, setFormData] = useState({
    origin: order.origin || "",
    destination: order.destination || "",
    train_number: order.train_number || "",
    phone: order.phone || "",
    coupe_type: order.coupe_type || "all",
    adult_number: order.adult_number || 1,
    baby_number: order.baby_number || 0,
    from_price: order.from_price || "",
    to_price: order.to_price || "",
    departure_time_from: order.departure_time_from || "",
    departure_time_to: order.departure_time_to || "",
  });

  // استیت مسافران (مقداردهی اولیه از order.passengers)
  const [passengers, setPassengers] = useState<PassengerFormData[]>(
    order.passengers?.map((p: Passenger) => ({
      first_name: p.first_name,
      last_name: p.last_name,
      national_id: toEnglishDigits(p.national_id),
      birth_date: p.birth_date, // تاریخ‌ها به صورت میلادی (YYYY-MM-DD) هستند
    })) || [{ first_name: "", last_name: "", national_id: "", birth_date: "" }],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePassengerChange = (
    index: number,
    field: keyof PassengerFormData,
    value: string,
  ) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const handlePassengerBirthDate = (index: number, date: DateObject | null) => {
    if (!date) return;
    const gregorianDate = date.convert(gregorian).format("YYYY-MM-DD");
    handlePassengerChange(index, "birth_date", toEnglishDigits(gregorianDate));
  };

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      { first_name: "", last_name: "", national_id: "", birth_date: "" },
    ]);
  };

  const removePassenger = (index: number) => {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const gregorianTravelDate = travelDate
        ?.convert(gregorian)
        .format("YYYY-MM-DD");

      if (!formData.phone || formData.phone.trim() === "") {
        setError("شماره موبایل رزرو الزامی هست");
        setIsLoading(false);
        return;
      }

      // چک کردن تعداد مسافر
      if (
        Number(formData.adult_number) + Number(formData.baby_number) >
        passengers.length
      ) {
        setError("تعداد افراد بیش تر از بلوک های مسافر هست ");
        setIsLoading(false);
        return;
      }

      // چک کردن تعداد مسافر
      if (
        Number(formData.adult_number) + Number(formData.baby_number) <
        passengers.length
      ) {
        setError(
          "تعداد بلوک های مسافر بیش تر از تعداد بزرگسال و تعداد خردسال است",
        );
        setIsLoading(false);
        return;
      }

      const payload: EditOrderType = {
        ...formData,
        travel_date: gregorianTravelDate
          ? toEnglishDigits(gregorianTravelDate)
          : null,
        from_price: formData.from_price ? Number(formData.from_price) : null,
        to_price: formData.to_price ? Number(formData.to_price) : null,
        adult_number: Number(formData.adult_number),
        baby_number: Number(formData.baby_number),
        departure_time_from: formData.departure_time_from
          ? Number(formData.departure_time_from)
          : null,
        departure_time_to: formData.departure_time_to
          ? Number(formData.departure_time_to)
          : null,
        passengers: passengers, // <--- ارسال لیست مسافران
      };

      // حذف فیلدهای خالی
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || payload[key] === null) {
          delete payload[key];
        }
      });

      await updateOrder(token, order.id, payload);
      onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2 text-sm text-amber-50";
  const timeInputClass = `${inputClass} font-mono text-center`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8">
        <h2 className="text-lg font-bold text-amber-50 mb-4">
          ویرایش سفارش #{order.id}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/30 p-3 text-sm text-rose-300">
              {error}
            </div>
          )}
          {/* بخش ۱: اطلاعات سفر */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                مبدا
              </label>
              <StationCombobox
                stations={stations}
                value={formData.origin}
                onChange={(val) => setFormData({ ...formData, origin: val })}
                placeholder="انتخاب مبدا..."
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                مقصد
              </label>
              <StationCombobox
                stations={stations}
                value={formData.destination}
                onChange={(val) =>
                  setFormData({ ...formData, destination: val })
                }
                placeholder="انتخاب مقصد..."
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                تاریخ سفر
              </label>
              <DatePicker
                value={travelDate}
                onChange={setTravelDate}
                calendar={persian}
                locale={persian_fa}
                inputClass={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                شماره موبایل
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {/* بخش ۲: مسافران */}
          <div className="border-t border-amber-500/10 pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
                <User className="h-4 w-4" /> مسافران
              </h3>
              <Button type="button" size="sm" onClick={addPassenger}>
                <Plus className="h-4 w-4 ml-1" /> افزودن مسافر
              </Button>
            </div>
            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="relative border border-amber-500/10 rounded-lg p-3 bg-[#0f0d0a]/50"
                >
                  {passengers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePassenger(index)}
                      className="absolute top-2 left-2 text-rose-400 hover:text-rose-300"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <input
                      placeholder="نام"
                      value={passenger.first_name}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "first_name",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="نام خانوادگی"
                      value={passenger.last_name}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "last_name",
                          e.target.value,
                        )
                      }
                      className={inputClass}
                    />
                    <input
                      placeholder="کد ملی"
                      dir="ltr"
                      maxLength={10}
                      value={passenger.national_id}
                      onChange={(e) =>
                        handlePassengerChange(
                          index,
                          "national_id",
                          e.target.value,
                        )
                      }
                      className={`${inputClass} font-mono`}
                    />
                    <DatePicker
                      placeholder="تاریخ تولد"
                      value={
                        passenger.birth_date
                          ? new DateObject({
                              date: passenger.birth_date,
                              calendar: gregorian,
                            }).convert(persian, persian_fa)
                          : null
                      }
                      onChange={(date) => handlePassengerBirthDate(index, date)}
                      calendar={persian}
                      locale={persian_fa}
                      inputClass={`${inputClass} font-mono`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* بخش ۳: تنظیمات رزرو */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-amber-500/10 pt-4">
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                نوع کوپه
              </label>
              <select
                name="coupe_type"
                value={formData.coupe_type}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="all">همه انواع</option>
                <option value="four">4 تخته 4 ستاره</option>
                <option value="three">سه ستاره</option>
                <option value="five">5 ستاره</option>
                <option value="salon">سالنی</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                تعداد بزرگسال
              </label>
              <input
                type="number"
                min={0}
                name="adult_number"
                value={formData.adult_number}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                تعداد خردسال
              </label>
              <input
                min={0}
                type="number"
                name="baby_number"
                value={formData.baby_number}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                شماره قطار
              </label>
              <input
                name="train_number"
                min={1}
                value={formData.train_number}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                حداقل قیمت
              </label>
              <input
                type="number"
                min={0}
                name="from_price"
                value={formData.from_price}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                حداکثر قیمت
              </label>
              <input
                type="number"
                name="to_price"
                min={1}
                value={formData.to_price}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                زمان حرکت از
              </label>
              <input
                type="number"
                min={0}
                max={24}
                name="departure_time_from"
                value={formData.departure_time_from}
                onChange={handleChange}
                className={timeInputClass}
              />
            </div>
            <div>
              <label className="block text-xs text-amber-100/60 mb-1">
                زمان حرکت تا
              </label>
              <input
                type="number"
                min={0}
                max={24}
                name="departure_time_to"
                value={formData.departure_time_to}
                onChange={handleChange}
                className={timeInputClass}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-amber-500/10">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4 ml-1" /> ذخیره تغییرات
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
