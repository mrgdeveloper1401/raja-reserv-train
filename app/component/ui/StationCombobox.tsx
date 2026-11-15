// app/component/ui/StationCombobox.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

interface Station {
  Name: string;
}

interface Props {
  stations: Station[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function StationCombobox({
  stations,
  value,
  onChange,
  placeholder = "جستجوی ایستگاه...",
  required = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  // بستن منو وقتی بیرون کلیک می‌شود
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // فیلتر کردن ایستگاه‌ها بر اساس سرچ
  const filteredStations = stations.filter((station) =>
    station.Name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (stationName: string) => {
    onChange(stationName);
    setSearch("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* دکمه اصلی که مقدار انتخاب شده را نشان می‌دهد */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none focus:border-amber-500/50 flex items-center justify-between ${
          !value ? "text-amber-100/40" : ""
        }`}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* لیست بازشونده */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-amber-500/20 bg-[#1a1712] shadow-xl overflow-hidden">
          {/* باکس جستجو */}
          <div className="flex items-center gap-2 border-b border-amber-500/10 px-3 py-2 bg-[#0f0d0a]">
            <Search className="h-4 w-4 text-amber-500/50" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="نام شهر یا ایستگاه را بنویسید..."
              className="w-full bg-transparent text-sm text-amber-50 outline-none placeholder:text-amber-100/30"
            />
          </div>

          {/* لیست نتایج */}
          <ul className="max-h-60 overflow-y-auto py-1">
            {filteredStations.length > 0 ? (
              filteredStations.map((station, index) => (
                <li
                  key={`${station.Name}-${index}`}
                  onClick={() => handleSelect(station.Name)}
                  className="cursor-pointer px-3 py-2 text-sm text-amber-50 hover:bg-amber-500/10 flex items-center justify-between"
                >
                  {station.Name}
                  {value === station.Name && (
                    <Check className="h-4 w-4 text-amber-400" />
                  )}
                </li>
              ))
            ) : (
              <li className="px-3 py-4 text-center text-sm text-amber-100/40">
                ایستگاهی یافت نشد.
              </li>
            )}
          </ul>
        </div>
      )}

      {/* اینپوت مخفی برای اعتبارسنجی فرم (required) */}
      {required && (
        <input
          type="text"
          value={value}
          required
          className="sr-only"
          readOnly
        />
      )}
    </div>
  );
}
