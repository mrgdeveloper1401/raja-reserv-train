// admin/logs/page.tsx
"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import { Card } from "../../component/ui/Card";

const mockLogs = [
  { id: 1, time: "10:05:01", level: "info", source: "worker#1", text: "Worker #1 شروع به کار کرد" },
  { id: 2, time: "10:05:05", level: "success", source: "worker#1", text: "ورود موفق به سامانه رزرو" },
  { id: 3, time: "10:05:18", level: "warning", source: "worker#1", text: "کپچا دور زده شد" },
  { id: 4, time: "10:06:12", level: "error", source: "server#3", text: "سرور ۳ به دلیل بار بالا پاسخ نداد" },
  { id: 5, time: "10:06:15", level: "info", source: "loadbalancer", text: "انتقال ۵ سفارش از سرور ۳ به سرور ۱" },
  { id: 6, time: "10:07:22", level: "success", source: "worker#2", text: "رزرو شماره 2154 با موفقیت ثبت شد" },
];

const levelColors: Record<string, string> = {
  info: "text-blue-300 bg-blue-500/10 border-blue-500/30",
  success: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  warning: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  error: "text-rose-300 bg-rose-500/10 border-rose-500/30",
};

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");

  const filtered = mockLogs.filter((l) => {
    if (filter !== "all" && l.level !== filter) return false;
    if (search && !l.text.includes(search) && !l.source.includes(search)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-amber-50">لاگ‌های سیستم</h1>
        <p className="mt-1 text-sm text-amber-100/40">مشاهده و جستجوی تمام رخدادهای سیستم</p>
      </div>

      <Card padded={false} className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-amber-500/10 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو..."
              className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] py-2.5 pr-10 pl-4 text-sm text-amber-50 placeholder:text-amber-200/20 outline-none focus:border-amber-400/60"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {["all", "info", "success", "warning", "error"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                  filter === f
                    ? "border-amber-400/60 bg-amber-500/15 text-amber-100"
                    : "border-amber-500/20 text-amber-100/50 hover:border-amber-400/40"
                }`}
              >
                {f === "all" ? "همه" : f === "info" ? "اطلاع" : f === "success" ? "موفق" : f === "warning" ? "هشدار" : "خطا"}
              </button>
            ))}
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto bg-[#0a0908] p-4 font-mono text-xs">
          {filtered.map((log) => (
            <div key={log.id} className="flex gap-3 border-b border-amber-500/5 py-2">
              <span className="text-amber-100/30" dir="ltr">{log.time}</span>
              <span className={`w-20 rounded border px-1.5 text-center text-[10px] uppercase ${levelColors[log.level]}`} dir="ltr">
                {log.level}
              </span>
              <span className="w-28 text-amber-400/70" dir="ltr">{log.source}</span>
              <span className="flex-1 text-amber-100/70">{log.text}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-amber-100/30">لاگی با این فیلترها پیدا نشد</div>
          )}
        </div>
      </Card>
    </div>
  );
}