// components/Footer.tsx
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-amber-500/10 bg-[#0f0d0a]">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* برند */}
          <div>
            <h2 className="text-2xl font-black bg-gradient-to-l from-amber-400 to-orange-500 bg-clip-text text-transparent">
              رجا
            </h2>
            <p className="mt-4 text-sm leading-7 text-amber-100/40">
              توضیح کوتاه درباره‌ی مجموعه، خدمات یا هدف سایت شما. اینجا می‌تونه
              یک متن معرفی جذاب باشه.
            </p>
          </div>

          {/* لینک‌های سریع */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-amber-50">
              دسترسی سریع
            </h3>
            <ul className="space-y-3 text-sm">
              {["صفحه اصلی", "درباره ما", "خدمات", "وبلاگ"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-amber-100/40 transition hover:text-amber-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* خدمات */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-amber-50">خدمات</h3>
            <ul className="space-y-3 text-sm">
              {["مشاوره", "پشتیبانی", "همکاری", "تماس"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-amber-100/40 transition hover:text-amber-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h3 className="mb-4 text-sm font-bold text-amber-50">تماس با ما</h3>
            <ul className="space-y-4 text-sm text-amber-100/40">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400/60" />
                <span dir="ltr">021-12345678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400/60" />
                info@raja.ir
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-amber-400/60" />
                <span>تهران، خیابان ...، پلاک ...</span>
              </li>
            </ul>
          </div>
        </div>

        {/* ردیف پایینی */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-amber-500/10 pt-6 text-xs text-amber-100/30 md:flex-row">
          <p>© ۱۴۰۴ رجا. تمامی حقوق محفوظ است.</p>
          <div className="flex items-center gap-5">
            <Link href="#" className="hover:text-amber-300 transition">
              حریم خصوصی
            </Link>
            <Link href="#" className="hover:text-amber-300 transition">
              قوانین
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
