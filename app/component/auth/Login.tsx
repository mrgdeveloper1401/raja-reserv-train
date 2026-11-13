"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Mail,
  KeyRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Mode = "login" | "forgot" | "verify";


export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();
  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (mode !== "login") {
      setError("این بخش هنوز به API متصل نشده است.");
      return;
    }

    const normalizedPhone = phone.trim();

    if (!normalizedPhone || !password) {
      setError("شماره موبایل و رمز عبور را وارد کنید.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: normalizedPhone,
          password,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.detail ?? "ورود ناموفق بود.");
      }

      setSuccess(`خوش آمدید، ${result.user.username}`);
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطایی هنگام ورود رخ داد.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0d0a] px-4 py-12">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-orange-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-amber-500/20 bg-[#161210]/90 p-8 shadow-2xl shadow-amber-900/20 backdrop-blur-xl">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/30">
            <ShieldCheck className="h-7 w-7 text-[#0f0d0a]" />
          </div>

          <h1 className="text-center text-2xl font-bold text-amber-50">
            {mode === "login" && "ورود به حساب"}
            {mode === "forgot" && "فراموشی رمز عبور"}
            {mode === "verify" && "تأیید کد"}
          </h1>

          <p className="mt-2 text-center text-sm text-amber-200/50">
            {mode === "login" && "برای ادامه وارد حساب کاربری خود شوید"}
            {mode === "forgot" && "شماره موبایل خود را وارد کنید"}
            {mode === "verify" && "کد ارسال شده را وارد کنید"}
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="mb-2 block text-sm font-medium text-amber-100/80">
                شماره موبایل
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500/50" />
                <input
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09123456789"
                  dir="ltr"
                  className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] py-3 pr-11 pl-4 text-left text-amber-50 placeholder:text-amber-200/20 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            {mode === "login" && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  {/* <label className="text-sm font-medium text-amber-100/80">
                    رمز عبور
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setMode("forgot");
                    }}
                    className="text-xs text-amber-400 transition hover:text-amber-300"
                  >
                    فراموشی رمز؟
                  </button> */}
                </div>

                <div className="relative">
                  <KeyRound className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-500/50" />
                  <input
                    type={showPass ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    dir="ltr"
                    className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] py-3 pr-11 pl-11 text-left text-amber-50 placeholder:text-amber-200/20 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-500/20"
                  />
                  <button
                    type="button"
                    aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/50 transition hover:text-amber-300"
                  >
                    {showPass ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {mode === "verify" && (
              <div>
                <label className="mb-2 block text-sm font-medium text-amber-100/80">
                  کد تأیید
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="- - - - -"
                  dir="ltr"
                  className="w-full rounded-xl border border-amber-500/20 bg-[#0f0d0a] py-3 px-4 text-center text-lg tracking-[0.5em] text-amber-50 placeholder:text-amber-200/20 outline-none transition focus:border-amber-400/60 focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            )}

            {error && (
              <p role="alert" className="text-sm text-red-400">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-sm text-emerald-400">
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 py-3 font-bold text-[#0f0d0a] shadow-lg shadow-amber-500/25 transition hover:shadow-amber-500/40 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "در حال ارسال..."
                : mode === "login"
                  ? "ورود"
                  : mode === "forgot"
                    ? "ارسال کد"
                    : "تأیید و ادامه"}
              <ArrowRight className="h-4 w-4 transition group-hover:-translate-x-1" />
            </button>
          </form>

          {mode !== "login" && (
            <button
              type="button"
              onClick={() => {
                setError("");
                setSuccess("");
                setMode("login");
              }}
              className="mt-6 flex w-full items-center justify-center gap-1 text-sm text-amber-200/50 transition hover:text-amber-200"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              بازگشت به صفحه ورود
            </button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-amber-200/30">
          با ورود، <span className="text-amber-400/60">قوانین و مقررات</span> را
          می‌پذیرید
        </p>
      </div>
    </div>
  );
}
