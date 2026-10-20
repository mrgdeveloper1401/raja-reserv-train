// app/component/orders/OrdersFilterBar.tsx
"use client";
import { Search, X } from "lucide-react";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  date: string;
  onDate: (v: string) => void;
}

export function OrdersFilterBar({ search, onSearch, date, onDate }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* جستجو */}
      <div className="relative flex-1">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500/50" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="جستجو بر اساس شماره سفارش، مسیر یا مسافر..."
          className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] py-2.5 pr-10 pl-9 text-sm text-amber-50 placeholder:text-amber-200/20 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-500/20"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearch("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50 hover:text-amber-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* تاریخ */}
      <div className="relative">
        <input
          type="date"
          value={date}
          onChange={(e) => onDate(e.target.value)}
          className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] px-4 py-2.5 text-sm text-amber-50 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-500/20 sm:w-48"
        />
      </div>
    </div>
  );
}