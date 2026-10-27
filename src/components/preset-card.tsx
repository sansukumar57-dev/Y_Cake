import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CakeIllustration } from "@/components/cake/CakeIllustration";
import type { PresetView } from "@/lib/types";
import { formatPrice, pluralize } from "@/lib/utils";

const washes = [
  "bg-[#f1e4dc]",
  "bg-[#e9eee2]",
  "bg-[#f3ead9]",
  "bg-[#eee6dc]",
  "bg-[#e9ecec]",
  "bg-[#f2e3e0]",
];

export function PresetCard({
  preset,
  index = 0,
  showDescription = false,
}: {
  preset: PresetView;
  index?: number;
  showDescription?: boolean;
}) {
  return (
    <Link
      href={`/studio?preset=${preset.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-sand/80 bg-cream transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-mocha/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
      aria-label={`Customize ${preset.name}`}
    >
      <div
        className={`relative aspect-[4/5] overflow-hidden ${washes[index % washes.length]}`}
      >
        <CakeIllustration
          resolved={preset.resolved}
          className="h-full w-full transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.015]"
          showHalo={false}
        />
        <span className="absolute right-3 top-3 rounded-full border border-white/60 bg-cream/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa backdrop-blur-sm">
          {preset.resolved.size.tiers}{" "}
          {pluralize(preset.resolved.size.tiers, "tier")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow text-[10px]">{preset.tagline}</p>
        <div className="mt-2 flex items-start justify-between gap-4">
          <h3 className="font-display text-[1.55rem] leading-none text-espresso">
            {preset.name}
          </h3>
          <ArrowUpRight
            className="mt-1 h-4 w-4 shrink-0 text-mocha transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-espresso"
            aria-hidden="true"
          />
        </div>
        {showDescription ? (
          <p className="mt-3 text-[13px] leading-relaxed text-mocha">
            {preset.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-[12.5px] text-mocha">
            Serves {preset.resolved.servings}
          </p>
          <p className="text-[13px] font-medium text-espresso">
            <span className="mr-1 text-[11px] font-normal text-mocha">from</span>
            {formatPrice(preset.resolved.price.totalCents)}
          </p>
        </div>
      </div>
    </Link>
  );
}
