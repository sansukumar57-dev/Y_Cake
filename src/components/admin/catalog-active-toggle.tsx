"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { setCatalogActiveAction } from "@/app/actions/admin";
import { cn } from "@/lib/utils";

type Kind = "size" | "flavor" | "frosting" | "decoration";

export function CatalogActiveToggle({
  kind,
  itemId,
  itemName,
  active,
}: {
  kind: Kind;
  itemId: string;
  itemName: string;
  active: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const toggle = async () => {
    setPending(true);
    try {
      const result = await setCatalogActiveAction(kind, itemId, !active);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(active ? "Option hidden" : "Option is live", {
        description: `${itemName} is ${active ? "no longer" : "now"} available in the studio.`,
      });
      router.refresh();
    } catch {
      toast.error("The option could not be updated. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={`${active ? "Hide" : "Show"} ${itemName}`}
      title={active ? "Hide from studio" : "Show in studio"}
      onClick={toggle}
      disabled={pending}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-50",
        active ? "bg-espresso" : "bg-sand",
      )}
    >
      <span
        className={cn(
          "h-3.5 w-3.5 rounded-full bg-cream shadow-sm transition-transform",
          active ? "translate-x-[19px]" : "translate-x-[3px]",
        )}
        aria-hidden="true"
      />
    </button>
  );
}
