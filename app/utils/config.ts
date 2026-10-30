import axios from "axios";
import { NextResponse } from "next/server";

// app/utils/config.ts
export const response = NextResponse;

export const isDev = process.env.NODE_ENV === "production";

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  url: isDev ? baseUrl : "http://localhost:8000/api/v1",
});
