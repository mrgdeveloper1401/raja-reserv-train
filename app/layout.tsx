import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { ThemeProvider } from "./component/providers/ThemeProvider";
import { Toaster } from "./component/ui/Toaster";

const dana = localFont({
  src: [
    { path: "../public/font/DanaFaNum-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/font/DanaFaNum-DemiBold.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-dana",
  display: "swap",
});

export const metadata: Metadata = {
  title: "رزرو بلیط قطار | رجا",
  description: "سامانه‌ی ثبت و مدیریت رزرو بلیط قطار",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={dana.variable} suppressHydrationWarning>
      <body
        className={`${dana.className} min-h-screen bg-[#0f0d0a] text-amber-50 antialiased transition-colors duration-300 dark:bg-[#0f0d0a] light:bg-[#fdfcfb] light:text-[#1a1513]`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}