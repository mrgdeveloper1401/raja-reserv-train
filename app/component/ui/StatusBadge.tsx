// app/component/ui/StatusBadge.tsx
import {
  ORDER_STATUS_COLOR,
  ORDER_STATUS_LABEL,
  RESERVATION_STATUS_COLOR,
  RESERVATION_STATUS_LABEL,
  type OrderStatus,
  type ReservationStatus,
} from "../../types/index.type";

type Props = {
  status: OrderStatus | ReservationStatus;
};

export function StatusBadge({ status }: Props) {
  const isReservation = status in RESERVATION_STATUS_LABEL;
  const label = isReservation
    ? RESERVATION_STATUS_LABEL[status as ReservationStatus]
    : ORDER_STATUS_LABEL[status as OrderStatus];
  const color = isReservation
    ? RESERVATION_STATUS_COLOR[status as ReservationStatus]
    : ORDER_STATUS_COLOR[status as OrderStatus];

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs ${color}`}
    >
      {label}
    </span>
  );
}
