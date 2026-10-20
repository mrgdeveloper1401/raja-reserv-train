// app/component/ui/Card.tsx
// کارت پایه
import { type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}

export function Card({ children, className = "", padded = true }: Props) {
  return (
    <div
      className={`rounded-2xl border border-amber-500/15 bg-[#161210]/70 backdrop-blur-sm ${
        padded ? "p-6" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}