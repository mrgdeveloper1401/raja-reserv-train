// app/admin/customers/page.tsx
import { cookies } from "next/headers";
import { CustomersTable } from "../../component/customers/CustomersTable";
import { getPassengers } from "../../lib/api";
import Link from "next/link";
import { Button } from "@/app/component/ui/Button";
import { Plus } from "lucide-react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return <div className="text-amber-100/60">لطفا وارد شوید.</div>;

  const currentSearch = params.search || "";
  const currentPage = parseInt(params.page || "1", 10);

  const data = await getPassengers(token, currentSearch, currentPage);

  return (
    <div className="space-y-6">
      {/* سرصفحه با دکمه */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-amber-50">مشتریان</h1>
          <p className="mt-1 text-sm text-amber-100/40">
            مدیریت و مشاهده‌ی سوابق مشتریان
          </p>
        </div>

        <Link href="/admin/customers/create">
          <Button>
            <Plus className="h-4 w-4" />
            مشتری جدید
          </Button>
        </Link>
      </div>

      <CustomersTable
        passengers={data.items}
        total={data.total}
        page={currentPage}
        pageSize={data.page_size}
        currentSearch={currentSearch}
      />
    </div>
  );
}
