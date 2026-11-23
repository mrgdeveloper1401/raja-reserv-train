// app/component/orders/OrderEditModal.tsx
"use client";

import { useState } from "react";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { updateOrder } from "@/app/lib/api";
import { Loader2, Save, Plus, Trash2, User, CheckSquare } from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { formatTomanFa, toEnglishDigits } from "@/app/utils/config";
import { StationCombobox } from "../ui/StationCombobox";
import {
  EditOrderType,
  Passenger,
  RajaAccountOption,
} from "@/app/types/index.type";

interface PassengerFormData {
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string;
}

interface Props {
  order: EditOrderType;
  rajaAccounts: RajaAccountOption[];
  token: string;
  stations: { Name: string }[]; // <--- اضافه شد
  onClose: () => void;
  onRefresh: () => void;
}

function normalizePriceForInput(value: string | number | null | undefined) {
  return String(value ?? "").replace(/\.0+$/, "");
}

const DEPARTURE_TIME_SLOTS = [
  { value: 0, label: "۰۰:۰۰ تا ۰۶:۰۰" },
  { value: 6, label: "۰۶:۰۰ تا ۱۲:۰۰" },
  { value: 12, label: "۱۲:۰۰ تا ۱۸:۰۰" },
  { value: 18, label: "۱۸:۰۰ تا ۲۱:۰۰" },
  { value: 21, label: "۲۱:۰۰ تا ۲۴:۰۰" },
] as const;

