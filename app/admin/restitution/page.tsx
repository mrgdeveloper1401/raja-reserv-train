// app/admin/restitution/page.tsx
import { cookies } from "next/headers";
import {
  RestitutionsResponse,
  PaginatedRajaAccounts,
} from "@/app/types/index.type";
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
  let rajaAccounts: PaginatedRajaAccounts["items"] = [];

  try {
    // فچ همزمان لیست استردادها و حساب‌های رجا
    const [restitutionRes, rajaAccountsRes] = await Promise.all([
      fetch(`${baseUrl}/admin/restitution?page=1&page_size=20`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
      fetch(`${baseUrl}/auth/raja-accounts?page=1`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }),
    ]);

    if (restitutionRes.ok) {
      const data = await restitutionRes.json();
      initialData = {
        items: data.items || data.results || [],
        total: data.total || data.count || 0,
      };
    }

    if (rajaAccountsRes.ok) {
      const data = await rajaAccountsRes.json();
      rajaAccounts = data.items || [];
    }
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  return (
    <RestitutionClient
      initialData={initialData}
      token={token}
      rajaAccounts={rajaAccounts}
    />
  );
}