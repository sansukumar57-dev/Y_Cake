import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CakeSlice,
  ChefHat,
  ChevronRight,
  Heart,
  Leaf,
  MoveUpRight,
  Plus,
  Sparkles,
  Star,
  Timer,
} from "lucide-react";
import { getFeaturedPresets, getPresets } from "@/lib/data";
import { CakePreview } from "@/components/cake/CakePreview";
import { CakeIllustration } from "@/components/cake/CakeIllustration";
import { PresetCard } from "@/components/preset-card";
import { buttonVariants } from "@/components/ui/button";
import { formatPrice, initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cakes & more, freshly baked — Brooklyn",
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

const whyItems = [
  {
    icon: Leaf,
    title: "Real ingredients",
    body: "Butter, cream, vanilla, and fruit in season. Nothing artificial, ever.",
  },
  {
    icon: ChefHat,
    title: "Baked in-house",
    body: "One small kitchen in Brooklyn bakes and finishes every cake by hand.",
  },
  {
    icon: Timer,
    title: "Ready in three days",
    body: "Most cakes need three days' notice; larger designs a fortnight.",
  },
  {
    icon: Heart,
    title: "Loved by guests",
    body: "50,000+ cakes have left our kitchen since the first bake in 2015.",
  },
];

const reviews = [
  {
    name: "Anna Petrova",
    date: "12 May",
    quote:
      "The chocolate truffle was soft, airy, and not too sweet. It disappeared in minutes — we are already planning the next one.",
  },
  {
    name: "Igor Stevens",
    date: "26 May",
    quote:
      "They helped me choose the tiers and the inscription, and pickup took two minutes. Everything was boxed and ready.",
  },
  {
    name: "Maria Rossi",
    date: "3 Jun",
    quote:
      "We asked for a garden cake for a small wedding. It looked exactly like the studio preview and tasted even better.",
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

function StarRow({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-1 ${className ?? ""}`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className="h-3.5 w-3.5 fill-gold text-gold"
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default async function HomePage() {
  const [featured, allPresets] = await Promise.all([
    getFeaturedPresets(3),
    getPresets(),
  ]);
  const hero = featured[0] ?? allPresets[0] ?? null;
  const popular = allPresets.slice(0, 4);
  const studioPreset = allPresets[4] ?? allPresets[1] ?? null;

  const startTiles = [
    {
      href: "/gallery",
      title: "The cakes",
      subtitle: "Six designs to start from",
      icon: CakeSlice,
      tone: "bg-rose-soft/60",
    },
    {
      href: "/studio",
      title: "Blank canvas",
      subtitle: "Compose your own tiers",
      icon: Sparkles,
      tone: "bg-sage-soft/70",
    },
    ...(hero
      ? [
          {
            href: `/studio?preset=${hero.id}`,
            title: hero.name,
            subtitle: "The signature cake",
            icon: Star,
            tone: "bg-gold-soft/50",
          },
        ]
      : []),
  ];

  return (
    <>
      <section className="hero-wash relative overflow-hidden">
        <div className="container-page grid items-center gap-12 pb-20 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-28 lg:pt-16">
          <div className="animate-rise max-w-xl">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              Cakes &amp; more · Brooklyn
            </p>
            <h1 className="mt-6 font-display text-[clamp(3rem,7.2vw,5.4rem)] leading-[0.94] tracking-[-0.045em] text-espresso">
              Freshly baked cakes,{" "}
              <span className="serif-italic text-rose">made with love.</span>
            </h1>
            <p className="mt-7 max-w-md text-[15.5px] leading-[1.75] text-cocoa">
              Layer by layer, build a cake that feels entirely yours — then
              leave the baking to us. Small-batch, made to order, and picked up
              fresh in Brooklyn.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/studio" className={buttonVariants({ size: "lg" })}>
                Design your cake
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/gallery"
                className={buttonVariants({ variant: "secondary", size: "lg" })}
              >
                Browse the cakes
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
              <StarRow />
              <p className="text-[12.5px] text-cocoa">
                <span className="font-semibold text-espresso">4.9</span>
                <span className="text-mocha"> · 128 guest reviews</span>
              </p>
              <span
                className="hidden h-1 w-1 rounded-full bg-gold sm:block"
                aria-hidden="true"
              />
              <p className="flex items-center gap-2 text-[12.5px] text-cocoa">
                <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                Small-batch · Pickup in Brooklyn
              </p>
            </div>
          </div>

          <div className="animate-fade delay-2 relative mx-auto w-full max-w-[540px]">
            <div className="arch-frame relative aspect-[4/5] overflow-hidden border border-white/70 bg-gradient-to-b from-rose-soft/45 via-cream to-sage-soft/55 shadow-soft">
              {hero ? (
                <>
                  <CakePreview resolved={hero.resolved} />
                  <span className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/60 bg-cream/85 px-3 py-1.5 text-[9.5px] font-medium uppercase tracking-[0.16em] text-cocoa shadow-soft backdrop-blur-md">
                    The signature
                  </span>
                  <Link
                    href={`/studio?preset=${hero.id}`}
                    className="group absolute inset-x-4 bottom-4 z-10 flex items-center justify-between gap-4 rounded-xl border border-white/70 bg-cream/92 p-4 shadow-lift backdrop-blur-md transition-colors hover:border-mocha/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-display text-[1.3rem] leading-none text-espresso">
                        {hero.name}
                      </span>
                      <span className="mt-1.5 block text-[11px] text-mocha">
                        {hero.resolved.size.tiers} tiers · serves{" "}
                        {hero.resolved.servings}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-[14px] font-semibold text-espresso">
                        {formatPrice(hero.resolved.price.totalCents)}
                      </span>
                      <span
                        className="grid h-9 w-9 place-items-center rounded-full bg-chocolate text-cream transition-transform duration-200 group-hover:scale-105"
                        aria-hidden="true"
                      >
                        <Plus className="h-4 w-4" />
                      </span>
                    </span>
                  </Link>
                </>
              ) : (
                <div className="flex h-full items-center justify-center p-10 text-center font-display text-2xl text-cocoa">
                  Your cake begins here.
                </div>
              )}
            </div>
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

      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-3">
          {startTiles.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group flex items-center gap-4 rounded-2xl border border-sand/70 bg-[#fffdfa] p-4 transition-colors hover:border-mocha/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-cream"
            >
              <span
                className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${tile.tone}`}
              >
                <tile.icon className="h-5 w-5 text-espresso" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium text-espresso">
                  {tile.title}
                </span>
                <span className="mt-0.5 block truncate text-[11.5px] text-mocha">
                  {tile.subtitle}
                </span>
              </span>
              <ChevronRight
                className="h-4 w-4 shrink-0 text-mocha transition-transform duration-200 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>

      {popular.length ? (
        <section id="popular" className="border-y border-sand/60 bg-porcelain/70">
          <div className="container-page py-20 sm:py-24">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <p className="eyebrow">Popular right now</p>
                <h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[1.02] tracking-[-0.035em]">
                  Cakes people{" "}
                  <span className="serif-italic text-mocha">
                    keep coming back to.
                  </span>
                </h2>
              </div>
              <Link
                href="/gallery"
                className="group inline-flex w-fit items-center gap-2 border-b border-espresso/20 pb-1 text-[13px] text-espresso transition-colors hover:border-espresso"
              >
                See all cakes
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {popular.map((preset, index) => (
                <PresetCard key={preset.id} preset={preset} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="container-page py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-chocolate-deep text-cream">
          <div
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(80% 120% at 15% 0%, rgba(201,139,132,0.28), transparent 60%), radial-gradient(70% 110% at 90% 100%, rgba(217,194,155,0.18), transparent 60%)",
            }}
            aria-hidden="true"
          />
          <div className="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14 lg:px-16 lg:py-14">
            <div>
              <p className="eyebrow text-cream/50">
                Special cakes for special moments
              </p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4.2vw,3.1rem)] leading-[1.04] tracking-[-0.035em] text-cream">
                Birthdays, weddings, or a quiet Tuesday —{" "}
                <span className="serif-italic text-gold-soft">
                  we&apos;ll bake the cake.
                </span>
              </h2>
              <p className="mt-5 max-w-md text-[14px] leading-relaxed text-cream/65">
                Composed by you in the studio, finished by hand the morning of
                your pickup.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Link
                  href="/studio"
                  className={buttonVariants({ variant: "light", size: "lg" })}
                >
                  Order now
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <p className="text-[11.5px] text-cream/50">
                  Most cakes need 3 days&apos; notice
                </p>
              </div>
            </div>
            <div className="mx-auto w-full max-w-[360px]">
              {studioPreset ? (
                <div className="rounded-3xl bg-blush/95 p-1 shadow-lift">
                  <div className="overflow-hidden rounded-[1.25rem] bg-gradient-to-b from-blush-soft to-blush">
                    <CakeIllustration
                      resolved={studioPreset.resolved}
                      className="h-full w-full"
                      showHalo={false}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sand/60 bg-blush-soft/70">
        <div className="container-page py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">Why Y Cake</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.4rem)] leading-[1.02] tracking-[-0.035em]">
              Baked the long way,{" "}
              <span className="serif-italic text-rose">on purpose.</span>
            </h2>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {whyItems.map((item) => (
              <div key={item.title}>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-cream text-chocolate shadow-soft">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-xl leading-tight text-espresso">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-cocoa">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="container-page py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,4.4vw,3.3rem)] leading-[1.02] tracking-[-0.035em]">
              Kind words,{" "}
              <span className="serif-italic text-rose">warm cakes.</span>
            </h2>
            <div className="mt-6 flex items-center gap-4">
              <p className="font-display text-[3.2rem] leading-none tracking-[-0.03em] text-espresso">
                4.9
              </p>
              <div>
                <StarRow />
                <p className="mt-1.5 text-[11.5px] text-mocha">
                  128 guest reviews
                </p>
              </div>
            </div>
            <div className="mt-7">
              <a
                href="mailto:hello@ycakeatelier.com?subject=My%20review"
                className={buttonVariants({ variant: "secondary", size: "md" })}
              >
                Leave a review
              </a>
            </div>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <figure
                key={review.name}
                className="rounded-2xl border border-sand/70 bg-[#fffdfa] p-5 sm:p-6"
              >
                <div
                  className="flex items-center gap-1"
                  role="img"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="h-3.5 w-3.5 fill-gold text-gold"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <blockquote className="mt-3 text-[14px] leading-[1.7] text-cocoa">
                  “{review.quote}”
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-linen text-[11px] font-medium text-espresso">
                      {initials(review.name)}
                    </span>
                    <span className="text-[12.5px] font-medium text-espresso">
                      {review.name}
                    </span>
                  </span>
                  <span className="text-[11.5px] text-mocha">
                    {review.date}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

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

      <section className="relative overflow-hidden bg-chocolate-deep">
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
                We&apos;ll bring the cake.
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
