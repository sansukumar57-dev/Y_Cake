"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { FINISHES, MAX_INSCRIPTION_LENGTH } from "@/lib/pricing";
import { FROSTING_COLORS, isLightHex } from "@/lib/colors";
import { cn, formatPrice, tierLabel } from "@/lib/utils";
import type { Catalog, FinishId } from "@/lib/types";
import { Input } from "@/components/ui/form";
import { DecorationGlyph } from "./decoration-glyph";
import { useDesignStore } from "./design-store";

function Section({
  number,
  title,
  description,
  meta,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-sand/70 py-7 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <span className="mt-1.5 shrink-0 font-display text-[12px] italic text-gold">
            {number}
          </span>
          <div>
            <h2 className="font-display text-[23px] leading-none tracking-[-0.02em] text-espresso">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-sm text-[12.5px] leading-relaxed text-mocha">
                {description}
              </p>
            ) : null}
          </div>
        </div>
        {meta ? (
          <div className="shrink-0 pt-1 text-right text-[11.5px] text-mocha">
            {meta}
          </div>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function SizeVisual({ tiers, colors }: { tiers: number; colors: string[] }) {
  const widths = tiers === 1 ? [44] : tiers === 2 ? [44, 32] : [44, 33, 23];
  return (
    <div className="flex h-11 flex-col-reverse items-center justify-center gap-1">
      {widths.map((width, index) => (
        <span
          key={`${width}-${index}`}
          className="block rounded-[3px] border border-black/5"
          style={{
            width,
            height: 8,
            backgroundColor: colors[index] ?? "#F3E9D8",
          }}
        />
      ))}
    </div>
  );
}

function addition(cents: number) {
  return cents > 0 ? `+${formatPrice(cents)}` : "Included";
}

function FinishGlyph({ finish }: { finish: FinishId }) {
  return (
    <svg
      viewBox="0 0 100 52"
      className="h-11 w-full text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M12 25h76v15c0 3-2 5-5 5H17c-3 0-5-2-5-5V25Z"
        fill="currentColor"
        opacity="0.08"
        stroke="none"
      />
      <path d="M12 25h76" />
      {finish === "smooth" ? (
        <path d="M18 33h12M34 33h20M58 33h24" opacity="0.35" />
      ) : null}
      {finish === "swirl" ? (
        <path d="M14 27c3-6 7-6 10 0s7 6 10 0 7-6 10 0 7 6 10 0 7-6 10 0 7 6 10 0 7-6 10 0" />
      ) : null}
      {finish === "drip" ? (
        <>
          <path d="M18 27v9c0 3 2 5 5 5s5-2 5-5v-7" />
          <path d="M37 27v5c0 2 1.4 3.4 3.5 3.4S44 34 44 32v-4" />
          <path d="M56 27v12c0 3 2 5 5 5s5-2 5-5v-8" />
          <path d="M78 27v6c0 2 1.4 3.4 3.5 3.4S85 35 85 33v-5" />
        </>
      ) : null}
    </svg>
  );
}

export function DesignControls({ catalog }: { catalog: Catalog }) {
  const config = useDesignStore((state) => state.config);
  const setSize = useDesignStore((state) => state.setSize);
  const setTierFlavor = useDesignStore((state) => state.setTierFlavor);
  const setTierColor = useDesignStore((state) => state.setTierColor);
  const setFrosting = useDesignStore((state) => state.setFrosting);
  const setFinish = useDesignStore((state) => state.setFinish);
  const toggleDecoration = useDesignStore((state) => state.toggleDecoration);
  const setInscription = useDesignStore((state) => state.setInscription);

  const [activeTier, setActiveTier] = useState(0);
  const tierCount = config.tiers.length;
  const safeTier = Math.min(activeTier, Math.max(0, tierCount - 1));
  const selectedTier = config.tiers[safeTier];
  const size = catalog.sizes.find((item) => item.id === config.sizeId);
  const frosting = catalog.frostings.find(
    (item) => item.id === config.frostingId,
  );

  return (
    <div>
      <Section
        number="01"
        title="Size"
        description="Start with the number of tiers. You can change this at any time."
        meta={size ? `Serves ${size.servings}` : undefined}
      >
        <div className="grid grid-cols-3 gap-2.5">
          {catalog.sizes.map((option) => {
            const selected = option.id === config.sizeId;
            return (
              <label
                key={option.id}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-xl border p-3 transition-[border-color,background-color,box-shadow] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream",
                  selected
                    ? "border-espresso bg-porcelain shadow-[0_1px_0_rgba(44,33,27,0.06)]"
                    : "border-sand bg-cream hover:border-mocha/45",
                )}
              >
                <input
                  type="radio"
                  name="cake-size"
                  value={option.id}
                  checked={selected}
                  onChange={() => {
                    setSize(option.id);
                    setActiveTier(0);
                  }}
                  className="sr-only"
                />
                <SizeVisual
                  tiers={option.tiers}
                  colors={config.tiers.map((tier) => tier.colorHex)}
                />
                <span className="mt-2 block font-display text-[17px] leading-none text-espresso">
                  {option.name}
                </span>
                <span className="mt-1.5 block text-[10.5px] text-mocha">
                  {option.tiers} {option.tiers === 1 ? "tier" : "tiers"} ·{" "}
                  {option.servings}
                </span>
                <span className="mt-3 block text-[11.5px] font-medium text-cocoa">
                  {formatPrice(option.basePriceCents)}
                  <span className="font-normal text-mocha"> base</span>
                </span>
              </label>
            );
          })}
        </div>
      </Section>

      <Section
        number="02"
        title="Flavor & color"
        description="Each tier can have its own flavor and frosting shade."
        meta={
          tierCount > 1 ? (
            <span className="rounded-full bg-porcelain px-2.5 py-1 text-[10.5px] text-cocoa">
              {tierLabel(safeTier, tierCount)}
            </span>
          ) : (
            "Single tier"
          )
        }
      >
        {tierCount > 1 ? (
          <div className="mb-4 flex items-center gap-1 rounded-full bg-porcelain p-1">
            {config.tiers.map((tier, index) => {
              const label =
                tierCount === 2
                  ? index === 0
                    ? "Bottom"
                    : "Top"
                  : index === 0
                    ? "Bottom"
                    : index === tierCount - 1
                      ? "Top"
                      : "Middle";
              return (
                <button
                  key={`tier-tab-${index}`}
                  type="button"
                  onClick={() => setActiveTier(index)}
                  aria-pressed={safeTier === index}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-full px-2 py-2 text-[11.5px] font-medium transition-[background-color,color,box-shadow]",
                    safeTier === index
                      ? "bg-cream text-espresso shadow-sm"
                      : "text-mocha hover:text-espresso",
                  )}
                >
                  <span
                    className="h-2 w-2 rounded-full border border-black/10"
                    style={{ backgroundColor: tier.colorHex }}
                    aria-hidden="true"
                  />
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}

        <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-mocha">
          Flavor
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {catalog.flavors.map((flavor) => {
            const selected = selectedTier?.flavorId === flavor.id;
            return (
              <label
                key={flavor.id}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-xl border p-3 transition-[border-color,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream",
                  selected
                    ? "border-espresso bg-porcelain"
                    : "border-sand bg-cream hover:border-mocha/45",
                )}
              >
                <input
                  type="radio"
                  name={`flavor-${safeTier}`}
                  checked={selected}
                  onChange={() => setTierFlavor(safeTier, flavor.id)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-3">
                  <span className="text-[13px] font-medium leading-snug text-espresso">
                    {flavor.name}
                  </span>
                  <span className="shrink-0 text-[10.5px] text-mocha">
                    {addition(flavor.priceCents)}
                  </span>
                </span>
                <span className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-mocha">
                  {flavor.description}
                </span>
                {selected ? (
                  <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-espresso text-cream">
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>

        <div className="mt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-mocha">
              Frosting color
            </p>
            <p className="font-display text-[13px] italic text-cocoa">
              {selectedTier
                ? FROSTING_COLORS.find(
                    (color) =>
                      color.hex.toLowerCase() ===
                      selectedTier.colorHex.toLowerCase(),
                  )?.name
                : null}
            </p>
          </div>
          <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8">
            {FROSTING_COLORS.map((color) => {
              const selected =
                selectedTier?.colorHex.toLowerCase() === color.hex.toLowerCase();
              return (
                <label
                  key={color.hex}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-1.5 rounded-lg p-1.5 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-1 has-[:focus-visible]:ring-offset-cream",
                    selected ? "bg-porcelain" : "hover:bg-porcelain/60",
                  )}
                >
                  <input
                    type="radio"
                    name={`color-${safeTier}`}
                    checked={selected}
                    onChange={() => setTierColor(safeTier, color.hex)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "grid h-8 w-8 place-items-center rounded-full border border-black/10 transition-shadow",
                      selected &&
                        "ring-2 ring-espresso ring-offset-2 ring-offset-cream",
                    )}
                    style={{ backgroundColor: color.hex }}
                  >
                    {selected ? (
                      <Check
                        className={cn(
                          "h-3.5 w-3.5",
                          isLightHex(color.hex)
                            ? "text-espresso"
                            : "text-cream",
                        )}
                        aria-hidden="true"
                      />
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "text-[9.5px] leading-none",
                      selected ? "text-espresso" : "text-mocha",
                    )}
                  >
                    {color.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </Section>

      <Section
        number="03"
        title="Frosting & finish"
        description="The texture of the outside, and the buttercream beneath it."
        meta={frosting ? addition(frosting.priceCents) : undefined}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {catalog.frostings.map((option) => {
            const selected = option.id === config.frostingId;
            return (
              <label
                key={option.id}
                className={cn(
                  "relative flex cursor-pointer flex-col rounded-xl border p-3 transition-[border-color,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream",
                  selected
                    ? "border-espresso bg-porcelain"
                    : "border-sand bg-cream hover:border-mocha/45",
                )}
              >
                <input
                  type="radio"
                  name="frosting"
                  checked={selected}
                  onChange={() => setFrosting(option.id)}
                  className="sr-only"
                />
                <span className="flex items-start justify-between gap-3">
                  <span className="text-[13px] font-medium text-espresso">
                    {option.name}
                  </span>
                  <span className="shrink-0 text-[10.5px] text-mocha">
                    {addition(option.priceCents)}
                  </span>
                </span>
                <span className="mt-1.5 text-[11px] leading-relaxed text-mocha">
                  {option.description}
                </span>
                {selected ? (
                  <span className="absolute right-2 top-2 grid h-4 w-4 place-items-center rounded-full bg-espresso text-cream">
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                ) : null}
              </label>
            );
          })}
        </div>

        <div className="mt-5">
          <p className="mb-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-mocha">
            Finish
          </p>
          <div className="grid grid-cols-3 gap-2">
            {FINISHES.map((finish) => {
              const selected = finish.id === config.finish;
              return (
                <label
                  key={finish.id}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-xl border p-2.5 transition-[border-color,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream",
                    selected
                      ? "border-espresso bg-porcelain text-espresso"
                      : "border-sand bg-cream text-cocoa hover:border-mocha/45",
                  )}
                >
                  <input
                    type="radio"
                    name="finish"
                    checked={selected}
                    onChange={() => setFinish(finish.id)}
                    className="sr-only"
                  />
                  <FinishGlyph finish={finish.id} />
                  <span className="mt-1 text-[11.5px] font-medium leading-tight text-espresso">
                    {finish.name}
                  </span>
                  <span className="mt-1 text-[10.5px] text-mocha">
                    {addition(finish.priceCents)}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </Section>

      <Section
        number="04"
        title="Decorations"
        description="A few finishing touches. Add as many as you like."
        meta={`${config.decorationIds.length} selected`}
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {catalog.decorations.map((decoration) => {
            const selected = config.decorationIds.includes(decoration.id);
            return (
              <label
                key={decoration.id}
                title={decoration.description}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-[border-color,background-color] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-gold has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-cream",
                  selected
                    ? "border-espresso bg-porcelain"
                    : "border-sand bg-cream hover:border-mocha/45",
                )}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleDecoration(decoration.id)}
                  className="sr-only"
                />
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
                    selected
                      ? "bg-espresso text-cream"
                      : "bg-porcelain text-cocoa",
                  )}
                >
                  <DecorationGlyph
                    icon={decoration.icon}
                    className="h-5 w-5"
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12.5px] font-medium text-espresso">
                    {decoration.name}
                  </span>
                  <span className="mt-0.5 block text-[10.5px] text-mocha">
                    {addition(decoration.priceCents)}
                  </span>
                </span>
                {selected ? (
                  <Check
                    className="h-4 w-4 shrink-0 text-espresso"
                    aria-hidden="true"
                  />
                ) : null}
              </label>
            );
          })}
        </div>
      </Section>

      <Section
        number="05"
        title="Inscription"
        description="A short message, piped by hand on a chocolate plaque."
        meta={config.inscription ? formatPrice(800) : "Optional"}
      >
        <div className="rounded-xl border border-sand bg-cream p-3.5">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="inscription"
              className="text-[11px] font-medium uppercase tracking-[0.14em] text-mocha"
            >
              Plaque message
            </label>
            <span className="text-[10.5px] text-mocha">
              {config.inscription.length}/{MAX_INSCRIPTION_LENGTH}
            </span>
          </div>
          <Input
            id="inscription"
            value={config.inscription}
            onChange={(event) => setInscription(event.target.value)}
            maxLength={MAX_INSCRIPTION_LENGTH}
            placeholder="Happy birthday, Mira"
            className="mt-2 bg-white"
            aria-describedby="inscription-help"
          />
          <p id="inscription-help" className="mt-2 text-[11px] text-mocha">
            Leave blank for no plaque. Up to {MAX_INSCRIPTION_LENGTH}{" "}
            characters. {formatPrice(800)} when added.
          </p>
        </div>
      </Section>

      <div className="border-t border-sand/70 pt-5">
        <p className="text-[11px] leading-relaxed text-mocha">
          Made with butter, eggs, dairy, and wheat in a kitchen that also
          handles nuts. Pickup is arranged with at least three days&apos;
          notice.
        </p>
      </div>
    </div>
  );
}
