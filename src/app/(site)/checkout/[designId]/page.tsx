import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CakeIllustration } from "@/components/cake/CakeIllustration";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import {
  addDaysIso,
  formatShortDate,
  getMaxPickupDate,
  getMinPickupDate,
} from "@/lib/dates";
import { getDesignForCheckout } from "@/lib/data";
import { cn, formatPrice, tierLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pickup details",
  description:
    "Choose a pickup date and share your contact details for a Y Cake Atelier request.",
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ designId: string }>;
}) {
  const { designId } = await params;
  const user = await requireUser(`/checkout/${designId}`);
  const design = await getDesignForCheckout(designId, user.id);

  if (!design) {
    notFound();
  }

  if (!design.resolved) {
    return (
      <div className="container-page py-20 text-center">
        <Sparkles className="mx-auto h-5 w-5 text-gold" aria-hidden="true" />
        <h1 className="mt-4 font-display text-4xl">
          This cake needs a fresh start.
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mocha">
          Some of the options in this design are no longer available. Open the
          studio to recreate it with the current collection.
        </p>
        <Link href="/studio" className={cn(buttonVariants(), "mt-6")}>
          Open the studio
        </Link>
      </div>
    );
  }

  const resolved = design.resolved;
  const rows = [
    { label: "Base cake", cents: resolved.price.baseCents },
    { label: "Flavor upgrades", cents: resolved.price.flavorsCents },
    { label: "Frosting", cents: resolved.price.frostingCents },
    { label: "Finish", cents: resolved.price.finishCents },
    { label: "Decorations", cents: resolved.price.decorationsCents },
    { label: "Plaque", cents: resolved.price.inscriptionCents },
  ].filter((row) => row.cents > 0 || row.label === "Base cake");

  return (
    <>
      <section className="border-b border-sand/60 bg-gradient-to-b from-porcelain/80 via-cream to-cream">
        <div className="container-page py-8 sm:py-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-7 bg-gold" aria-hidden="true" />
                Pickup request
              </p>
              <h1 className="mt-3 font-display text-[clamp(2.3rem,5vw,3.4rem)] leading-[0.98] tracking-[-0.045em]">
                One last <span className="serif-italic text-rose">detail.</span>
              </h1>
              <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-mocha">
                Tell us when you would like to collect your cake. We will email
                within one working day to confirm the pickup.
              </p>
            </div>
            <Link
              href={`/studio?design=${design.id}`}
              className="inline-flex items-center gap-2 text-[12px] text-mocha transition-colors hover:text-espresso"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to the studio
            </Link>
          </div>

          <ol className="mt-7 grid grid-cols-3 gap-2 border-t border-sand/70 pt-4 text-[10.5px]">
            <li className="flex items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-espresso text-cream">
                <Check className="h-3 w-3" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-medium text-espresso">Design</span>
                <span className="hidden text-mocha sm:block">Saved</span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-espresso bg-cream font-medium text-espresso">
                2
              </span>
              <span>
                <span className="block font-medium text-espresso">Pickup</span>
                <span className="hidden text-mocha sm:block">Now</span>
              </span>
            </li>
            <li className="flex items-center gap-2 text-mocha">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-sand bg-cream">
                3
              </span>
              <span>
                <span className="block">Confirmation</span>
                <span className="hidden sm:block">By email</span>
              </span>
            </li>
          </ol>
        </div>
      </section>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1.12fr_0.88fr] lg:items-start lg:gap-12 lg:py-14">
        <CheckoutForm
          designId={design.id}
          totalCents={resolved.price.totalCents}
          defaultName={user.name}
          defaultEmail={user.email}
          minPickupDate={getMinPickupDate()}
          maxPickupDate={getMaxPickupDate()}
          defaultPickupDate={addDaysIso(7)}
        />

        <aside className="lg:sticky lg:top-[96px]">
          <div className="overflow-hidden rounded-2xl border border-sand/80 bg-cream shadow-soft">
            <div className="relative aspect-[4/3] bg-gradient-to-b from-rose-soft/30 via-[#f8f1e6] to-sage-soft/35">
              <CakeIllustration
                resolved={resolved}
                showHalo={false}
                className="h-full w-full"
              />
              <span className="absolute right-3 top-3 rounded-full border border-white/60 bg-cream/80 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.14em] text-cocoa backdrop-blur-sm">
                {resolved.size.tiers}{" "}
                {resolved.size.tiers === 1 ? "tier" : "tiers"}
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="eyebrow text-[9.5px]">Your cake</p>
                  <h2 className="mt-2 truncate font-display text-[1.65rem] leading-none">
                    {design.name}
                  </h2>
                  <p className="mt-1.5 text-[11px] text-mocha">
                    {resolved.size.name} · Serves {resolved.servings}
                  </p>
                </div>
                <Link
                  href={`/studio?design=${design.id}`}
                  className="shrink-0 border-b border-espresso/20 pb-0.5 text-[11px] text-mocha transition-colors hover:border-espresso hover:text-espresso"
                >
                  Edit
                </Link>
              </div>

              <dl className="mt-5 space-y-2.5 border-t border-sand/70 pt-4">
                {resolved.tiers.map((tier, index) => (
                  <div
                    key={`${tier.flavor.id}-${index}`}
                    className="flex items-start gap-2.5"
                  >
                    <span
                      className="mt-1 h-3 w-3 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: tier.colorHex }}
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <dt className="text-[9.5px] uppercase tracking-[0.12em] text-mocha">
                        {tierLabel(index, resolved.tiers.length)}
                      </dt>
                      <dd className="mt-0.5 text-[12px] text-cocoa">
                        {tier.flavor.name} · {tier.colorName}
                      </dd>
                    </div>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[11px] text-mocha">Frosting</dt>
                  <dd className="text-right text-[11.5px] text-cocoa">
                    {resolved.frosting.name} · {resolved.finish.name}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-[11px] text-mocha">Decorations</dt>
                  <dd className="max-w-[62%] text-right text-[11.5px] leading-relaxed text-cocoa">
                    {resolved.decorations.length
                      ? resolved.decorations
                          .map((decoration) => decoration.name)
                          .join(", ")
                      : "None"}
                  </dd>
                </div>
                {resolved.inscription ? (
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-[11px] text-mocha">Plaque</dt>
                    <dd className="text-right font-display text-[13px] italic text-cocoa">
                      “{resolved.inscription}”
                    </dd>
                  </div>
                ) : null}
              </dl>

              <div className="mt-5 space-y-1.5 border-t border-sand/70 pt-4">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-baseline justify-between gap-4"
                  >
                    <p className="text-[11px] text-mocha">{row.label}</p>
                    <p className="text-[11px] text-cocoa">
                      {formatPrice(row.cents)}
                    </p>
                  </div>
                ))}
                <div className="flex items-baseline justify-between gap-4 pt-2">
                  <p className="text-[12px] font-medium text-espresso">
                    Estimated total
                  </p>
                  <p className="font-display text-[25px] leading-none text-espresso">
                    {formatPrice(resolved.price.totalCents)}
                  </p>
                </div>
              </div>

              <p className="mt-4 rounded-lg bg-porcelain/70 px-3 py-2.5 text-[10.5px] leading-relaxed text-mocha">
                Your card is not charged online. Pay at pickup once the bakery
                confirms your request.
              </p>
            </div>
          </div>

          <p className="mt-4 px-1 text-center text-[10.5px] leading-relaxed text-mocha">
            Pickup at 84 Wythe Avenue, Brooklyn. Date shown as{" "}
            {formatShortDate(addDaysIso(7))} by default; you can change it.
          </p>
        </aside>
      </div>
    </>
  );
}
