// app/component/orders/CreateOrderForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  MapPin,
  Calendar,
  Train,
  Loader2,
  BedDouble,
  ListFilter,
  Clock,
  CheckSquare,
  DollarSign,
  Hash,
  Plus,
  Trash2,
  Phone, // اضافه شد
  Baby, // اضافه شد
  UserCheck, // اضافه شد
} from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import { createOrder } from "../../lib/api";
import type { RajaAccountOption } from "../../types/index.type";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import { formatTomanFa, toEnglishDigits } from "@/app/utils/config";
import { StationCombobox } from "../ui/StationCombobox";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { PassengerPicker, SelectedPassenger } from "./PassengerPicker";
import { number } from "zod";

interface Props {
  token: string;
  rajaAccounts: RajaAccountOption[];
  stations: { Name: string }[];
}

// تعریف تایپ برای مسافر
interface PassengerFormData {
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string;
}

const DEPARTURE_TIME_SLOTS = [
  { value: 0, label: "۰۰:۰۰ تا ۰۶:۰۰" },
  { value: 6, label: "۰۶:۰۰ تا ۱۲:۰۰" },
  { value: 12, label: "۱۲:۰۰ تا ۱۸:۰۰" },
  { value: 18, label: "۱۸:۰۰ تا ۲۱:۰۰" },
  { value: 21, label: "۲۱:۰۰ تا ۲۴:۰۰" },
] as const;

type DepartureTimeSlot = (typeof DEPARTURE_TIME_SLOTS)[number]["value"];

