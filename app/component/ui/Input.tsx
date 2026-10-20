// app/component/ui/Input.tsx
// اینپوت با لیبل و آیکون
"use client";
import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, icon, error, className = "", ...rest }, ref) => (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-amber-100/80">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500/50">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full rounded-xl border bg-[#0f0d0a] py-3 text-amber-50 placeholder:text-amber-200/20 outline-none transition focus:ring-2 focus:ring-amber-500/20 ${
            error
              ? "border-rose-500/50 focus:border-rose-400"
              : "border-amber-500/20 focus:border-amber-400/60"
          } ${icon ? "pr-11 pl-4" : "px-4"} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";