// types/index.type.ts

// ---------- کاربران ----------
export interface User {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
}

// ---------- مسافران ----------

export interface Passenger {
  id: string;
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string;
  is_adult: boolean;
}

// ---------- قطار ----------
export type TrainType =
  | "3_star_6_coupe"
  | "4_star_5_coupe"
  | "4_star_4_coupe"
  | "5_star"
  | "saloon";

export const TRAIN_TYPE_LABEL: Record<TrainType, string> = {
  "3_star_6_coupe": "سه ستاره",
  "4_star_5_coupe": "چهار ستاره پنج تخته",
  "4_star_4_coupe": "چهار ستاره چهار تخته",
  "5_star": "پنج ستاره",
  saloon: "سالنی",
};

// ---------- سفارش ----------
export type OrderStatus =
  | "waiting_start"
  | "pending"
  | "processing"
  | "booking"
  | "success"
  | "payment_ready"
  | "failed"
  | "cancelled";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  waiting_start: "اماده شروع",
  pending: "انتظار",
  processing: "در حال پردازش",
  booking: "ورود به رزرو",
  success: "رزرو موفق",
  payment_ready: "موفق تا مرحله پرداخت",
  failed: "ناموفق",
  cancelled: "لغو شده",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  waiting_start: "text-slate-300 bg-slate-500/10 border-slate-500/30",
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
  to: number; // ساعت پایان مثلا 21
}

export type ReservationStatus =
  | "pending"
  | "monitoring"
  | "waiting_start"
  | "redirect_gateway"
  | "success"
  | "captcha"
  | "failed";

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: "انتظار",
  monitoring: "در حال رصد",
  waiting_start: "آماده رزرو",
  redirect_gateway: "هدایت به درگاه پرداخت",
  success: "موفق",
  failed: "ناموفق",
  captcha: "کپچا",
};

export const RESERVATION_STATUS_COLOR: Record<ReservationStatus, string> = {
  pending: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  monitoring: "text-blue-300 bg-blue-500/10 border-blue-500/30",
  waiting_start: "text-violet-300 bg-violet-500/10 border-violet-500/30",
  redirect_gateway: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  success: "text-emerald-300 bg-emerald-500/10 border-emerald-500/30",
  failed: "text-rose-300 bg-rose-500/10 border-rose-500/30",
  captcha: "text-[#facc15] bg-[#facc15]-500/10 border-[#facc15]-500/30",
};

export interface Reservation {
  id: number;
  order_id: number;
  train_number: string[];
  coupe_type: string;
  origin: string;
  destination: string;
  travel_date: string; // YYYY-MM-DD
  phone?: string;
  status: ReservationStatus;
}

export interface DashboardStatus {
  failed_count: number;
  success_count: number;
  active_orders_count: number;
  solve_captcha: number;
}

export interface Order {
  id: string;
  code: string; // شماره نمایشی مثل #2154
  userId: string;
  from: string; // مبدا
  to: string; // مقصد
  date: string; // تاریخ حرکت (YYYY-MM-DD)
  passengerIds: string[]; // شناسه مسافران
  trainNumbers: string[]; // شماره قطارهای مجاز
  trainTypes: TrainType[]; // انواع قطار
  priceLimit: number; // سقف قیمت (تومان)
  timeRanges: TimeRange[]; // بازه‌های ساعت حرکت
  status: OrderStatus;
  isPresale: boolean; // آیا پیش‌فروش است؟
  createdAt: string;
  updatedAt: string;
  errorMessage?: string; // اگر failed بود
}

// ---------- Worker ----------
export type WorkerStatus = "idle" | "running" | "error";

export interface Worker {
  id: string;
  name: string; // Worker #1
  orderId: string;
  route: string; // "تهران ← مشهد"
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
  cpu: number; // %
  latency: number; // ms
}

// ---------- داشبورد ----------
export interface DashboardStats {
  activeOrders: number;
  capacitiesFound: number;
  successBookings: number;
  failedBookings: number;
  serverHealth: number; // %
  avgResponseTime: number; // seconds
}

// ---------- گزارش ----------
export interface DailyReport {
  date: string;
  totalOrders: number;
  successCount: number;
  failedCount: number;
  successRate: number; // %
}

// سفارشات
export interface PaginatedOrders {
  items: Reservation[];
  page: number;
  page_size: number;
}

export interface OrdersQuery {
  tab?: string;
  search?: string;
  date?: string;
  page?: number;
}

// مشتریان
export interface PassengerListItem {
  id: number;
  full_name: string;
  orders_count: number;
  last_order_date: string | null;
  national_id?: string
}

export interface PaginatedPassengers {
  items: PassengerListItem[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreatePassengerPayload {
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date?: string | null;
}

export interface PassengerOrder {
  id: number;
  origin: string;
  destination: string;
  travel_date: string;
  passenger_type: "male" | "family" | "famale";
}

export interface PassengerDetail {
  id: number;
  first_name: string;
  last_name: string;
  national_id: string;
  birth_date: string | null;
  phone: string;
  orders: PassengerOrder[];
}

export interface RajaAccountItem {
  id: number;
  username: string;
  is_active: boolean;
}

export interface PaginatedRajaAccounts {
  items: RajaAccountItem[];
  total: number;
  page: number;
  page_size: number;
}

// ---------- اکانت‌های رجا ----------
export interface RajaAccountOption {
  id: number;
  username: string;
}

export interface DashboardChartStatus {
  pending_count: number;
  monitoring_count: number;
  booking_count: number;
  redirect_gateway_count: number;
  success_count: number;
  failed_count: number;
  active_orders_count: number;
  solve_captcha: number;
}

// مرجوعی ها
export interface Restitution {
  id: number;
  serial_number: string;
  phone: string;
  train_number: string[];
  hall_number: string;
  status: "success" | "failed" | "pending";
  created_at: string;
  updated_at: string;
}

export interface RestitutionsResponse {
  items: Restitution[];
  total: number;
}

export interface StationOption {
  Name: string;
}

export interface EditOrderType {
  id: number;
  origin: string;
  destination: string;
  travel_date?: string | null;
  to_date?: string;
  passenger_type: "male" | "family" | "famale";
  trip_type: "outbound" | "outbound_and_return";
  raja_account_id?: number | null;
  coupe_type?: "all" | "four" | "four_five" | "three" | "five" | "salon" | null;
  is_exclusive?: boolean;
  departure_time_slots?: number[] | null;
  from_price?: string | number | null;
  to_price?: number | null;
  train_number?: string[] | null;
  phone: string;
  adult_number: number;
  baby_number: number;
  passengers: Passenger[];
  status:
    | "waiting_start"
    | "pending"
    | "monitoring"
    | "redirect_gateway"
    | "failed"
    | "captcha";
}
