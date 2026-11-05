import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPresets } from "@/lib/data";
import { PresetCard } from "@/components/preset-card";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "The cakes",
  description:
    "Six starting points from the Y Cake Atelier studio — or begin with a blank cake and make it yours.",
};

export default async function GalleryPage() {
  const presets = await getPresets();

  return (
    <div className="container-page py-14 sm:py-20">
      <div className="flex flex-col gap-8 border-b border-sand/80 pb-10 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Cakes &amp; more</p>
          <h1 className="mt-4 font-display text-[clamp(2.8rem,6vw,4.8rem)] leading-[0.98] tracking-[-0.04em]">
            Six cakes to start from.{" "}
            <span className="serif-italic text-rose">Make them yours.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-[1.75] text-cocoa">
            These are cakes we love, not rules. Open any design in the studio,
            change the palette, swap a flavor, add a layer — then call it yours.
          </p>
        </div>
        <Link
          href="/studio"
          className={`${buttonVariants({ size: "lg" })} shrink-0`}
        >
          Start from blank
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {presets.map((preset, index) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            index={index}
            showDescription
          />
        ))}
      </div>

      <div className="relative mt-16 overflow-hidden rounded-[2.5rem] bg-chocolate-deep text-cream">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(80% 120% at 10% 0%, rgba(201,139,132,0.26), transparent 60%), radial-gradient(70% 110% at 95% 100%, rgba(217,194,155,0.16), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="font-display text-2xl text-cream sm:text-[1.8rem]">
              Nothing here quite right?
            </h2>
            <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-cream/65">
              That is rather the point. Start with a blank cake and build it
              from the tiers up.
            </p>
          </div>
          <Link
            href="/studio"
            className={buttonVariants({ variant: "light", size: "md" })}
          >
            Open the studio
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
