import Link from "next/link";
import { Plus } from "lucide-react";
import { CakeIllustration } from "@/components/cake/CakeIllustration";
import type { PresetView } from "@/lib/types";
import { formatPrice, pluralize } from "@/lib/utils";

const washes = [
  "bg-[#f1e4dc]",
  "bg-[#e9eee2]",
  "bg-[#f3ead9]",
  "bg-[#efe3e2]",
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
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-sand/70 bg-[#fffdfa] transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-mocha/35 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
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
        <span className="absolute right-3 top-3 rounded-full border border-white/60 bg-cream/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-cocoa backdrop-blur-sm">
          {preset.resolved.size.tiers}{" "}
          {pluralize(preset.resolved.size.tiers, "tier")}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow text-[10px]">{preset.tagline}</p>
        <h3 className="mt-2 font-display text-[1.45rem] leading-none text-espresso">
          {preset.name}
        </h3>
        {showDescription ? (
          <p className="mt-3 text-[13px] leading-relaxed text-mocha">
            {preset.description}
          </p>
        ) : null}
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <p className="text-[15px] font-semibold text-espresso">
              <span className="mr-1 text-[11px] font-normal text-mocha">
                from
              </span>
              {formatPrice(preset.resolved.price.totalCents)}
            </p>
            <p className="mt-0.5 text-[11px] text-mocha">
              Serves {preset.resolved.servings}
            </p>
          </div>
          <span
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-chocolate text-cream transition-transform duration-200 group-hover:scale-105"
            aria-hidden="true"
          >
            <Plus className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
