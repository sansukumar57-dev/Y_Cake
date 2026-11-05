"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/form";
import { ORDER_STATUSES } from "@/lib/types";

export function AdminOrderStatus({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [pending, setPending] = useState(false);

  const currentInfo =
    ORDER_STATUSES.find((item) => item.value === status) ??
    ORDER_STATUSES[0];

  const handleUpdate = async () => {
    if (status === currentStatus) {
      return;
    }
    setPending(true);
    try {
      const result = await updateOrderStatusAction({ orderId, status });
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Order updated", {
        description: `Marked as ${currentInfo.label.toLowerCase()}.`,
      });
      router.refresh();
    } catch {
      toast.error("The status could not be updated. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="order-status"
        className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.13em] text-mocha"
      >
        Status
      </label>
      <Select
        id="order-status"
        value={status}
        onChange={(event) => setStatus(event.target.value)}
        disabled={pending}
      >
        {ORDER_STATUSES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
      <p className="mt-2 min-h-8 text-[10.5px] leading-relaxed text-mocha">
        {currentInfo?.description}
      </p>
      <Button
        type="button"
        onClick={handleUpdate}
        disabled={pending || status === currentStatus}
        size="sm"
        className="mt-2 w-full"
      >
        {pending ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            Updating
          </>
        ) : (
          <>
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            {status === currentStatus ? "No change" : "Update status"}
          </>
        )}
      </Button>
    </div>
  );
}
