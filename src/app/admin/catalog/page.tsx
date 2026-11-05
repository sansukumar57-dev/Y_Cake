import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Info, SlidersHorizontal } from "lucide-react";
import { CatalogActiveToggle } from "@/components/admin/catalog-active-toggle";
import { CatalogItemDialog } from "@/components/admin/catalog-item-dialog";
import { DecorationGlyph } from "@/components/studio/decoration-glyph";
import { getAdminCatalog } from "@/lib/data";
import { cn, formatPrice, pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Catalog",
};

function countLive<T extends { active: boolean }>(items: T[]) {
  return items.filter((item) => item.active).length;
}

export default async function AdminCatalogPage() {
  const catalog = await getAdminCatalog();

  return (
    <div className="mx-auto max-w-[1120px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-3 text-[9.5px] font-medium uppercase tracking-[0.2em] text-mocha">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            Studio settings
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.2rem)] leading-[0.98] tracking-[-0.045em]">
            The <span className="serif-italic text-rose">pantry.</span>
          </h1>
          <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-mocha">
            The sizes, flavors, frostings, and flourishes that make up the
            studio. Edit a price or hide an option from the public menu.
          </p>
        </div>
        <Link
          href="/studio"
          className="inline-flex items-center gap-1.5 text-[11.5px] text-mocha transition-colors hover:text-espresso"
        >
          View in studio
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-gold/25 bg-gold-soft/15 px-4 py-3.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
        <p className="text-[11.5px] leading-relaxed text-cocoa">
          Changes appear in the studio immediately. Saved designs use the live
          catalog, while placed orders keep their original design snapshot.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <section className="overflow-hidden rounded-xl border border-sand/80 bg-cream">
          <div className="flex items-center justify-between gap-4 border-b border-sand/70 px-4 py-3.5">
            <div>
              <h2 className="font-display text-[21px] leading-none">Sizes</h2>
              <p className="mt-1 text-[10.5px] text-mocha">
                Tier count, servings, and the base price.
              </p>
            </div>
            <p className="shrink-0 text-[10px] text-mocha">
              {countLive(catalog.sizes)} live · {catalog.sizes.length} total
            </p>
          </div>
          <ul className="divide-y divide-sand/70">
            {catalog.sizes.map((size) => (
              <li
                key={size.id}
                className={cn(
                  "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4",
                  !size.active && "bg-porcelain/25",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-[19px] leading-none text-espresso">
                      {size.name}
                    </h3>
                    {!size.active ? (
                      <span className="rounded-full bg-porcelain px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-mocha">
                        Hidden
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-mocha">
                    {size.description}
                  </p>
                  <p className="mt-1.5 text-[9.5px] uppercase tracking-[0.12em] text-mocha/80">
                    {size.tiers} {pluralize(size.tiers, "tier")} · serves{" "}
                    {size.servings}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-espresso">
                      {formatPrice(size.basePriceCents)}
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-mocha">
                      base
                    </p>
                  </div>
                  <CatalogActiveToggle
                    kind="size"
                    itemId={size.id}
                    itemName={size.name}
                    active={size.active}
                  />
                  <CatalogItemDialog
                    kind="size"
                    itemId={size.id}
                    name={size.name}
                    description={size.description}
                    priceCents={size.basePriceCents}
                    sortOrder={size.sortOrder}
                    active={size.active}
                    tiers={size.tiers}
                    servings={size.servings}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border border-sand/80 bg-cream">
          <div className="flex items-center justify-between gap-4 border-b border-sand/70 px-4 py-3.5">
            <div>
              <h2 className="font-display text-[21px] leading-none">Flavors</h2>
              <p className="mt-1 text-[10.5px] text-mocha">
                Sponge and filling choices. Prices are added to each tier.
              </p>
            </div>
            <p className="shrink-0 text-[10px] text-mocha">
              {countLive(catalog.flavors)} live · {catalog.flavors.length} total
            </p>
          </div>
          <ul className="divide-y divide-sand/70">
            {catalog.flavors.map((flavor) => (
              <li
                key={flavor.id}
                className={cn(
                  "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4",
                  !flavor.active && "bg-porcelain/25",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-[19px] leading-none text-espresso">
                      {flavor.name}
                    </h3>
                    {!flavor.active ? (
                      <span className="rounded-full bg-porcelain px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-mocha">
                        Hidden
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-mocha">
                    {flavor.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-espresso">
                      {formatPrice(flavor.priceCents)}
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-mocha">
                      per tier
                    </p>
                  </div>
                  <CatalogActiveToggle
                    kind="flavor"
                    itemId={flavor.id}
                    itemName={flavor.name}
                    active={flavor.active}
                  />
                  <CatalogItemDialog
                    kind="flavor"
                    itemId={flavor.id}
                    name={flavor.name}
                    description={flavor.description}
                    priceCents={flavor.priceCents}
                    sortOrder={flavor.sortOrder}
                    active={flavor.active}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border border-sand/80 bg-cream">
          <div className="flex items-center justify-between gap-4 border-b border-sand/70 px-4 py-3.5">
            <div>
              <h2 className="font-display text-[21px] leading-none">
                Frostings
              </h2>
              <p className="mt-1 text-[10.5px] text-mocha">
                The buttercream under every finish.
              </p>
            </div>
            <p className="shrink-0 text-[10px] text-mocha">
              {countLive(catalog.frostings)} live · {catalog.frostings.length}{" "}
              total
            </p>
          </div>
          <ul className="divide-y divide-sand/70">
            {catalog.frostings.map((frosting) => (
              <li
                key={frosting.id}
                className={cn(
                  "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4",
                  !frosting.active && "bg-porcelain/25",
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-[19px] leading-none text-espresso">
                      {frosting.name}
                    </h3>
                    {!frosting.active ? (
                      <span className="rounded-full bg-porcelain px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-mocha">
                        Hidden
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-mocha">
                    {frosting.description}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-espresso">
                      {formatPrice(frosting.priceCents)}
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-mocha">
                      once
                    </p>
                  </div>
                  <CatalogActiveToggle
                    kind="frosting"
                    itemId={frosting.id}
                    itemName={frosting.name}
                    active={frosting.active}
                  />
                  <CatalogItemDialog
                    kind="frosting"
                    itemId={frosting.id}
                    name={frosting.name}
                    description={frosting.description}
                    priceCents={frosting.priceCents}
                    sortOrder={frosting.sortOrder}
                    active={frosting.active}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="overflow-hidden rounded-xl border border-sand/80 bg-cream">
          <div className="flex items-center justify-between gap-4 border-b border-sand/70 px-4 py-3.5">
            <div>
              <h2 className="font-display text-[21px] leading-none">
                Decorations
              </h2>
              <p className="mt-1 text-[10.5px] text-mocha">
                Finishing touches, each added once.
              </p>
            </div>
            <p className="shrink-0 text-[10px] text-mocha">
              {countLive(catalog.decorations)} live ·{" "}
              {catalog.decorations.length} total
            </p>
          </div>
          <ul className="divide-y divide-sand/70">
            {catalog.decorations.map((decoration) => (
              <li
                key={decoration.id}
                className={cn(
                  "flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4",
                  !decoration.active && "bg-porcelain/25",
                )}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-porcelain text-cocoa">
                    <DecorationGlyph
                      icon={decoration.icon}
                      className="h-5 w-5"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[19px] leading-none text-espresso">
                        {decoration.name}
                      </h3>
                      {!decoration.active ? (
                        <span className="rounded-full bg-porcelain px-2 py-0.5 text-[8.5px] font-medium uppercase tracking-[0.1em] text-mocha">
                          Hidden
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-mocha">
                      {decoration.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 pl-12 sm:justify-end sm:pl-0">
                  <div className="text-right">
                    <p className="text-[13px] font-medium text-espresso">
                      {formatPrice(decoration.priceCents)}
                    </p>
                    <p className="text-[9px] uppercase tracking-[0.1em] text-mocha">
                      once
                    </p>
                  </div>
                  <CatalogActiveToggle
                    kind="decoration"
                    itemId={decoration.id}
                    itemName={decoration.name}
                    active={decoration.active}
                  />
                  <CatalogItemDialog
                    kind="decoration"
                    itemId={decoration.id}
                    name={decoration.name}
                    description={decoration.description}
                    priceCents={decoration.priceCents}
                    sortOrder={decoration.sortOrder}
                    active={decoration.active}
                    icon={decoration.icon}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10.5px] text-mocha">
        <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
        Prices are in USD. Changes are saved to the live database.
      </div>
    </div>
  );
}