export function OrderEditModal({
  order,
  token,
  stations,
  onClose,
  onRefresh,
  rajaAccounts,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const initialDepartureTimeSlots = order.departure_time_slots ?? [];
  const [departureTimeSlots, setDepartureTimeSlots] = useState<number[]>(() => [
    ...new Set(initialDepartureTimeSlots),
  ]);
  const initialSlots = new Set(initialDepartureTimeSlots);
  const slotsChanged =
    departureTimeSlots.length !== initialSlots.size ||
    departureTimeSlots.some((slot) => !initialSlots.has(slot));

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

  const handleDepartureTimeSlotChange = (slot: number, checked: boolean) => {
    setDepartureTimeSlots((previous) =>
      checked
        ? [...new Set([...previous, slot])]
        : previous.filter((value) => value !== slot),
    );
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  // استیت فرم اصلی
  const [formData, setFormData] = useState({
    origin: order.origin || "",
    destination: order.destination || "",
    train_number: order.train_number?.join(",") ?? "",
    phone: order.phone || "",
    coupe_type: order.coupe_type || "all",
    adult_number: order.adult_number || 1,
    baby_number: order.baby_number || 0,
    is_exclusive: Boolean(order.is_exclusive),
    from_price: normalizePriceForInput(order.from_price),
    to_price: normalizePriceForInput(order.to_price),
    raja_account_id: order.raja_account_id ? String(order.raja_account_id) : "",
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

      const trainNumbers = [
        ...new Set(
          toEnglishDigits(formData.train_number)
            .split(/[,،\s]+/)
            .filter(Boolean),
        ),
      ];

      if (trainNumbers.some((value) => !/^[0-9]{1,10}$/.test(value))) {
        setError("هر شماره قطار باید بین ۱ تا ۱۰ رقم باشد.");
        return; // finally لودینگ رو خاموش می‌کنه
      }

      if (!formData.raja_account_id) {
        setError("لطفاً یک اکانت رجا برای انجام رزرو انتخاب کنید.");
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
        ...(slotsChanged
          ? {
              departure_time_slots: [...departureTimeSlots].sort(
                (a, b) => a - b,
              ),
            }
          : {}),

        passengers: passengers, // <--- ارسال لیست مسافران
        train_number: trainNumbers,
        raja_account_id:
          formData.raja_account_id && Number(formData.raja_account_id),
      };

      // حذف فیلدهای خالی
      Object.keys(payload).forEach((key) => {
        if (
          key !== "raja_account_id" &&
          (payload[key] === "" || payload[key] === null)
        ) {
          delete payload[key];
        }
      });
      console.log(payload);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl my-8">
        <h2 className="text-lg font-bold text-amber-50 mb-4">
          ویرایش سفارش #{order.id}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
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
                // اضافه کردن استایل برای رفع رنگ زرد فوکوس
                className="custom-datepicker"
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
            <div className="flex items-center justify-between mb-4">
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
                  className="relative border border-amber-500/10 rounded-lg p-4 bg-[#0f0d0a]/50"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <label className="block text-xs text-amber-100/40 mb-1">
                        نام
                      </label>
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
                    </div>
                    <div>
                      <label className="block text-xs text-amber-100/40 mb-1">
                        نام خانوادگی
                      </label>
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
                    </div>
                    <div>
                      <label className="block text-xs text-amber-100/40 mb-1">
                        کد ملی
                      </label>
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
                    </div>
                    <div>
                      <label className="block text-xs text-amber-100/40 mb-1">
                        تاریخ تولد
                      </label>
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
                        onChange={(date) =>
                          handlePassengerBirthDate(index, date)
                        }
                        calendar={persian}
                        locale={persian_fa}
                        inputClass={`${inputClass} font-mono`}
                        className="custom-datepicker"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* بخش ۳: تنظیمات رزرو */}
          <div className="border-t border-amber-500/10 pt-4">
            <h3 className="text-sm font-semibold text-amber-400 mb-4">
              تنظیمات رزرو
            </h3>

            {/* ردیف اول: نوع کوپه، بزرگسال، خردسال */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
            </div>

            {/* ردیف دوم: شماره قطار و قیمت‌ها */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs text-amber-100/60 mb-1">
                  شماره قطار
                </label>
                <input
                  name="train_number"
                  dir="ltr"
                  type="text"
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
                  type="text"
                  name="from_price"
                  value={formatTomanFa(String(formData.from_price))}
                  onChange={(e) => {
                    const digit = toEnglishDigits(e.target.value).replace(
                      /\D/g,
                      "",
                    );
                    setFormData({ ...formData, from_price: digit });
                  }}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-amber-100/60 mb-1">
                  حداکثر قیمت
                </label>
                <input
                  type="text"
                  name="to_price"
                  value={formatTomanFa(String(formData.to_price))}
                  onChange={(e) => {
                    const digits = toEnglishDigits(e.target.value).replace(
                      /\D/g,
                      "",
                    );
                    setFormData((prev) => ({ ...prev, to_price: digits }));
                  }}
                  className={inputClass}
                />
              </div>
            </div>

            {/* ردیف سوم: کوپه دربست */}
            <div className="mb-6 flex items-center gap-2 bg-[#0f0d0a] p-3 rounded-lg border border-amber-500/10 w-full md:w-1/2">
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
                <CheckSquare className="h-4 w-4 text-amber-400" /> درخواست کوپه
                دربست (اختصاصی)
              </label>
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
                  <option key={acc.id} value={String(acc.id)}>
                    {acc.username}
                  </option>
                ))}
              </select>
            </div>

            {/* بخش زمان حرکت قطار - تمام عرض */}
            <div className="border-t border-amber-500/10 pt-4">
              <fieldset>
                <legend className="text-sm font-semibold text-amber-400 mb-2">
                  زمان حرکت قطار رفت
                </legend>
                <p className="mb-3 text-xs text-amber-100/60">
                  می‌توانید چند بازه انتخاب کنید. بدون انتخاب، محدودیت ساعت حرکت
                  ندارید.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {DEPARTURE_TIME_SLOTS.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-amber-500/10 bg-[#0f0d0a] p-3 text-sm text-amber-50 hover:border-amber-500/30 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={departureTimeSlots.includes(value)}
                        onChange={(e) =>
                          handleDepartureTimeSlotChange(
                            value,
                            e.currentTarget.checked,
                          )
                        }
                        disabled={isLoading}
                        className="h-4 w-4 accent-amber-500 rounded"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-amber-500/10">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[120px]"
            >
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