export function CreateOrderForm({ token, rajaAccounts, stations }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [travelDate, setTravelDate] = useState<DateObject | null>(null);
  const [toDate, setToDate] = useState<DateObject | null>(null);

  const [passengers, setPassengers] = useState<PassengerFormData[]>([
    { first_name: "", last_name: "", national_id: "", birth_date: "" },
  ]);
  const [departureTimeSlots, setDepartureTimeSlots] = useState<
    DepartureTimeSlot[]
  >([]);

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    passenger_type: "family",
    trip_type: "outbound",
    raja_account_id: rajaAccounts[0]?.id || "",

    is_exclusive: false,
    departure_time_slots: "",
    from_price: "",
    to_price: "",
    train_number: "",
    coupe_type: "all",

    // --- فیلدهای اضافه شده ---
    adult_number: 1,
    baby_number: 0,
    phone: "",
  });

  const handleDepartureTimeSlotChange = (
    slot: DepartureTimeSlot,
    checked: boolean,
  ) => {
    setDepartureTimeSlots((previous) =>
      checked
        ? [...new Set([...previous, slot])].sort((a, b) => a - b)
        : previous.filter((value) => value !== slot),
    );
  };

  const handleSelectExistingPassenger = (selected: SelectedPassenger) => {
    const nationalId = toEnglishDigits(selected.national_id).trim();

    const isDuplicate = passengers.some(
      (passenger) =>
        toEnglishDigits(passenger.national_id).trim() === nationalId,
    );

    if (isDuplicate) {
      setError("این مسافر قبلاً به فرم اضافه شده است.");
      return;
    }

    const newPassenger: PassengerFormData = {
      first_name: selected.first_name,
      last_name: selected.last_name,
      national_id: nationalId,
      birth_date: selected.birth_date || "",
    };

    setError("");

    setPassengers((previous) => {
      // اگر بلوک کاملاً خالی وجود دارد، همان را پر می‌کنیم.
      const emptyIndex = previous.findIndex(
        (passenger) =>
          !passenger.first_name.trim() &&
          !passenger.last_name.trim() &&
          !passenger.national_id.trim() &&
          !passenger.birth_date,
      );

      if (emptyIndex === -1) {
        return [...previous, newPassenger];
      }

      return previous.map((passenger, index) =>
        index === emptyIndex ? newPassenger : passenger,
      );
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handlePassengerChange = (
    index: number,
    field: keyof PassengerFormData,
    value: string,
  ) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
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
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
  };

  // ارسال دیتا
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // بررسی کد ملی
    const invalidPassenger = passengers.find(
      (p) => p.national_id.length !== 10,
    );
    if (invalidPassenger) {
      setError("کد ملی همه مسافران باید ۱۰ رقم باشد.");
      setIsLoading(false);
      return;
    }

    // بررسی شماره موبایل
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
      console.log(
        `one: ${passengers.length} & ${formData.adult_number + formData.baby_number}`,
      );

      setError("تعداد افراد بیش تر از بلوک های مسافر هست ");
      setIsLoading(false);
      return;
    }

    // چک کردن تعداد مسافر
    if (
      Number(formData.adult_number) + Number(formData.baby_number) <
      passengers.length
    ) {
      console.log(
        `two: ${passengers.length} & ${formData.adult_number + formData.baby_number}`,
      );
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

    if (trainNumbers.some((number) => !/^[0-9]{1,10}$/.test(number))) {
      setError("هر شماره قطار باید بین ۱ تا ۱۰ رقم باشد.");
      return;
    }

    try {
      const gregorianTravelDate = travelDate
        ?.convert(gregorian)
        .format("YYYY-MM-DD");
      const gregorianToDate = toDate?.convert(gregorian).format("YYYY-MM-DD");

      const payload = {
        origin: formData.origin,
        destination: formData.destination,
        passenger_type: formData.passenger_type,
        trip_type: formData.trip_type,
        travel_date: gregorianTravelDate
          ? toEnglishDigits(gregorianTravelDate)
          : "",
        to_date:
          formData.trip_type === "outbound_and_return" && gregorianToDate
            ? toEnglishDigits(gregorianToDate)
            : null,
        raja_account_id: Number(formData.raja_account_id),
        is_exclusive: Boolean(formData.is_exclusive),
        departure_time_slots: departureTimeSlots,
        from_price: formData.from_price ? Number(formData.from_price) : null,
        to_price: formData.to_price ? Number(formData.to_price) : null,
        train_number: trainNumbers,
        coupe_type: formData.coupe_type === "all" ? null : formData.coupe_type,

        // --- این سه فیلد اضافه شدند ---
        adult_number: Number(formData.adult_number) || 1,
        baby_number: Number(formData.baby_number) || 0,
        phone: formData.phone,

        passengers: passengers.map((p) => ({
          first_name: p.first_name,
          last_name: p.last_name,
          national_id: toEnglishDigits(p.national_id),
          birth_date: p.birth_date,
        })),
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

      {/* بخش ۱: اطلاعات مسافران */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-amber-50">
            <User className="h-5 w-5 text-amber-400" /> اطلاعات مسافران
          </h2>
          <Button type="button" size="sm" onClick={addPassenger}>
            <Plus className="h-4 w-4 ml-1" /> افزودن مسافر
          </Button>
        </div>

        <PassengerPicker
          onSelect={handleSelectExistingPassenger}
          disabled={isLoading}
        />

        <div className="space-y-6">
          {passengers.map((passenger, index) => (
            <div
              key={index}
              className="relative border border-amber-500/10 rounded-lg p-4 bg-[#0f0d0a]/50"
            >
              {passengers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePassenger(index)}
                  className="absolute top-3 left-3 text-rose-400 hover:text-rose-300"
                  title="حذف مسافر"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <h3 className="text-sm font-semibold text-amber-400 mb-3">
                مسافر {index + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
                    نام
                  </label>
                  <input
                    required
                    value={passenger.first_name}
                    onChange={(e) =>
                      handlePassengerChange(index, "first_name", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
                    نام خانوادگی
                  </label>
                  <input
                    required
                    value={passenger.last_name}
                    onChange={(e) =>
                      handlePassengerChange(index, "last_name", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
                    <CreditCard className="h-3.5 w-3.5" /> کد ملی
                  </label>
                  <input
                    required
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
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
                    <Calendar className="h-3.5 w-3.5" /> تاریخ تولد
                  </label>
                  <DatePicker
                    placeholder="تاریخ تولد را انتخاب کنید"
                    value={
                      passenger.birth_date
                        ? new DateObject({
                            date: passenger.birth_date,
                            format: "YYYY-MM-DD",
                            calendar: gregorian,
                            locale: gregorian_en,
                          }).convert(persian, persian_fa)
                        : null
                    }
                    onChange={(date) => handlePassengerBirthDate(index, date)}
                    calendar={persian}
                    locale={persian_fa}
                    format="YYYY/MM/DD"
                    required
                    portal
                    containerClassName="w-full"
                    inputClass={`${inputClass} font-mono`}
                  />
                </div>
              </div>
            </div>
          ))}
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

      {/* بخش ۳: تنظیمات رزرو */}
      <Card className="relative z-10">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-amber-50">
          <ListFilter className="h-5 w-5 text-amber-400" /> تنظیمات رزرو
        </h2>

        {/* ردیف اول: کوپه و تعداد مسافران */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <BedDouble className="h-3.5 w-3.5" /> نوع کوپه
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
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <UserCheck className="h-3.5 w-3.5" /> تعداد بزرگسال
            </label>
            <input
              type="number"
              name="adult_number"
              value={formData.adult_number}
              onChange={handleChange}
              min="0"
              className={`${inputClass} font-mono`}
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Baby className="h-3.5 w-3.5" /> تعداد خردسال
            </label>
            <input
              type="number"
              name="baby_number"
              value={formData.baby_number}
              onChange={handleChange}
              min="0"
              className={`${inputClass} font-mono`}
              dir="ltr"
            />
          </div>
        </div>

        {/* ردیف دوم: قیمت و شماره قطار */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 border-t border-amber-500/10 pt-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <DollarSign className="h-3.5 w-3.5" /> حداقل قیمت (هزار تومان)
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="from_price"
              value={formatTomanFa(formData.from_price)}
              onChange={(e) => {
                const digits = toEnglishDigits(e.target.value).replace(
                  /\D/g,
                  "",
                );
                setFormData({ ...formData, from_price: digits });
              }}
              placeholder="مثلاً ۱٬۵۰۰٬۰۰۰"
              className={`${inputClass} font-mono`}
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <DollarSign className="h-3.5 w-3.5" /> حداکثر قیمت (هزار تومان)
            </label>
            <input
              type="text"
              inputMode="numeric"
              name="to_price"
              value={formatTomanFa(formData.to_price)}
              onChange={(e) => {
                const digits = toEnglishDigits(e.target.value).replace(
                  /\D/g,
                  "",
                );
                setFormData({ ...formData, to_price: digits });
              }}
              placeholder="مثلاً ۲٬۵۰۰٬۰۰۰"
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
              placeholder="مثلاً 196, 368, 412"
              className={`${inputClass} font-mono`}
              dir="ltr"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs text-amber-100/60">
              <Phone className="h-3.5 w-3.5" /> شماره موبایل رزرو
            </label>
            <input
              required
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="09121234567"
              className={`${inputClass} font-mono`}
              dir="ltr"
            />
          </div>
        </div>

        {/* کوپه دربست */}
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
            <CheckSquare className="h-4 w-4 text-amber-400" /> درخواست کوپه
            دربست (اختصاصی)
          </label>
        </div>

        {/* فیلترهای زمانی */}
        <fieldset className="mb-5 border-t border-amber-500/10 pt-4">
          <legend className="px-1 text-sm font-semibold text-amber-400">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              زمان حرکت قطار رفت
            </span>
          </legend>

          <p className="mb-3 text-xs text-amber-100/60">
            می‌توانید چند بازه انتخاب کنید. بدون انتخاب، همهٔ ساعت‌ها مجازند.
          </p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {DEPARTURE_TIME_SLOTS.map(({ value, label }) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-amber-500/10 bg-[#0f0d0a] p-3 text-sm text-amber-50"
              >
                <input
                  type="checkbox"
                  name="departure_time_slots"
                  value={value}
                  checked={departureTimeSlots.includes(value)}
                  onChange={(e) =>
                    handleDepartureTimeSlotChange(
                      value,
                      e.currentTarget.checked,
                    )
                  }
                  className="h-4 w-4 accent-amber-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>

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
            "ثبت سفارش"
          )}
        </Button>
      </div>
    </form>
  );
}
