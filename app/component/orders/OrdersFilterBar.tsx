// app/component/orders/OrdersFilterBar.tsx
"use client";
import { useState, useTransition } from "react"; // useTransition را اضافه کنید
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Calendar, RefreshCw } from "lucide-react"; // آیکون RefreshCw را اضافه کنید

interface Props {
  currentSearch: string;
  currentDate: string;
}

export function OrdersFilterBar({ currentSearch, currentDate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [date, setDate] = useState(currentDate);

  // ✅ برای نمایش وضعیت لودینگ هنگام رفرش
  const [isPending, startTransition] = useTransition();

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    if (date) params.set("date", date);
    else params.delete("date");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  // ✅ تابع مربوط به دکمه رفرش
  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="flex gap-3 items-center">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-100/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          placeholder="جستجو شماره تلفن"
          className="w-full rounded-lg border border-amber-500/20 bg-black/20 py-2 pr-10 pl-3 text-sm text-amber-50 outline-none focus:border-amber-500/50"
        />
      </div>
      <div className="relative">
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-100/40" />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-amber-500/20 bg-black/20 py-2 pr-10 pl-3 text-sm text-amber-50 outline-none focus:border-amber-500/50"
        />
      </div>
      <button
        onClick={applyFilters}
        className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:bg-amber-400"
      >
        اعمال فیلتر
      </button>

      {/* ✅ دکمه رفرش */}
      <button
        onClick={handleRefresh}
        disabled={isPending}
        className="flex items-center gap-2 rounded-lg border border-amber-500/20 px-3 py-2 text-sm text-amber-50 hover:bg-amber-500/10 disabled:opacity-50 transition"
        title="بروزرسانی لیست"
      >
        <RefreshCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "در حال..." : "بروزرسانی"}
      </button>
    </div>
  );
}
