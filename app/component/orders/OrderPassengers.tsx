// app/component/orders/OrderPassengers.tsx
import { User, Phone, CreditCard, Calendar, Users } from "lucide-react";
import { Card } from "../../component/ui/Card";
import type { Passenger } from "../../types/index.type";

export function OrderPassengers({ passengers }: { passengers: Passenger[] }) {
  return (
    <Card padded={false} className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-amber-500/10 p-5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-amber-400" />
          <h2 className="text-base font-bold text-amber-50">مسافران</h2>
        </div>
        <span className="text-xs text-amber-100/40">{passengers.length} نفر</span>
      </div>

      <div className="divide-y divide-amber-500/5">
        {passengers.map((p, i) => (
          <div key={p.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    p.gender === "male"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-pink-500/10 text-pink-400"
                  }`}
                >
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-50">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-amber-100/40">
                    {p.gender === "male" ? "آقا" : "خانم"}
                  </p>
                </div>
              </div>
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-mono text-amber-300/80">
                #{i + 1}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <InfoRow icon={CreditCard} label="کد ملی" value={p.nationalId} mono />
              <InfoRow icon={Phone} label="تماس" value={p.phone} mono />
              <InfoRow icon={Calendar} label="تاریخ تولد" value={p.birthDate} mono />
            </div>
          </div>
        ))}
        {passengers.length === 0 && (
          <div className="p-8 text-center text-xs text-amber-100/30">
            مسافری انتخاب نشده
          </div>
        )}
      </div>
    </Card>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof User;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-amber-500/10 bg-[#0f0d0a]/60 px-2.5 py-1.5">
      <p className="flex items-center gap-1 text-[10px] text-amber-100/40">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p
        className={`mt-0.5 text-xs text-amber-100/80 ${mono ? "font-mono" : ""}`}
        dir={mono ? "ltr" : undefined}
      >
        {value}
      </p>
    </div>
  );
}