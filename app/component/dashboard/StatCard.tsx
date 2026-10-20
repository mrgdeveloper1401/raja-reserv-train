// app/component.dashboard/StatCard.tsx
import { type LucideIcon } from "lucide-react";
import { Card } from "../ui/Card";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "amber" | "emerald" | "rose" | "blue" | "violet" | "cyan";
  hint?: string;
}

const tones = {
  amber: "text-amber-400 bg-amber-500/10",
  emerald: "text-emerald-400 bg-emerald-500/10",
  rose: "text-rose-400 bg-rose-500/10",
  blue: "text-blue-400 bg-blue-500/10",
  violet: "text-violet-400 bg-violet-500/10",
  cyan: "text-cyan-400 bg-cyan-500/10",
};

export function StatCard({ label, value, icon: Icon, tone = "amber", hint }: Props) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-amber-100/50">{label}</p>
          <p className="mt-3 text-3xl font-black text-amber-50">{value}</p>
          {hint && <p className="mt-1 text-[11px] text-amber-100/40">{hint}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}