// app/component/ui/StatusBadge.tsx
// مخصوص سفارش
import { Badge } from "./Badge";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_COLOR,
  type OrderStatus,
} from "../../types/index.type";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={ORDER_STATUS_COLOR[status]}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {ORDER_STATUS_LABEL[status]}
    </Badge>
  );
}