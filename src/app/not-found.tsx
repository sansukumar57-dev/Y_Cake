import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center bg-cream px-5 py-16">
      <div className="max-w-lg text-center">
        <p className="eyebrow flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-gold" aria-hidden="true" />
          404 · Not found
          <span className="h-px w-6 bg-gold" aria-hidden="true" />
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.7rem,8vw,4.6rem)] leading-[0.95] tracking-[-0.045em]">
          This page has{" "}
          <span className="serif-italic text-rose">gone missing.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-[13.5px] leading-relaxed text-mocha">
          The link may be old, or the page may have moved. The studio, the
          collection, and your account are all still here.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/" className={buttonVariants()}>
            Back home
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/studio"
            className={buttonVariants({ variant: "secondary" })}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Open the studio
          </Link>
        </div>
      </div>
    </div>
  );
}
