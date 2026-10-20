// app/component/ui/Badge.tsx
// برچسب وضعیت (موفق/ناموفق/در حال پردازش)
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}