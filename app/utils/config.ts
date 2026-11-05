// app/utils/config.ts
import axios from "axios";
import { NextResponse } from "next/server";

// app/utils/config.ts
export const response = NextResponse;

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/v1";

export const prodNextUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

export const api = axios.create({
  url: baseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
