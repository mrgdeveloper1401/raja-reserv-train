// app/component/home.tsx
import Link from "next/link";
import {
  ArrowLeft,
  ShieldCheck,
  Zap,
  Users,
  BarChart3,
  Headphones,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { label: "کاربر فعال", value: "+۱۲٬۰۰۰", icon: Users },
  { label: "پروژه موفق", value: "+۳٬۵۰۰", icon: CheckCircle2 },
  { label: "رضایت مشتری", value: "۹۸٪", icon: BarChart3 },
  { label: "پشتیبانی", value: "۲۴/۷", icon: Headphones },
];

const features = [
  {
    icon: ShieldCheck,
    title: "امنیت بالا",
    desc: "اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود.",
  },
  {
    icon: Zap,
    title: "سرعت و پایداری",
    desc: "عملکرد سریع و بی‌وقفه در تمام لحظات، بدون افت کیفیت.",
  },
  {
    icon: Sparkles,
    title: "تجربه‌ی مدرن",
    desc: "رابط کاربری تمیز، شهودی و لذت‌بخش برای همه‌ی کاربران.",
  },
  {
    icon: Users,
    title: "تیم متخصص",
    desc: "همراهی تیمی از متخصصان باتجربه در کنار شما.",
  },
  {
    icon: Headphones,
    title: "پشتیبانی همیشگی",
    desc: "در هر ساعت شبانه‌روز، پاسخگوی سؤالات شما هستیم.",
  },
  {
    icon: BarChart3,
    title: "گزارش و تحلیل",
    desc: "دسترسی به آمار دقیق و گزارش‌های کاربردی برای تصمیم‌گیری.",
  },
];

export default function HomePage() {
  return (
    <main className="bg-[#0f0d0a]">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        {/* هاله‌های نوری */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[30rem] w-[30rem] rounded-full bg-amber-500/20 blur-3xl" />
          <div className="absolute top-40 -left-40 h-[26rem] w-[26rem] rounded-full bg-orange-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-6 pt-24 pb-28 text-center">
          {/* برچسب کوچک */}
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-medium text-amber-300">
            <Sparkles className="h-3.5 w-3.5" />
            نسخه‌ی جدید رجا منتشر شد
          </span>

          <h1 className="max-w-3xl text-4xl font-black leading-tight text-amber-50 sm:text-5xl lg:text-6xl">
            با{" "}
            <span className="bg-gradient-to-l from-amber-400 to-orange-500 bg-clip-text text-transparent">
              رجا
            </span>{" "}
            آینده‌ات را بساز
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-amber-100/50 sm:text-lg">
            پلتفرمی مدرن، سریع و امن که به تو کمک می‌کند تا بهتر، راحت‌تر و
            حرفه‌ای‌تر به اهدافت برسی.
          </p>

          {/* دکمه‌ها */}
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/login"
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-7 py-3.5 font-bold text-[#0f0d0a] shadow-lg shadow-amber-500/25 transition hover:shadow-amber-500/40 hover:brightness-110 active:scale-[0.98]"
            >
              شروع کن
              <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
            </Link>
            <Link
              href="#features"
              className="rounded-xl border border-amber-500/25 px-7 py-3.5 font-medium text-amber-100/80 transition hover:border-amber-400/60 hover:bg-amber-500/10 hover:text-amber-100"
            >
              بیشتر بدانیدید
            </Link>
          </div>

          {/* آمار */}
          <div className="mt-20 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-amber-500/15 bg-[#161210]/70 p-5 backdrop-blur-sm"
              >
                <s.icon className="mx-auto mb-2 h-5 w-5 text-amber-400/70" />
                <p className="text-2xl font-black text-amber-50">{s.value}</p>
                <p className="mt-1 text-xs text-amber-100/40">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="relative border-t border-amber-500/10">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400/80">
              چرا رجا؟
            </span>
            <h2 className="mt-3 text-3xl font-black text-amber-50 sm:text-4xl">
              همه چیزی که نیاز داری، در یک جا
            </h2>
            <p className="mt-4 text-sm leading-7 text-amber-100/40">
              مجموعه‌ای از قابلیت‌های حرفه‌ای که تجربه‌ی شما را ساده‌تر و لذت‌بخش‌تر
              می‌کند.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-amber-500/15 bg-[#161210]/60 p-6 transition hover:border-amber-400/40 hover:bg-[#161210]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-orange-500/10 text-amber-400 transition group-hover:from-amber-400/30 group-hover:to-orange-500/20">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-amber-50">{f.title}</h3>
                <p className="mt-2 text-sm leading-7 text-amber-100/40">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="relative border-t border-amber-500/10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-32 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-amber-500/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <h2 className="text-3xl font-black text-amber-50 sm:text-4xl">
            آماده‌ی شروع هستی؟
          </h2>
          <p className="mt-4 text-sm leading-7 text-amber-100/40 sm:text-base">
            همین حالا وارد شو و اولین قدم را برای رسیدن به اهدافت بردار.
          </p>
          <Link
            href="/login"
            className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-l from-amber-400 to-orange-500 px-8 py-4 font-bold text-[#0f0d0a] shadow-lg shadow-amber-500/25 transition hover:shadow-amber-500/40 hover:brightness-110 active:scale-[0.98]"
          >
            ورود به حساب
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}