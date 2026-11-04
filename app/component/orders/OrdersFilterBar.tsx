// app/component/orders/OrdersFilterBar.tsx
"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Calendar } from "lucide-react";

interface Props {
  currentSearch: string;
  currentDate: string;
}

export function OrdersFilterBar({ currentSearch, currentDate }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [date, setDate] = useState(currentDate);

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    if (date) params.set("date", date);
    else params.delete("date");
    params.set("page", "1"); // برگشت به صفحه اول
    router.push(`?${params.toString()}`);
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
          placeholder="جستجو (کد، مسافر، مسیر)..."
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
    </div>
  );
}
