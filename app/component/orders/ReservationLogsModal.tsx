// app/component/orders/ReservationLogsModal.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { X, Terminal } from "lucide-react";
import { Button } from "../ui/Button";
import { baseUrl } from "@/app/utils/config";

interface Props {
  reservationId: number;
  token: string;
  onClose: () => void;
}

export function ReservationLogsModal({ reservationId, token, onClose }: Props) {
  const [logs, setLogs] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // EventSource از هدرهای سفارشی پشتیبانی نمی‌کند، بنابراین توکن را در Query String می‌فرستیم
    // (اگر بک‌اند شما از این روش پشتیبانی می‌کند. در غیر این صورت باید روش احراز هویت دیگری استفاده کنید)
    const url = `${baseUrl}/core/reservations/${reservationId}/logs?token=${token}`;

    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      setIsConnected(true);
      setLogs((prev) => [...prev, "--- اتصال برقرار شد ---"]);
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.log) {
          setLogs((prev) => [...prev, data.log]);
        }
      } catch (e) {
        // اگر دیتا JSON نبود، خودش را نمایش بده
        setLogs((prev) => [...prev, event.data]);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
      setLogs((prev) => [...prev, "--- اتصال قطع شد ---"]);
      eventSource.close();
    };

    // پاکسازی هنگام بسته شدن مودال
    return () => {
      eventSource.close();
    };
  }, [reservationId, token]);

  // اسکرول خودکار به پایین هنگام اضافه شدن لاگ جدید
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl rounded-xl border border-amber-500/20 bg-[#0f0d0a] shadow-2xl">
        {/* هدر */}
        <div className="flex items-center justify-between border-b border-amber-500/10 p-4">
          <div className="flex items-center gap-2 text-amber-50">
            <Terminal className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold">لاگ‌های رزرو #{reservationId}</h2>
            <span
              className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-rose-500"}`}
            />
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* بدنه لاگ‌ها */}
        <div
          ref={logContainerRef}
          className="h-[400px] overflow-y-auto bg-black p-4 font-mono text-xs text-emerald-300"
          dir="ltr"
        >
          {logs.map((log, index) => (
            <div
              key={index}
              className="whitespace-pre-wrap break-all border-b border-emerald-900/30 py-0.5"
            >
              {log}
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-amber-100/30 text-center pt-10">
              در انتظار لاگ‌ها...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
