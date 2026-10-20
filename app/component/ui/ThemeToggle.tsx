// app/component/ui/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl border border-amber-500/20" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="تغییر تم"
      className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/20 text-amber-400/80 transition hover:border-amber-400/60 hover:bg-amber-500/10"
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition group-hover:rotate-90" />
      ) : (
        <Moon className="h-4 w-4 transition group-hover:-rotate-12" />
      )}
    </button>
  );
}