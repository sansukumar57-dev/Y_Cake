import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function SiteNotFound() {
  return (
    <div className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-gold" aria-hidden="true" />
          404 · Not found
          <span className="h-px w-6 bg-gold" aria-hidden="true" />
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.7rem,7vw,4.5rem)] leading-[0.95] tracking-[-0.045em]">
          A little{" "}
          <span className="serif-italic text-rose">lost.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-[13.5px] leading-relaxed text-mocha">
          We could not find that page. Perhaps the cake is already on the table
          — or perhaps it is still waiting to be designed.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2 sm:flex-row">
          <Link href="/studio" className={buttonVariants()}>
            Open the studio
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/account"
            className={buttonVariants({ variant: "secondary" })}
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Your account
          </Link>
        </div>
      </div>
    </div>
  );
}
