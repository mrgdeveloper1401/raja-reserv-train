// app/lib/toast.ts
// lib/toast.ts
import { toast } from "sonner";

export const notify = {
  success: (message: string) =>
    toast.success(message, {
      style: {
        background: "#0f0d0a",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        color: "#a7f3d0",
      },
    }),

  error: (message: string) =>
    toast.error(message, {
      style: {
        background: "#0f0d0a",
        border: "1px solid rgba(244, 63, 94, 0.3)",
        color: "#fecdd3",
      },
    }),

  info: (message: string) =>
    toast(message, {
      style: {
        background: "#0f0d0a",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        color: "#bfdbfe",
      },
    }),

  warning: (message: string) =>
    toast.warning(message, {
      style: {
        background: "#0f0d0a",
        border: "1px solid rgba(245, 158, 11, 0.3)",
        color: "#fde68a",
      },
    }),

  loading: (message: string) => toast.loading(message),

  promise: <T,>(
    promise: Promise<T>,
    msgs: { loading: string; success: string; error: string }
  ) => toast.promise(promise, msgs),

  dismiss: (id?: string | number) => toast.dismiss(id),
};