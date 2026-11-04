// app/admin/create_order/page.tsx
import { cookies } from "next/headers";
import { CreateOrderForm } from "../../component/orders/CreateOrderForm";
import { getRajaAccountOptions } from "../../lib/api";

export default async function CreateOrderPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  const rajaAccounts = await getRajaAccountOptions(token);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-amber-50">ثبت سفارش جدید</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          اطلاعات مسافر و سفر را وارد کنید تا یک رزرو در وضعیت انتظار ایجاد شود.
        </p>
      </div>
      <CreateOrderForm token={token} rajaAccounts={rajaAccounts} />
    </div>
  );
}
