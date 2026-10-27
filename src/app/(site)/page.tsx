import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { getFeaturedPresets, getPresets } from "@/lib/data";
import { CakePreview } from "@/components/cake/CakePreview";
import { CakeIllustration } from "@/components/cake/CakeIllustration";
import { PresetCard } from "@/components/preset-card";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Custom cakes, designed by you — Brooklyn",
  description:
    "Compose every tier, flavor, and flourish in the Y Cake Atelier 3D studio. Small-batch cakes made to order in Brooklyn and picked up fresh.",
};

const processSteps = [
  {
    number: "01",
    title: "Compose",
    body: "Choose your tiers, flavors, and flourishes in the studio. Every choice updates the cake in front of you.",
  },
  {
    number: "02",
    title: "We bake",
    body: "Your design is made by hand in small batches, then finished the morning of your pickup.",
  },
  {
    number: "03",
    title: "Gather",
    body: "Collect your cake in Brooklyn, boxed with candles and care, ready for the table.",
  },
];

const faqs = [
  {
    question: "How far ahead should I order?",
    answer:
      "Most cakes need three days' notice. Three-tier and highly detailed designs are best booked two weeks ahead. If you are planning something sooner, email us and we will see what is possible.",
  },
  {
    question: "Can you accommodate dietary needs?",
    answer:
      "We offer gluten-free and vegan variations on several flavors by request, and can work around some allergies. Our kitchen handles nuts, dairy, gluten, and eggs, so we cannot guarantee an allergen-free environment.",
  },
  {
    question: "How many people does a cake serve?",
    answer:
      "A petite single tier serves about 10, a classic two-tier cake about 24, and a grand three-tier cake about 40. We cut generous slices, so these are comfortable estimates.",
  },
  {
    question: "Can I change my design after ordering?",
    answer:
      "Yes, until five days before pickup. Email hello@ycakeatelier.com with your order number and we will update the design and price with you.",
  },
  {
    question: "Do you deliver?",
    answer:
      "Pickup is at our Wythe Avenue studio. Delivery within New York City can be arranged for larger cakes and events; ask us when you place your request.",
  },
];

