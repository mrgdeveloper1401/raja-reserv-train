// app/dashboard/passenger/page.tsx
"use client";
import { useState } from "react";
import { Plus, User, Pencil, Trash2, Phone, CreditCard, Calendar, X } from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import { Input } from "../../component/ui/Input";
import { mockPassengers } from "../../lib/mock-data";
import type { Passenger, Gender } from "../../types/index.type";
import { toast } from "sonner";
import { notify } from "@/app/lib/toast";

export default function PassengersPage() {
  const [passengers, setPassengers] = useState<Passenger[]>(mockPassengers);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Passenger | null>(null);

// جایگزین confirm و alert
const handleDelete = (id: string) => {
  toast.custom((t) => (
    <div className="w-full rounded-xl border border-rose-500/30 bg-[#161210] p-4 text-amber-50 shadow-2xl">
      <p className="text-sm font-medium">حذف مسافر</p>
      <p className="mt-1 text-xs text-amber-100/50">
        این عملیات قابل بازگشت نیست. مطمئنی؟
      </p>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => {
            setPassengers((p) => p.filter((x) => x.id !== id));
            notify.success("مسافر حذف شد");
            toast.dismiss(t);
          }}
          className="flex-1 rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
        >
          حذف کن
        </button>
        <button
          onClick={() => toast.dismiss(t)}
          className="flex-1 rounded-lg border border-amber-500/20 px-3 py-1.5 text-xs text-amber-100/70 hover:bg-amber-500/10"
        >
          انصراف
        </button>
      </div>
    </div>
  ));
};

  const handleSubmit = (data: Omit<Passenger, "id" | "userId">) => {
    if (editing) {
      setPassengers((p) => p.map((x) => (x.id === editing.id ? { ...x, ...data } : x)));
    } else {
      const newP: Passenger = {
        id: `p${Date.now()}`,
        userId: "u1",
        ...data,
      };
      setPassengers((p) => [...p, newP]);
    }
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-amber-50">مسافران من</h1>
          <p className="mt-1 text-sm text-amber-100/40">
            یکبار ثبت کن، برای تمام سفارشات بعدی استفاده کن
          </p>
        </div>
        <Button onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          مسافر جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {passengers.map((p) => (
          <Card key={p.id} className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  p.gender === "male" ? "bg-blue-500/10 text-blue-400" : "bg-pink-500/10 text-pink-400"
                }`}>
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-50">{p.firstName} {p.lastName}</p>
                  <p className="text-[11px] text-amber-100/40">{p.gender === "male" ? "آقا" : "خانم"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditing(p); setShowForm(true); }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-400/60 hover:bg-amber-500/10 hover:text-amber-400"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-400/60 hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <InfoRow icon={CreditCard} label="کد ملی" value={p.nationalId} />
              <InfoRow icon={Phone} label="تماس" value={p.phone} />
              <InfoRow icon={Calendar} label="تاریخ تولد" value={p.birthDate} />
            </div>
          </Card>
        ))}

        {passengers.length === 0 && (
          <Card className="col-span-full py-12 text-center text-amber-100/30">
            <User className="mx-auto mb-2 h-10 w-10 text-amber-500/20" />
            هنوز مسافری ثبت نکردی
          </Card>
        )}
      </div>

      {showForm && (
        <Modal
          title={editing ? "ویرایش مسافر" : "افزودن مسافر"}
          onClose={() => { setShowForm(false); setEditing(null); }}
        >
          <PassengerForm initial={editing} onSubmit={handleSubmit} />
        </Modal>
      )}
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-amber-500/5 pb-1.5">
      <span className="flex items-center gap-1.5 text-amber-100/40">
        <Icon className="h-3 w-3" />
        {label}
      </span>
      <span className="font-mono text-amber-100/70" dir="ltr">{value}</span>
    </div>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/20 bg-[#161210] shadow-2xl">
        <div className="flex items-center justify-between border-b border-amber-500/10 p-5">
          <h3 className="font-bold text-amber-50">{title}</h3>
          <button onClick={onClose} className="text-amber-100/40 hover:text-amber-300">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function PassengerForm({
  initial,
  onSubmit,
}: {
  initial: Passenger | null;
  onSubmit: (data: Omit<Passenger, "id" | "userId">) => void;
}) {
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [nationalId, setNationalId] = useState(initial?.nationalId ?? "");
  const [gender, setGender] = useState<Gender>(initial?.gender ?? "male");
  const [birthDate, setBirthDate] = useState(initial?.birthDate ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!firstName) e.firstName = "نام الزامی است";
    if (!lastName) e.lastName = "نام خانوادگی الزامی است";
    if (!/^\d{10}$/.test(nationalId)) e.nationalId = "کد ملی باید ۱۰ رقم باشد";
    if (!/^09\d{9}$/.test(phone)) e.phone = "شماره تماس معتبر نیست";
    if (!birthDate) e.birthDate = "تاریخ تولد الزامی است";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({ firstName, lastName, nationalId, gender, birthDate, phone });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Input label="نام" value={firstName} onChange={(e) => setFirstName(e.target.value)} error={errors.firstName} />
        <Input label="نام خانوادگی" value={lastName} onChange={(e) => setLastName(e.target.value)} error={errors.lastName} />
      </div>
      <Input label="کد ملی" value={nationalId} onChange={(e) => setNationalId(e.target.value)} error={errors.nationalId} dir="ltr" />
      <div>
        <label className="mb-2 block text-sm font-medium text-amber-100/80">جنسیت</label>
        <div className="flex gap-2">
          {(["male", "female"] as Gender[]).map((g) => (
            <button key={g} type="button" onClick={() => setGender(g)}
              className={`flex-1 rounded-xl border p-2.5 text-sm transition ${
                gender === g ? "border-amber-400/60 bg-amber-500/15 text-amber-100" : "border-amber-500/20 text-amber-100/50"
              }`}>
              {g === "male" ? "آقا" : "خانم"}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="تاریخ تولد" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} error={errors.birthDate} dir="ltr" />
        <Input label="شماره تماس" value={phone} onChange={(e) => setPhone(e.target.value)} error={errors.phone} dir="ltr" />
      </div>
      <div className="flex justify-end gap-2 pt-3">
        <Button type="submit" size="md">
          {initial ? "ذخیره" : "افزودن"}
        </Button>
      </div>
    </form>
  );
}