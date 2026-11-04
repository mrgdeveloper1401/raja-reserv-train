// app/dashboard/orders/new/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, Train, Users, Wallet, Clock, Plus, X } from "lucide-react";
import { Card } from "../../../component/ui/Card";
import { Input } from "../../../component/ui/Input";
import { Button } from "../../../component/ui/Button";
import { mockPassengers } from "../../../lib/mock-data";
import { TRAIN_TYPE_LABEL, type TrainType } from "../../../types/index.type";
import { notify } from "@/app/lib/toast";

const trainTypes: TrainType[] = ["3star", "4star", "5star", "6bunk", "saloon"];

export default function NewOrderPage() {
  const router = useRouter();
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

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    // اعتبارسنجی ساده
    if (!from || !to || !date) {
      notify.error("لطفاً مبدا، مقصد و تاریخ را وارد کنید");
      return;
    }
    if (selectedPassengers.length === 0) {
      notify.error("حداقل یک مسافر انتخاب کنید");
      return;
    }

    const promise = new Promise((resolve) => setTimeout(resolve, 1000));
    notify.promise(promise, {
      loading: "در حال ثبت سفارش...",
      success: "سفارش با موفقیت ثبت شد ✅",
      error: "خطا در ثبت سفارش",
    });
    promise.then(() => router.push("/dashboard"));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-black text-amber-50">ثبت سفارش جدید</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          اطلاعات سفر را وارد کنید تا سیستم به دنبال ظرفیت بگردد
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-amber-50">
            <MapPin className="h-4 w-4 text-amber-400" />
            مسیر سفر
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="مبدا" placeholder="تهران" value={from} onChange={(e) => setFrom(e.target.value)} />
            <Input label="مقصد" placeholder="مشهد" value={to} onChange={(e) => setTo(e.target.value)} />
            <Input label="تاریخ حرکت" type="date" value={date} onChange={(e) => setDate(e.target.value)} icon={<Calendar className="h-4 w-4" />} />
            <Input label="سقف قیمت (تومان)" type="number" placeholder="1500000" value={priceLimit} onChange={(e) => setPriceLimit(e.target.value)} icon={<Wallet className="h-4 w-4" />} />
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-amber-50">
            <Train className="h-4 w-4 text-amber-400" />
            شماره قطارها
          </h2>
          <div className="space-y-2">
            {trainNumbers.map((num, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  placeholder="مثلاً 961"
                  value={num}
                  onChange={(e) => setTrainNumbers((p) => p.map((x, idx) => idx === i ? e.target.value : x))}
                />
                {trainNumbers.length > 1 && (
                  <button type="button" onClick={() => setTrainNumbers((p) => p.filter((_, idx) => idx !== i))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 text-rose-400/70 hover:bg-rose-500/10">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setTrainNumbers((p) => [...p, ""])}
            className="mt-2 text-xs text-amber-400 hover:text-amber-300">
            + افزودن شماره
          </button>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-amber-50">
            <Clock className="h-4 w-4 text-amber-400" />
            بازه‌های زمانی
          </h2>
          <div className="space-y-2">
            {timeRanges.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <Input type="number" placeholder="از 18" value={r.from}
                    onChange={(e) => setTimeRanges((p) => p.map((x, idx) => idx === i ? { ...x, from: e.target.value } : x))} />
                  <Input type="number" placeholder="تا 21" value={r.to}
                    onChange={(e) => setTimeRanges((p) => p.map((x, idx) => idx === i ? { ...x, to: e.target.value } : x))} />
                </div>
                {timeRanges.length > 1 && (
                  <button type="button" onClick={() => setTimeRanges((p) => p.filter((_, idx) => idx !== i))}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-rose-500/20 text-rose-400/70 hover:bg-rose-500/10">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setTimeRanges((p) => [...p, { from: "", to: "" }])}
            className="mt-2 text-xs text-amber-400 hover:text-amber-300">
            + افزودن بازه
          </button>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-amber-50">
            <Train className="h-4 w-4 text-amber-400" />
            نوع قطار
          </h2>
          <div className="flex flex-wrap gap-2">
            {trainTypes.map((t) => {
              const active = selectedTypes.includes(t);
              return (
                <button key={t} type="button"
                  onClick={() => setSelectedTypes((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    active ? "border-amber-400/60 bg-amber-500/15 text-amber-100" : "border-amber-500/20 text-amber-100/50 hover:border-amber-400/40"
                  }`}>
                  {TRAIN_TYPE_LABEL[t]}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-amber-50">
            <Users className="h-4 w-4 text-amber-400" />
            مسافران
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {mockPassengers.map((p) => {
              const active = selectedPassengers.includes(p.id);
              return (
                <button key={p.id} type="button"
                  onClick={() => setSelectedPassengers((prev) => prev.includes(p.id) ? prev.filter((x) => x !== p.id) : [...prev, p.id])}
                  className={`flex items-center justify-between rounded-xl border p-3 text-right transition ${
                    active ? "border-amber-400/60 bg-amber-500/10" : "border-amber-500/15 bg-[#0f0d0a]/60 hover:border-amber-400/40"
                  }`}>
                  <div>
                    <p className="text-sm font-medium text-amber-50">{p.firstName} {p.lastName}</p>
                    <p className="mt-0.5 text-[11px] text-amber-100/40 font-mono" dir="ltr">{p.nationalId}</p>
                  </div>
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                    active ? "border-amber-400 bg-amber-400" : "border-amber-500/30"
                  }`}>
                    {active && <span className="h-2 w-2 rounded-full bg-[#0f0d0a]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            انصراف
          </Button>
          <Button type="submit">
            <Plus className="h-4 w-4" />
            ثبت سفارش
          </Button>
        </div>
      </form>
    </div>
  );
}