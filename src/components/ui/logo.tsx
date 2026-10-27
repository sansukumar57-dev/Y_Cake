import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-cream",
        className,
      )}
      aria-label="Y Cake Atelier home"
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-full font-display text-[19px] leading-none transition-colors",
          light
            ? "border border-cream/20 bg-cream text-espresso"
            : "bg-espresso text-cream group-hover:bg-cocoa",
        )}
      >
        Y
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block font-display text-[21px] tracking-[-0.02em]",
            light ? "text-cream" : "text-espresso",
          )}
        >
          Y Cake
        </span>
        <span
          className={cn(
            "mt-1 block text-[8px] font-medium tracking-[0.32em]",
            light ? "text-cream/55" : "text-mocha",
          )}
        >
          ATELIER
        </span>
      </span>
    </Link>
  );
}
