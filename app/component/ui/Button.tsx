// app/component/ui/Button.tsx
//  دکمه‌ی استاندارد (primary, outline, ghost)

"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-l from-amber-400 to-orange-500 text-[#0f0d0a] shadow-md shadow-amber-500/25 hover:shadow-amber-500/40 hover:brightness-110",
  outline:
    "border border-amber-500/25 text-amber-100/80 hover:border-amber-400/60 hover:bg-amber-500/10 hover:text-amber-100",
  ghost:
    "text-amber-100/60 hover:bg-amber-500/10 hover:text-amber-100",
  danger:
    "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-6 text-sm rounded-xl",
  lg: "h-12 px-8 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", size = "md", loading, className = "", children, disabled, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  )
);
Button.displayName = "Button";