// app/component/orders/PassengerPicker.tsx
"use client";

import { useState } from "react";
import { Loader2, Search, UserPlus } from "lucide-react";

import type { PassengerListItem } from "../../types/index.type";
import {
  getOrderPassengerDetail,
  searchOrderPassengers,
} from "@/app/admin/create_order/actions";

export interface SelectedPassenger {
  id: number;
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string | null;
}

interface Props {
  onSelect: (passenger: SelectedPassenger) => void;
  disabled?: boolean;
}

export function PassengerPicker({ onSelect, disabled = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  const [items, setItems] = useState<PassengerListItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [selectingId, setSelectingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const busy = disabled || isLoading || selectingId !== null;

  const loadPassengers = async (query: string, requestedPage: number) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await searchOrderPassengers(query, requestedPage);

      setItems(data.items);
      setPage(requestedPage);
      setAppliedSearch(query);

      setTotalPages(Math.max(1, Math.ceil(data.total / data.page_size)));
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "دریافت مشتریان ناموفق بود.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      void loadPassengers(search, 1);
    }

    setIsOpen((previous) => !previous);
  };

  const handleSelect = async (id: number) => {
    setSelectingId(id);
    setError("");

    try {
      const passenger = await getOrderPassengerDetail(id);
      onSelect(passenger);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "دریافت اطلاعات مشتری ناموفق بود.",
      );
    } finally {
      setSelectingId(null);
    }
  };

  return (
    <div className="mb-5 rounded-xl border border-amber-500/20">
      <button
        type="button"
        onClick={handleToggle}
        disabled={busy}
        aria-expanded={isOpen}
        className="flex w-full items-center gap-2 p-4 text-sm text-amber-300 disabled:opacity-50"
      >
        <UserPlus className="h-4 w-4" />
        {isOpen ? "بستن لیست مشتریان" : "انتخاب از مشتریان قبلی"}
      </button>

      {isOpen && (
        <div className="space-y-3 border-t border-amber-500/10 p-4">
          {/* این بخش داخل فرم ثبت سفارش است؛ فرم تو در تو نساز. */}
          <div className="flex gap-2">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();

                  if (!busy) {
                    void loadPassengers(search, 1);
                  }
                }
              }}
              placeholder="جستجوی مشتری..."
              className="min-w-0 flex-1 rounded-lg border border-amber-500/20 bg-[#0f0d0a] p-2.5 text-sm text-amber-50 outline-none"
            />

            <button
              type="button"
              onClick={() => void loadPassengers(search, 1)}
              disabled={busy}
              aria-label="جستجوی مشتری"
              className="rounded-lg bg-amber-500/15 px-4 text-amber-300 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </div>

          {error && (
            <p role="alert" className="text-sm text-rose-300">
              {error}
            </p>
          )}

          <div className="max-h-72 space-y-2 overflow-y-auto">
            {items.map((passenger) => (
              <div
                key={passenger.id}
                className="flex items-center justify-between gap-3 rounded-lg bg-[#0f0d0a] p-3"
              >
                <span className="text-sm text-amber-50">
                  {passenger.full_name}
                </span>

                <button
                  type="button"
                  onClick={() => void handleSelect(passenger.id)}
                  disabled={busy}
                  className="flex items-center gap-1 rounded-lg bg-amber-500/15 px-3 py-2 text-xs text-amber-300 disabled:opacity-50"
                >
                  {selectingId === passenger.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  افزودن
                </button>
              </div>
            ))}

            {!isLoading && items.length === 0 && !error && (
              <p className="py-5 text-center text-sm text-amber-100/40">
                مشتری‌ای پیدا نشد.
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-amber-100/60">
              <button
                type="button"
                disabled={busy || page <= 1}
                onClick={() => void loadPassengers(appliedSearch, page - 1)}
                className="rounded-lg border border-amber-500/20 px-3 py-2 disabled:opacity-30"
              >
                قبلی
              </button>

              <span>
                صفحه {page} از {totalPages}
              </span>

              <button
                type="button"
                disabled={busy || page >= totalPages}
                onClick={() => void loadPassengers(appliedSearch, page + 1)}
                className="rounded-lg border border-amber-500/20 px-3 py-2 disabled:opacity-30"
              >
                بعدی
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
