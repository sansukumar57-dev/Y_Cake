"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-20 sm:py-28">
      <div className="mx-auto max-w-lg text-center">
        <p className="eyebrow flex items-center justify-center gap-3">
          <span className="h-px w-6 bg-gold" aria-hidden="true" />
          Something went wrong
          <span className="h-px w-6 bg-gold" aria-hidden="true" />
        </p>
        <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,3.8rem)] leading-[0.98] tracking-[-0.045em]">
          The oven{" "}
          <span className="serif-italic text-rose">hiccuped.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-[13.5px] leading-relaxed text-mocha">
          Something did not load as it should. Try once more — your account and
          saved designs are safe.
        </p>
        {error.digest ? (
          <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-mocha/60">
            Reference {error.digest}
          </p>
        ) : null}
        <Button type="button" onClick={reset} className="mt-7">
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      </div>
    </div>
  );
}
