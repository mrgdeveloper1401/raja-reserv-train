// app/admin/customers/page.tsx
import { CustomersTable } from "../../component/customers/CustomersTable";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-amber-50">مشتریان</h1>
        <p className="mt-1 text-sm text-amber-100/40">مدیریت و مشاهده‌ی سوابق مشتریان</p>
      </div>
      <CustomersTable />
    </div>
  );
}