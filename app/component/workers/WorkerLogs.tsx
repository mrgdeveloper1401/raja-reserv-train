// app/component/workers/WorkerLogs
"use client";
import { useState } from "react";
import { ScrollText, ChevronDown } from "lucide-react";
import { Card } from "../../component/ui/Card";

const mockLogs = [
  { id: 1, time: "10:05:01", level: "info", text: "Worker #1 شروع به کار کرد" },
  { id: 2, time: "10:05:03", level: "info", text: "اتصال به سرور s1 برقرار شد" },
  { id: 3, time: "10:05:05", level: "success", text: "ورود موفق به سامانه رزرو" },
  { id: 4, time: "10:05:08", level: "info", text: "جستجوی ظرفیت برای مسیر تهران ← مشهد" },
  { id: 5, time: "10:05:12", level: "success", text: "ظرفیت آزاد پیدا شد (۵ صندلی)" },
  { id: 6, time: "10:05:14", level: "info", text: "انتخاب مسافران..." },
  { id: 7, time: "10:05:16", level: "warning", text: "کپچا شناسایی شد، تلاش دور زدن" },
  { id: 8, time: "10:05:18", level: "success", text: "کپچا دور زده شد" },
  { id: 9, time: "10:05:22", level: "info", text: "ثبت نهایی رزرو" },
  { id: 10, time: "10:05:25", level: "success", text: "رزرو با موفقیت تکمیل شد" },
];

const levelColors: Record<string, string> = {
  info: "text-blue-300",
  success: "text-emerald-300",
  warning: "text-amber-300",
  error: "text-rose-300",
};

export function WorkerLogs() {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card padded={false} className="overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between border-b border-amber-500/10 p-5 transition hover:bg-amber-500/5"
      >
        <div className="flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-amber-400" />
          <h2 className="text-base font-bold text-amber-50">لاگ‌های زنده</h2>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-amber-400/60 transition ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="max-h-96 overflow-y-auto bg-[#0a0908] p-4 font-mono text-xs">
          {mockLogs.map((log) => (
            <div key={log.id} className="flex gap-3 py-1">
              <span className="text-amber-100/30" dir="ltr">
                {log.time}
              </span>
              <span
                className={`w-16 uppercase ${levelColors[log.level]}`}
                dir="ltr"
              >
                [{log.level}]
              </span>
              <span className="text-amber-100/70">{log.text}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}