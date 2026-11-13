// app/lib/api.ts
import { baseUrl } from "../utils/config";
import type {
  CreatePassengerPayload,
  DashboardChartStatus,
  DashboardStatus,
  OrdersQuery,
  PaginatedOrders,
  PaginatedPassengers,
  PaginatedRajaAccounts,
  PassengerDetail,
  RajaAccountOption,
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

export const getPassengers = async (
  token: string,
  search: string = "",
  page: number = 1,
) => {
  const searchParams = new URLSearchParams();
  if (search) searchParams.set("search", search);
  searchParams.set("page", page.toString());

  const res = await fetch(
    `${baseUrl}/admin/passengers?${searchParams.toString()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) throw new Error("Failed to fetch passengers");
  return res.json() as Promise<PaginatedPassengers>;
};

export const createPassenger = async (
  token: string,
  data: CreatePassengerPayload,
) => {
  const res = await fetch(`${baseUrl}/admin/passengers`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || "خطا در ثبت مشتری");
  }
  return res.json();
};

export const getPassengerDetail = async (
  token: string,
  id: string | number,
) => {
  const res = await fetch(`${baseUrl}/admin/passengers/${id}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("مشتری یافت نشد");
  return res.json() as Promise<PassengerDetail>;
};

export const updatePassenger = async (
  token: string,
  id: string | number,
  data: any,
) => {
  const res = await fetch(`${baseUrl}/admin/passengers/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "خطا در ویرایش مشتری");
  }
  return res.json();
};

export const deletePassenger = async (token: string, id: string | number) => {
  const res = await fetch(`${baseUrl}/admin/passengers/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("خطا در حذف مشتری");
};

// حساب رجا
export const getRajaAccounts = async (
  token: string,
  search: string = "",
  page: number = 1,
) => {
  const params = new URLSearchParams({ search, page: page.toString() });
  const res = await fetch(`${baseUrl}/auth/raja-accounts?${params}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("خطا در دریافت اکانت‌ها");
  return res.json() as Promise<PaginatedRajaAccounts>;
};

export const createRajaAccount = async (token: string, data: any) => {
  const res = await fetch(`${baseUrl}/auth/raja-accounts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "خطا در ساخت اکانت");
  }
  return res.json();
};

export const updateRajaAccount = async (
  token: string,
  id: number,
  data: any,
) => {
  const res = await fetch(`${baseUrl}/auth/raja-accounts/${id}`, {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("خطا در ویرایش اکانت");
  return res.json();
};

export const deleteRajaAccount = async (token: string, id: number) => {
  const res = await fetch(`${baseUrl}/auth/raja-accounts/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("خطا در حذف اکانت");
};

export const getRajaAccountOptions = async (token: string) => {
  const res = await fetch(`${baseUrl}/auth/raja-accounts/options`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("خطا در دریافت اکانت‌ها");
  return res.json() as Promise<RajaAccountOption[]>;
};

export const createOrder = async (token: string, data: any) => {
  const res = await fetch(`${baseUrl}/admin/orders`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "خطا در ثبت سفارش");
  }
  return res.json();
};

export const getDashboardChartStatus = async (token: string) => {
  const res = await fetch(`${baseUrl}/admin/status/chart`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch chart data");
  return res.json() as Promise<DashboardChartStatus>;
};

export const deleteOrder = async (orderId: number, token: string) => {
  const res = await fetch(`${baseUrl}/admin/orders/${orderId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  return res;
};
