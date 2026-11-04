// app/component/orders/OrdersTabs.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentTab: string;
  counts: { all: number };
}

export function OrdersTabs({ currentTab, counts }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTab = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    params.set("page", "1"); // برگشت به صفحه اول
    router.push(`?${params.toString()}`);
  };

  const tabs = [
    { key: "all", label: `همه (${counts.all})` },
    { key: "active", label: "فعال" },
    { key: "success", label: "موفق" },
    { key: "failed", label: "ناموفق" },
  ];

  return (
    <div className="flex gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => handleTab(t.key)}
          className={`px-4 py-2 text-sm rounded-lg ${
            currentTab === t.key
              ? "bg-amber-500/20 text-amber-300"
              : "text-amber-100/60 hover:bg-amber-500/10"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
