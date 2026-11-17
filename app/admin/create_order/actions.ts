// app/admin/create_order/actions.ts
"use server";

import { cookies } from "next/headers";
import {
  getPassengers,
  getPassengerDetail,
} from "../../lib/api";

async function requireToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) {
    throw new Error("نشست شما منقضی شده است؛ دوباره وارد شوید.");
  }

  return token;
}

// دریافت لیست مشتریان با جستجو و صفحه‌بندی
export async function searchOrderPassengers(
  query: string,
  requestedPage: number = 1,
) {
  const token = await requireToken();

  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  return getPassengers(token, query.trim(), page);
}

// دریافت اطلاعات مشتری انتخاب‌شده
export async function getOrderPassengerDetail(id: number) {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error("شناسه مشتری معتبر نیست.");
  }

  const token = await requireToken();
  const passenger = await getPassengerDetail(token, id);

  return {
    id: passenger.id,
    first_name: passenger.first_name,
    last_name: passenger.last_name,
    national_id: passenger.national_id,
    birth_date: passenger.birth_date ?? null,
  };
}
