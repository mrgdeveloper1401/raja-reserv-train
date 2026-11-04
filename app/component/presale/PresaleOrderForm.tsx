// app/component/presale/PresaleOrderForm.tsx
"use client";
import { useState } from "react";
import { Plus, X, MapPin, Train, Users, Calendar } from "lucide-react";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { TRAIN_TYPE_LABEL, type TrainType } from "../../types/index.type";
import { mockPassengers as passengers } from "../../lib/mock-data";
import { notify } from "@/app/lib/toast";

const trainTypes: TrainType[] = ["3star", "4star", "5star", "6bunk", "saloon"];

export function PresaleOrderForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [priceLimit, setPriceLimit] = useState("");
  const [trainNumbers, setTrainNumbers] = useState<string[]>([""]);
  const [selectedTypes, setSelectedTypes] = useState<TrainType[]>([]);
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const [timeRanges, setTimeRanges] = useState<{ from: string; to: string }[]>([
    { from: "", to: "" },
  ]);

  const toggleType = (t: TrainType) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const togglePassenger = (id: string) => {
    setSelectedPassengers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const addTrainNumber = () => setTrainNumbers((p) => [...p, ""]);
  const removeTrainNumber = (i: number) =>
    setTrainNumbers((p) => p.filter((_, idx) => idx !== i));
  const updateTrainNumber = (i: number, v: string) =>
    setTrainNumbers((p) => p.map((x, idx) => (idx === i ? v : x)));

  const addTimeRange = () => setTimeRanges((p) => [...p, { from: "", to: "" }]);
  const removeTimeRange = (i: number) =>
    setTimeRanges((p) => p.filter((_, idx) => idx !== i));
  const updateTimeRange = (i: number, key: "from" | "to", v: string) =>
    setTimeRanges((p) =>
      p.map((x, idx) => (idx === i ? { ...x, [key]: v } : x)),
    );

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!from || !to) return notify.error("مبدا و مقصد الزامی است");
    if (selectedPassengers.length === 0)
      return notify.error("حداقل یک مسافر انتخاب کنید");

    notify.success("سفارش به صف اضافه شد ✅");
    // reset کردن فرم
    setFrom("");
    setTo("");
    setDate("");
    setPriceLimit("");
    setTrainNumbers([""]);
    setSelectedTypes([]);
    setSelectedPassengers([]);
    setTimeRanges([{ from: "", to: "" }]);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-center gap-2">
          <Plus className="h-4 w-4 text-amber-400" />
          <h2 className="text-base font-bold text-amber-50">
            ثبت سفارش پیش‌فروش
          </h2>
        </div>

        {/* مبدا و مقصد */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="مبدا"
            placeholder="تهران"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            icon={<MapPin className="h-4 w-4" />}
          />
          <Input
            label="مقصد"
            placeholder="مشهد"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            icon={<MapPin className="h-4 w-4" />}
          />
        </div>

        {/* تاریخ و سقف قیمت */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="تاریخ حرکت"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            icon={<Calendar className="h-4 w-4" />}
          />
          <Input
            label="سقف قیمت (تومان)"
            type="number"
            placeholder="1500000"
            value={priceLimit}
            onChange={(e) => setPriceLimit(e.target.value)}
          />
        </div>

        {/* شماره قطارها */}
        <div>
          <label className="mb-2 block text-sm font-medium text-amber-100/80">
            شماره قطارهای مجاز
          </label>
          <div className="space-y-2">
            {trainNumbers.map((num, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder="مثلاً 961"
                  value={num}
                  onChange={(e) => updateTrainNumber(i, e.target.value)}
                  icon={<Train className="h-4 w-4" />}
                />
                {trainNumbers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTrainNumber(i)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 text-rose-400/70 transition hover:bg-rose-500/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTrainNumber}
            className="mt-2 text-xs text-amber-400 hover:text-amber-300"
          >
            + افزودن شماره قطار
          </button>
        </div>

        {/* نوع قطار */}
        <div>
          <label className="mb-2 block text-sm font-medium text-amber-100/80">
            نوع قطار
          </label>
          <div className="flex flex-wrap gap-2">
            {trainTypes.map((t) => {
              const active = selectedTypes.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleType(t)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "border-amber-400/60 bg-amber-500/15 text-amber-100"
                      : "border-amber-500/20 text-amber-100/50 hover:border-amber-400/40 hover:text-amber-100"
                  }`}
                >
                  {TRAIN_TYPE_LABEL[t]}
                </button>
              );
            })}
          </div>
        </div>

        {/* بازه‌ی زمانی */}
        <div>
          <label className="mb-2 block text-sm font-medium text-amber-100/80">
            بازه‌های ساعت حرکت
          </label>
          <div className="space-y-2">
            {timeRanges.map((range, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={24}
                    placeholder="از 18"
                    value={range.from}
                    onChange={(e) => updateTimeRange(i, "from", e.target.value)}
                  />
                  <Input
                    type="number"
                    min={0}
                    max={24}
                    placeholder="تا 21"
                    value={range.to}
                    onChange={(e) => updateTimeRange(i, "to", e.target.value)}
                  />
                </div>
                {timeRanges.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTimeRange(i)}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 text-rose-400/70 transition hover:bg-rose-500/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTimeRange}
            className="mt-2 text-xs text-amber-400 hover:text-amber-300"
          >
            + افزودن بازه‌ی زمانی
          </button>
        </div>

        {/* انتخاب مسافران */}
        <div>
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-100/80">
            <Users className="h-4 w-4" />
            انتخاب مسافران
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {passengers.map((p) => {
              const active = selectedPassengers.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePassenger(p.id)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-right transition ${
                    active
                      ? "border-amber-400/60 bg-amber-500/10"
                      : "border-amber-500/15 bg-[#0f0d0a]/60 hover:border-amber-400/40"
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-amber-50">
                      {p.firstName} {p.lastName}
                    </p>
                    <p
                      className="mt-0.5 text-[11px] text-amber-100/40"
                      dir="ltr"
                    >
                      {p.nationalId}
                    </p>
                  </div>
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                      active
                        ? "border-amber-400 bg-amber-400"
                        : "border-amber-500/30"
                    }`}
                  >
                    {active && (
                      <span className="h-2 w-2 rounded-full bg-[#0f0d0a]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-amber-500/10 pt-4">
          <Button type="submit" size="md">
            <Plus className="h-4 w-4" />
            افزودن به صف
          </Button>
        </div>
      </form>
    </Card>
  );
}
