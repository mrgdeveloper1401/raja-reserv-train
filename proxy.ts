import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { baseUrl } from "./app/utils/config";

export async function proxy(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const loginUrl = new URL("/login", request.url);

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(loginUrl);
  }

  if (!accessToken && refreshToken) {
    try {
      // درخواست به بک‌اند برای گرفتن توکن جدید (از fetch استفاده می‌کنیم چون در Edge هستیم)
      const res = await fetch(`${baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        const newAccess =
          data.access ?? data.access_token ?? data.token?.access_token;
        const expiresIn =
          data.access_token_life_time ??
          data.access_token_expire_datetime ??
          3600;

        if (!newAccess) {
          throw new Error("Invalid refresh response");
        }

        // ساخت پاسخ برای ادامه مسیر
        const response = NextResponse.next();

        // ست کردن کوکی جدید در پاسخ
        response.cookies.set("access_token", newAccess, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: Number(expiresIn),
        });

        return response;
      } else {
        // اگر رفرش توکن هم منقضی شده بود، کوکی‌ها را پاک کن و بفرست لاگین
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        return response;
      }
    } catch (error) {
      // در صورت خطای شبکه
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
