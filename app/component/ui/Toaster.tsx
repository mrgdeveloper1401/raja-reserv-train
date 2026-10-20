// app/component/ui/Toaster.tsx
"use client";
import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-center"
      dir="rtl"
      toastOptions={{
        style: {
          background: "#161210",
          border: "1px solid rgba(245, 158, 11, 0.25)",
          color: "#fef3c7",
          fontFamily: "var(--font-dana), sans-serif",
          borderRadius: "14px",
        },
        className: "shadow-2xl shadow-black/50",
      }}
      theme="dark"
      richColors
      closeButton
    />
  );
}