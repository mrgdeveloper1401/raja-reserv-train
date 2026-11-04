// app/lib/api.ts
import { baseUrl } from "../utils/config";
import type {
  DashboardStatus,
  OrdersQuery,
  PaginatedOrders,
  Reservation,
} from "../types/index.type";

// تابع کمکی برای درخواست‌های سمت سرور
async function fetchWithAuth<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    // cache: "no-store" باعث می‌شود دیتا همیشه تازه باشد (معادل Server-Side Rendering داینامیک)
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

export const getDashboardStatus = (token: string) =>
  fetchWithAuth<DashboardStatus>("/admin/status", token);

export const getFiveLastReservations = (token: string) =>
  fetchWithAuth<Reservation[]>("/admin/five_reservation", token);

// سفارشات
export const getOrders = async (token: string, params: OrdersQuery) => {
  const searchParams = new URLSearchParams();
  if (params.tab) searchParams.set("tab", params.tab);
  if (params.search) searchParams.set("search", params.search);
  if (params.date) searchParams.set("date", params.date);
  if (params.page) searchParams.set("page", params.page.toString());

  const res = await fetch(
    `${baseUrl}/admin/orders?${searchParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json() as Promise<PaginatedOrders>;
};
