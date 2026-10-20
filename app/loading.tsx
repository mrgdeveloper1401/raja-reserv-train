// app/loading.tsx
'use client'
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0d0a]">
      <div className="flex flex-col items-center gap-4">
        {/* لوگو چشمک‌زن */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-2xl bg-amber-500/40" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/40">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-[#0f0d0a]" fill="currentColor">
              <path d="M12 2l2.09 6.26L20 9.27l-4.95 4.38L16.18 20 12 16.77 7.82 20l1.13-6.35L4 9.27l5.91-1.01L12 2z" />
            </svg>
          </div>
        </div>

        <p className="text-sm text-amber-100/50">در حال بارگذاری...</p>

        {/* نوار پیشرفت */}
        <div className="h-1 w-40 overflow-hidden rounded-full bg-amber-500/10">
          <div className="h-full w-1/3 animate-[loading_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-l from-amber-400 to-orange-500" />
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(200%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}