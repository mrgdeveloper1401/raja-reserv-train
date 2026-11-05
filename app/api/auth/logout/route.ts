// app/api/auth/logout/route.ts
import { request } from "http";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();

  // پاک کردن توکن‌ها
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  // انتقال کاربر به صفحه لاگین
  return NextResponse.redirect(new URL("/login", request.url));
}
