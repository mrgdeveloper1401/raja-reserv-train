// app/admin/orders/not-found.tsx
import Link from "next/link";
import { ArrowRight, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FileQuestion className="h-16 w-16 text-amber-500/30" />
      <h2 className="mt-4 text-xl font-bold text-amber-50">سفارش پیدا نشد</h2>
      <p className="mt-2 text-sm text-amber-100/40">
        احتمالاً شناسه اشتباه است یا سفارش حذف شده.
      </p>
      <Link
        href="/admin/orders"
        className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-[#0f0d0a]"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به لیست
      </Link>
    </div>
  );
}