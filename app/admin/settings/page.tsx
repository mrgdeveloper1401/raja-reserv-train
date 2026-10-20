// app/admin/settings/page.tsx
"use client";
import { useState } from "react";
import { Save, Server, Clock, Shield, Bell } from "lucide-react";
import { Card } from "../../component/ui/Card";
import { Button } from "../../component/ui/Button";
import { Input } from "../../component/ui/Input";
import { notify } from "@/app/lib/toast";

export default function SettingsPage() {
  const [monitorInterval, setMonitorInterval] = useState("5");
  const [retryCount, setRetryCount] = useState("3");
  const [maxConcurrent, setMaxConcurrent] = useState("5");
  const [notifyError, setNotifyError] = useState(true);
  const [notifySuccess, setNotifySuccess] = useState(true);

  const handleSave = () => {
    notify.promise(new Promise((r) => setTimeout(r, 800)), {
      loading: "در حال ذخیره‌ی تغییرات...",
      success: "تنظیمات با موفقیت ذخیره شد",
      error: "خطا در ذخیره‌سازی",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-amber-50">تنظیمات</h1>
          <p className="mt-1 text-sm text-amber-100/40">
            پیکربندی سیستم و رفتار مانیتورینگ
          </p>
        </div>
        <Button>
          <Save className="h-4 w-4" />
          ذخیره‌ی تغییرات
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* زمان‌بندی پایش */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-amber-50">
              زمان‌بندی پایش
            </h2>
          </div>
          <div className="space-y-4">
            <Input
              label="فاصله‌ی پایش (ثانیه)"
              type="number"
              value={monitorInterval}
              onChange={(e) => setMonitorInterval(e.target.value)}
            />
            <Input
              label="تعداد تلاش مجدد"
              type="number"
              value={retryCount}
              onChange={(e) => setRetryCount(e.target.value)}
            />
            <Input
              label="حداکثر سفارش همزمان روی هر سرور"
              type="number"
              value={maxConcurrent}
              onChange={(e) => setMaxConcurrent(e.target.value)}
            />
          </div>
        </Card>

        {/* سرور */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Server className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-amber-50">سرورها</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-lg border border-amber-500/15 bg-[#0f0d0a]/60 p-3">
              <span className="text-amber-100/60">تعداد سرورها</span>
              <span className="font-mono text-amber-100/90">۶</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-amber-500/15 bg-[#0f0d0a]/60 p-3">
              <span className="text-amber-100/60">ظرفیت کل</span>
              <span className="font-mono text-amber-100/90">۳۰ سفارش</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-amber-500/15 bg-[#0f0d0a]/60 p-3">
              <span className="text-amber-100/60">Load Balancer</span>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                فعال
              </span>
            </div>
          </div>
        </Card>

        {/* امنیت */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-amber-50">امنیت و کپچا</h2>
          </div>
          <div className="space-y-3">
            <Toggle label="دور زدن خودکار کپچا" defaultOn />
            <Toggle label="پراکسی چرخشی" defaultOn />
            <Toggle label="ذخیره‌ی لاگ‌های حساس" />
          </div>
        </Card>

        {/* اعلان */}
        <Card>
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-amber-50">اعلان‌ها</h2>
          </div>
          <div className="space-y-3">
            <Toggle
              label="اعلان سفارشات ناموفق"
              defaultOn={notifyError}
              onChange={setNotifyError}
            />
            <Toggle
              label="اعلان سفارشات موفق"
              defaultOn={notifySuccess}
              onChange={setNotifySuccess}
            />
            <Toggle label="اعلان قطع سرور" defaultOn />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Toggle({
  label,
  defaultOn = false,
  onChange,
}: {
  label: string;
  defaultOn?: boolean;
  onChange?: (v: boolean) => void;
}) {
  const [on, setOn] = useState(defaultOn);
  const toggle = () => {
    setOn(!on);
    onChange?.(!on);
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className="flex w-full items-center justify-between rounded-lg border border-amber-500/15 bg-[#0f0d0a]/60 p-3 text-sm"
    >
      <span className="text-amber-100/70">{label}</span>
      <span
        className={`relative h-6 w-11 rounded-full border transition ${
          on
            ? "border-amber-400/50 bg-amber-500/30"
            : "border-amber-500/20 bg-[#0f0d0a]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full transition-all ${
            on
              ? "right-0.5 bg-gradient-to-br from-amber-400 to-orange-500"
              : "right-[22px] bg-amber-500/20"
          }`}
        />
      </span>
    </button>
  );
}
