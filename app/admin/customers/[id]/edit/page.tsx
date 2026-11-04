// app/admin/customers/[id]/edit/page.tsx
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getPassengerDetail } from "../../../../lib/api";
import { EditCustomerForm } from "../../../../component/customers/EditCustomerForm";

export default async function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  let passenger;
  try {
    passenger = await getPassengerDetail(token, id);
  } catch (error) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-amber-50">ویرایش مشتری</h1>
        <p className="mt-1 text-sm text-amber-100/40">
          اطلاعات مسافر را ویرایش کنید.
        </p>
      </div>
      <EditCustomerForm token={token} initialData={passenger} />
    </div>
  );
}
