// types/index.type.ts

// ---------- کاربران ----------
export type UserRole = "customer" | "operator" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  createdAt: string;
}

// ---------- مسافران ----------
export type Gender = "male" | "female";

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  nationalId: string;       // کد ملی تایید شده
  gender: Gender;
  birthDate: string;        // YYYY-MM-DD (میلادی برای ذخیره)
  phone: string;
  userId: string;
}

// ---------- قطار ----------
export type TrainType = "3star" | "4star" | "5star" | "6bunk" | "saloon";

export const TRAIN_TYPE_LABEL: Record<TrainType, string> = {
  "3star": "سه ستاره",
  "4star": "چهار ستاره",
  "5star": "پنج ستاره",
  "6bunk": "شش تخته",
  saloon: "سالنی",
};

// ---------- سفارش ----------
export type OrderStatus =
  | "pending"        // در انتظار شروع فروش
  | "processing"     // در حال پردازش
  | "booking"        // ورود به رزرو
  | "success"        // رزرو موفق
  | "payment_ready"  // موفق تا مرحله پرداخت
  | "failed"         // ناموفق
  | "cancelled";     // لغو شده

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "در انتظار شروع فروش",
  processing: "در حال پردازش",
  booking: "ورود به رزرو",
  success: "رزرو موفق",
  payment_ready: "موفق تا مرحله پرداخت",
  failed: "ناموفق",
  cancelled: "لغو شده",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  processing: "text-blue-300 bg-blue-500/10 border-blue-500/30",
  booking: "text-violet-300 bg-violet-500/10 border-violet-500/30",
  success: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  payment_ready: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  failed: "text-rose-300 bg-rose-500/10 border-rose-500/30",
  cancelled: "text-zinc-300 bg-zinc-500/10 border-zinc-500/30",
};

export interface TimeRange {
  from: number; // ساعت شروع مثلا 18
  to: number;   // ساعت پایان مثلا 21
}

export interface Order {
  id: string;
  code: string;              // شماره نمایشی مثل #2154
  userId: string;
  from: string;              // مبدا
  to: string;                // مقصد
  date: string;              // تاریخ حرکت (YYYY-MM-DD)
  passengerIds: string[];    // شناسه مسافران
  trainNumbers: string[];    // شماره قطارهای مجاز
  trainTypes: TrainType[];   // انواع قطار
  priceLimit: number;        // سقف قیمت (تومان)
  timeRanges: TimeRange[];   // بازه‌های ساعت حرکت
  status: OrderStatus;
  isPresale: boolean;        // آیا پیش‌فروش است؟
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;     // اگر failed بود
}

// ---------- Worker ----------
export type WorkerStatus = "idle" | "running" | "error";

export interface Worker {
  id: string;
  name: string;              // Worker #1
  orderId: string;
  route: string;             // "تهران ← مشهد"
  status: WorkerStatus;
  serverId: string;
  startedAt: string;
}

// ---------- سرور ----------
export type ServerStatus = "healthy" | "down" | "overloaded";

export interface Server {
  id: string;
  name: string;
  status: ServerStatus;
  activeOrders: number;
  maxOrders: number;
  cpu: number;               // %
  latency: number;           // ms
}

// ---------- داشبورد ----------
export interface DashboardStats {
  activeOrders: number;
  capacitiesFound: number;
  successBookings: number;
  failedBookings: number;
  serverHealth: number;      // %
  avgResponseTime: number;   // seconds
}

// ---------- گزارش ----------
export interface DailyReport {
  date: string;
  totalOrders: number;
  successCount: number;
  failedCount: number;
  successRate: number;       // %
}