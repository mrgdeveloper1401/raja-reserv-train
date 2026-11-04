// app/admin/raja_account/page.tsx
import { cookies } from "next/headers";
import { getRajaAccounts } from "../../lib/api";
import { RajaAccountsTable } from "@/app/component/raja/RajaAccountsTable";

export default async function RajaAccountsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) return null;

  const currentSearch = params.search || "";
  const currentPage = parseInt(params.page || "1", 10);
  const data = await getRajaAccounts(token, currentSearch, currentPage);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-amber-50">حساب‌های رجا</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          مدیریت اکانت‌های ورود ربات‌ها
        </p>
      </div>
      <RajaAccountsTable
        data={data}
        token={token}
        currentSearch={currentSearch}
      />
    </div>
  );
}
