// app/api/auth/login/route.ts
import { baseUrl } from "@/app/utils/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();

  const apiResponse = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone: body.phone,
      password: body.password,
    }),
    cache: "no-store",
  });

  const result = await apiResponse.json().catch(() => null);

  if (!apiResponse.ok) {
    return NextResponse.json(result ?? { detail: "ورود ناموفق بود." }, {
      status: apiResponse.status,
    });
  }

  const accessToken = result?.token?.access_token;

  if (!accessToken) {
    return NextResponse.json(
      { detail: "توکن در پاسخ سرور وجود ندارد." },
      { status: 502 },
    );
  }

  const response = NextResponse.json(
    {
      user: result.user,
    },
    { status: 200 },
  );

  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(result.token.access_token_expire_datetime),
  });
  response.cookies.set("refresh_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(result.token.refresh_token_expire_datetime),
  });
  return response;
}
