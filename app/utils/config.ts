// app/utils/config.ts
import axios from "axios";
import { NextResponse } from "next/server";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { DateObject } from "react-multi-date-picker";

// app/utils/config.ts
export const response = NextResponse;

export const baseUrl =
  process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8000/api/v1";

export const prodNextUrl =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

export const api = axios.create({
  url: baseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const toEnglishDigits = (str: string) => {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  return str.replace(/[۰-۹٠-٩]/g, (d) => {
    const index = persianDigits.indexOf(d);
    if (index > -1) return index.toString();
    return arabicDigits.indexOf(d).toString();
  });
};

export const convertIntoDate = (d: string) => {
  // ۱. ابتدا رشته میلادی را با تقویم میلادی می‌خوانیم
  const date = new DateObject({
    date: d,
    calendar: gregorian,
    locale: gregorian_en,
  });
  
  // ۲. سپس آن را به تقویم شمسی تبدیل می‌کنیم
  return date.convert(persian, persian_fa);
};
