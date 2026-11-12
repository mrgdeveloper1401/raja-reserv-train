// app/admin/restitution/page.tsx
import { cookies } from "next/headers";
import { RestitutionsResponse } from "@/app/types/index.type";
import { baseUrl } from "@/app/utils/config";
import { RestitutionClient } from "@/app/component/restitution/RestitutionClient";

export default async function RestitutionPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    return (
      <div className="flex h-96 items-center justify-center text-amber-100/60">
        لطفا ابتدا وارد حساب کاربری خود شوید.
      </div>
    );
  }

  let initialData: RestitutionsResponse = { items: [], total: 0 };

  try {
    const res = await fetch(
      `${baseUrl}/admin/restitution?page=1&page_size=20`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store", // همیشه دیتای تازه
      },
    );

    if (res.ok) {
      const data = await res.json();
      initialData = {
        items: data.items || data.results || [],
        total: data.total || data.count || 0,
      };
    }
  } catch (error) {
    console.error("Failed to fetch restitutions:", error);
  }

  return <RestitutionClient initialData={initialData} token={token} />;
}
