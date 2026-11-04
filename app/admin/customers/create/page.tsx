// app/admin/customers/create/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CreateCustomerForm } from "../../../component/customers/CreateCustomerForm";

export default async function CreateCustomerPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return <div className="text-amber-100/60">لطفا وارد شوید.</div>;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-xs text-amber-100/50 hover:text-amber-300"
      >
        <ArrowRight className="h-3.5 w-3.5" />
        بازگشت به لیست مشتریان
      </Link>

      <div>
        <h1 className="text-2xl font-black text-amber-50">افزودن مشتری جدید</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          اطلاعات مسافر را وارد کنید. فیلدهای ستاره‌دار الزامی هستند.
        </p>
      </div>

      <CreateCustomerForm token={token} />
    </div>
  );
}
