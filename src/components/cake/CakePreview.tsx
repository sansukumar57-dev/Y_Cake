"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MousePointer2, Pause, Play, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ResolvedDesign } from "@/lib/types";
import { CakeIllustration } from "./CakeIllustration";

const CakeScene = dynamic(() => import("./CakeScene"), {
  ssr: false,
  loading: () => null,
});

class SceneErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) {
      return null;
    }
    return this.props.children;
  }
}

function supportsWebGl() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function CakePreview({
  resolved,
  className,
  enableZoom = false,
}: {
  resolved: ResolvedDesign;
  className?: string;
  enableZoom?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!supportsWebGl()) {
      setFailed(true);
    }
  }, []);

  const description = useMemo(() => {
    const tiers = resolved.tiers
      .map(
        (tier, index) =>
          `${index === 0 ? "bottom" : index === resolved.tiers.length - 1 ? "top" : "middle"} tier ${tier.colorName.toLowerCase()} frosting with ${tier.flavor.name.toLowerCase()}`,
      )
      .join(", ");
    const decorations = resolved.decorations.length
      ? ` Decorated with ${resolved.decorations.map((item) => item.name.toLowerCase()).join(", ")}.`
      : "";
    return `Interactive 3D preview of a ${resolved.size.name.toLowerCase()} cake: ${tiers}.${decorations}${resolved.inscription ? ` Inscription: ${resolved.inscription}.` : ""}`;
  }, [resolved]);

  return (
    <div
      className={cn(
        "relative isolate h-full w-full overflow-hidden",
        className,
      )}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <CakeIllustration resolved={resolved} className="h-full w-full" />
      </div>

      <p className="sr-only">{description}</p>

      {!failed ? (
        <div className="absolute inset-0" aria-hidden="true">
          <SceneErrorBoundary onError={() => setFailed(true)}>
            <CakeScene
              key={`${resolved.size.tiers}-${resetKey}`}
              resolved={resolved}
              autoRotate={autoRotate}
              enableZoom={enableZoom}
              onInteract={() => setAutoRotate(false)}
              onReady={() => setReady(true)}
            />
          </SceneErrorBoundary>
        </div>
      ) : null}

      {!failed ? (
        <>
          <div className="pointer-events-none absolute left-4 top-4 hidden items-center gap-2 rounded-full border border-white/60 bg-cream/75 px-3 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-cocoa shadow-soft backdrop-blur-md sm:flex">
            <MousePointer2 className="h-3 w-3 text-gold" aria-hidden="true" />
            Drag to explore
          </div>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-sand/70 bg-cream/85 p-1 shadow-soft backdrop-blur-md">
            <button
              type="button"
              onClick={() => setAutoRotate((value) => !value)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-cocoa transition-colors hover:bg-porcelain hover:text-espresso"
              aria-pressed={autoRotate}
            >
              {autoRotate ? (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">
                {autoRotate ? "Pause" : "Rotate"}
              </span>
              <span className="sr-only">
                {autoRotate ? "Pause rotation" : "Resume rotation"}
              </span>
            </button>
            <span className="h-4 w-px bg-sand" aria-hidden="true" />
            <button
              type="button"
              onClick={() => {
                setResetKey((value) => value + 1);
                setReady(false);
              }}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12px] font-medium text-cocoa transition-colors hover:bg-porcelain hover:text-espresso"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
              <span className="sr-only">Reset view</span>
            </button>
          </div>
        </>
      ) : null}

      {failed ? (
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-sand/70 bg-cream/85 px-3 py-1.5 text-[11px] text-mocha shadow-soft backdrop-blur-md">
          3D preview unavailable — showing an illustration
        </p>
      ) : null}

      {!ready && !failed ? (
        <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-mocha/70">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
          Preparing cake
        </div>
      ) : null}
    </div>
  );
}
