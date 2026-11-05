// app/api/auth/logout/route.ts
import { prodNextUrl } from "@/app/utils/config";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // پاک کردن توکن‌ها
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  // انتقال کاربر به صفحه لاگین
  return NextResponse.redirect(new URL("/login", prodNextUrl));
}
