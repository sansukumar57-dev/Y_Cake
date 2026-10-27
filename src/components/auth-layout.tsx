import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CakeIllustration } from "@/components/cake/CakeIllustration";
import type { PresetView } from "@/lib/types";

export function AuthLayout({
  eyebrow,
  title,
  lede,
  preset,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  preset: PresetView | null;
  children: React.ReactNode;
}) {
  return (
    <div className="container-page py-10 sm:py-16 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-[12px] text-mocha transition-colors hover:text-espresso"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            Back to the atelier
          </Link>
          <p className="eyebrow mt-10">{eyebrow}</p>
          <h1 className="mt-4 font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.98] tracking-[-0.04em]">
            {title}
          </h1>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-cocoa">
            {lede}
          </p>
          <div className="mt-8">{children}</div>
        </div>

        <div className="relative hidden overflow-hidden rounded-2xl border border-sand/70 bg-gradient-to-b from-rose-soft/40 via-porcelain to-sage-soft/50 lg:block">
          <div className="absolute left-8 top-8">
            <p className="eyebrow">The atelier</p>
            <p className="mt-2 max-w-[10rem] font-display text-xl leading-tight text-espresso">
              A cake, composed with care.
            </p>
          </div>
          {preset ? (
            <CakeIllustration
              resolved={preset.resolved}
              className="h-full w-full"
              showHalo={false}
            />
          ) : null}
          <div className="absolute inset-x-6 bottom-6 rounded-xl border border-white/60 bg-cream/85 p-4 backdrop-blur-md">
            <p className="font-display text-[15px] leading-snug text-espresso">
              “It felt less like ordering a cake and more like making one.”
            </p>
            <p className="mt-2 text-[10.5px] uppercase tracking-[0.16em] text-mocha">
              Yara Kim · Founder & baker
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
