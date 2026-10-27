import { cn } from "@/lib/utils";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-[#f4e6c8] text-[#76551b]",
  CONFIRMED: "bg-sage-soft text-[#4a5a41]",
  IN_PROGRESS: "bg-[#ece0d4] text-cocoa",
  READY: "bg-[#dbe8e2] text-[#3d5f52]",
  COMPLETED: "bg-porcelain text-mocha",
  CANCELLED: "bg-danger-soft text-danger",
};

export function statusLabel(status: string) {
  return (
    ORDER_STATUSES.find((item) => item.value === status)?.label ?? "Unknown"
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const key = (ORDER_STATUSES.some((item) => item.value === status)
    ? status
    : "PENDING") as OrderStatus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium leading-none",
        statusStyles[key],
        className,
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current opacity-70"
        aria-hidden="true"
      />
      {statusLabel(status)}
    </span>
  );
}
