// app/component/orders/OrdersTabs.tsx
"use client";

export type TabKey = "all" | "active" | "success" | "failed" | "cancelled";

interface Props {
  current: TabKey;
  onChange: (key: TabKey) => void;
  counts: {
    all: number;
    active: number;
    success: number;
    failed: number;
    cancelled: number;
  };
}

const tabs: { key: TabKey; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "active", label: "فعال" },
  { key: "success", label: "موفق" },
  { key: "failed", label: "ناموفق" },
  { key: "cancelled", label: "لغو شده" },
];

export function OrdersTabs({ current, onChange, counts }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-amber-500/15 bg-[#161210]/60 p-1.5">
      {tabs.map((t) => {
        const active = current === t.key;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
              active
                ? "bg-amber-500/20 text-amber-100 border border-amber-500/30"
                : "text-amber-100/50 border border-transparent hover:bg-amber-500/5 hover:text-amber-100"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                active
                  ? "bg-amber-500/30 text-amber-100"
                  : "bg-amber-500/10 text-amber-100/40"
              }`}
            >
              {counts[t.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
}