export default async function HomePage() {
  const [featured, allPresets] = await Promise.all([
    getFeaturedPresets(3),
    getPresets(),
  ]);
  const hero = featured[0] ?? allPresets[0] ?? null;
  const collection = featured.length ? featured : allPresets.slice(0, 3);
  const studioPreset = allPresets[3] ?? allPresets[0] ?? null;

  return (
    <>
      <section className="hero-wash relative overflow-hidden">
        <div className="container-page grid items-center gap-12 pb-24 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-32 lg:pt-16">
          <div className="animate-rise max-w-xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              Custom cakes · Brooklyn
            </p>
            <h1 className="mt-6 font-display text-[clamp(3rem,7.2vw,5.7rem)] leading-[0.94] tracking-[-0.045em] text-espresso">
              A cake as{" "}
              <span className="serif-italic text-rose">singular</span> as the
              moment.
            </h1>
            <p className="mt-7 max-w-md text-[15.5px] leading-[1.75] text-cocoa">
              Layer by layer, build a cake that feels entirely yours — then
              leave the baking to us. Small-batch, made to order, and picked up
              fresh in Brooklyn.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/studio"
                className={buttonVariants({ size: "lg" })}
              >
                Design your cake
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/gallery"
                className={buttonVariants({ variant: "ghost", size: "lg" })}
              >
                Explore the collection
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-mocha">
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" />
                Small-batch baking
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" />
                Hand-finished
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gold" />
                Pickup in Brooklyn
              </span>
            </div>
          </div>

          <div className="animate-fade delay-2 relative mx-auto w-full max-w-[540px]">
            <div className="arch-frame relative aspect-[4/5] overflow-hidden border border-white/70 bg-gradient-to-b from-rose-soft/45 via-cream to-sage-soft/55 shadow-soft">
              {hero ? (
                <CakePreview resolved={hero.resolved} />
              ) : (
                <div className="flex h-full items-center justify-center p-10 text-center font-display text-2xl text-cocoa">
                  Your cake begins here.
                </div>
              )}
            </div>
            {hero ? (
              <Link
                href={`/studio?preset=${hero.id}`}
                className="group relative z-10 mx-auto -mt-8 block w-[86%] rounded-xl border border-sand/80 bg-cream/95 p-4 shadow-lift backdrop-blur-md transition-colors hover:border-mocha/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-mocha">
                      The signature
                    </p>
                    <p className="mt-1 font-display text-[1.35rem] leading-none text-espresso">
                      {hero.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-mocha">
                      {hero.resolved.size.tiers} tiers · serves{" "}
                      {hero.resolved.servings}
                    </p>
                    <p className="mt-1 text-[13px] font-medium text-espresso">
                      from {formatPrice(hero.resolved.price.totalCents)}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-mocha transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      <section className="border-y border-sand/70 bg-cream">
        <div className="container-page grid gap-4 py-5 text-[10.5px] font-medium uppercase tracking-[0.18em] text-mocha sm:grid-cols-3 sm:gap-0">
          <p className="sm:border-r sm:border-sand/70 sm:pr-6">
            Butter, sugar, patience
          </p>
          <p className="sm:border-r sm:border-sand/70 sm:px-6">
            Seasonal flavors, always
          </p>
          <p className="sm:pl-6">Made by hand in Brooklyn</p>
        </div>
      </section>

      {collection.length ? (
        <section className="container-page py-20 sm:py-28">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">The collection</p>
              <h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.65rem)] leading-[1.02] tracking-[-0.035em]">
                Starting points,{" "}
                <span className="serif-italic text-mocha">not prescriptions.</span>
              </h2>
            </div>
            <Link
              href="/gallery"
              className="group inline-flex w-fit items-center gap-2 border-b border-espresso/20 pb-1 text-[13px] text-espresso transition-colors hover:border-espresso"
            >
              View the full collection
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collection.map((preset, index) => (
              <PresetCard key={preset.id} preset={preset} index={index} />
            ))}
          </div>
        </section>
      ) : null}

      <section id="story" className="section-wash border-y border-sand/60">
        <div className="container-page grid gap-14 py-20 sm:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">The atelier</p>
            <h2 className="mt-4 max-w-lg font-display text-[clamp(2.2rem,4.4vw,3.5rem)] leading-[1.02] tracking-[-0.035em]">
              A studio,{" "}
              <span className="serif-italic text-sage">not a menu.</span>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.75] text-cocoa">
              Most cake menus ask you to pick a number and hope for the best. We
              would rather you see the cake take shape — its proportions, its
              palette, the exact shade of sage against blush.
            </p>
            <ul className="mt-8 space-y-3.5">
              {[
                "A live 3D cake, not a flat swatch",
                "Flavors and finishes priced as you go",
                "A real baker reviews every request",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[13.5px] text-cocoa"
                >
                  <Sparkles
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/studio"
              className={`${buttonVariants({ size: "md" })} mt-9`}
            >
              Step inside the studio
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="order-1 lg:order-2">
            {studioPreset ? (
              <div
                className="relative mx-auto max-w-[520px] rounded-2xl border border-white/70 bg-cream/90 p-3 shadow-soft"
                aria-hidden="true"
              >
                <div className="rounded-xl bg-gradient-to-b from-porcelain to-[#efe4d5] p-1">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-soft" />
                      <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                    </div>
                    <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-mocha">
                      Atelier studio
                    </span>
                    <span className="text-[10px] text-mocha">
                      {studioPreset.resolved.size.tiers} tiers
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-[#f6efe4]">
                    <CakeIllustration
                      resolved={studioPreset.resolved}
                      className="h-full w-full"
                      showHalo={false}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4 px-3 py-4">
                    <div className="flex items-center gap-2">
                      {studioPreset.resolved.tiers.map((tier) => (
                        <span
                          key={tier.colorHex + tier.flavor.id}
                          className="h-6 w-6 rounded-full border border-white/80 shadow-sm"
                          style={{ backgroundColor: tier.colorHex }}
                        />
                      ))}
                      <span className="ml-1 text-[10px] text-mocha">
                        {studioPreset.resolved.tiers
                          .map((tier) => tier.colorName)
                          .join(" / ")}
                      </span>
                    </div>
                    <span className="rounded-full bg-espresso px-3 py-2 text-[10px] font-medium text-cream">
                      {formatPrice(studioPreset.resolved.price.totalCents)}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section id="process" className="container-page py-20 sm:py-28">
        <div className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.65rem)] leading-[1.02] tracking-[-0.035em]">
            Three steps,{" "}
            <span className="serif-italic text-mocha">one lovely cake.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-10 border-t border-sand/80 pt-10 sm:grid-cols-3 sm:gap-8">
          {processSteps.map((step) => (
            <div key={step.number} className="relative">
              <p className="font-display text-4xl italic text-gold">
                {step.number}
              </p>
              <h3 className="mt-4 font-display text-2xl text-espresso">
                {step.title}
              </h3>
              <p className="mt-3 max-w-xs text-[13.5px] leading-relaxed text-cocoa">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-porcelain py-20 sm:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">Kind words</p>
            <blockquote className="mt-6 font-display text-[clamp(1.75rem,3.5vw,2.85rem)] leading-[1.18] tracking-[-0.03em] text-espresso">
              “It looked like the sketch and tasted even better. The pistachio
              tier disappeared before the toast.”
            </blockquote>
            <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.18em] text-mocha">
              Mira & Sam · A garden wedding
            </p>
          </div>
        </div>
      </section>

      <section id="faq" className="container-page py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Questions</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4.4vw,3.4rem)] leading-[1.02] tracking-[-0.035em]">
              A few things{" "}
              <span className="serif-italic text-mocha">worth knowing.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[13.5px] leading-relaxed text-cocoa">
              Still wondering about something? Write to us at{" "}
              <a
                href="mailto:hello@ycakeatelier.com"
                className="underline decoration-gold/50 underline-offset-4 transition-colors hover:text-espresso"
              >
                hello@ycakeatelier.com
              </a>
              . We answer within one working day.
            </p>
          </div>

          <div className="border-t border-sand/80">
            {faqs.map((faq) => (
              <details key={faq.question} className="group border-b border-sand/80">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-5 text-[15px] font-medium text-espresso">
                  {faq.question}
                  <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-sand transition-colors group-open:border-mocha/40">
                    <span className="absolute h-px w-3 bg-cocoa" />
                    <span className="absolute h-3 w-px bg-cocoa transition-transform duration-200 group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-6 pr-10 text-[13.5px] leading-[1.75] text-cocoa">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-espresso">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(70% 100% at 20% 0%, rgba(201,139,132,0.22), transparent 60%), radial-gradient(60% 100% at 85% 100%, rgba(138,154,128,0.16), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="container-page relative flex flex-col items-start gap-8 py-16 sm:py-20 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow text-cream/45">Your table, your way</p>
            <h2 className="mt-4 font-display text-[clamp(2.3rem,4.8vw,3.8rem)] leading-[1.02] tracking-[-0.035em] text-cream">
              You bring the occasion.{" "}
              <span className="serif-italic text-gold-soft">
                We’ll bring the cake.
              </span>
            </h2>
            <p className="mt-5 max-w-md text-[14px] leading-relaxed text-cream/65">
              Start with a palette, a flavor, or no idea at all. The studio is
              open whenever you are.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Link
              href="/studio"
              className={buttonVariants({ variant: "light", size: "lg" })}
            >
              Design your cake
              <MoveUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <p className="text-[11.5px] text-cream/45">
              Cakes from $65 · Pickup in Brooklyn
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
