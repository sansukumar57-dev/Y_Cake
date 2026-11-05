import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { StudioClient } from "@/components/studio/studio-client";
import { getSessionUser } from "@/lib/auth";
import {
  getCatalog,
  getDesignForStudio,
  getPreset,
} from "@/lib/data";
import { createDefaultConfig, resolveDesign, suggestDesignName } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Design studio",
  description:
    "Compose every tier, flavor, color, and decoration in the Y Cake Atelier 3D cake studio. See your cake and estimate update as you go.",
};

function firstValue(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }
  return Array.isArray(value) ? value[0] : undefined;
}

export default async function StudioPage({
  searchParams,
}: {
  searchParams: Promise<{
    preset?: string | string[];
    design?: string | string[];
    unavailable?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const presetId = firstValue(params.preset);
  const designId = firstValue(params.design);
  const unavailable = firstValue(params.unavailable);
  const [catalog, user] = await Promise.all([
    getCatalog(),
    getSessionUser(),
  ]);

  let initialConfig = createDefaultConfig(catalog);
  let initialName = "";
  let initialSavedId: string | null = null;
  let initialSource: "default" | "preset" | "design" = "default";

  if (designId) {
    if (!user) {
      redirect(
        `/login?next=${encodeURIComponent(`/studio?design=${encodeURIComponent(designId)}`)}`,
      );
    }

    const design = await getDesignForStudio(designId, user.id);
    if (!design || !design.resolved) {
      redirect("/studio?unavailable=1");
    }

    initialConfig = design.config;
    initialName = design.name;
    initialSavedId = design.id;
    initialSource = "design";
  } else if (presetId) {
    const preset = await getPreset(presetId);
    if (preset) {
      initialConfig = preset.resolved.config;
      initialName = preset.name;
      initialSource = "preset";
    }
  }

  const resolved = resolveDesign(initialConfig, catalog);
  if (resolved) {
    initialConfig = resolved.config;
  }
  if (!initialName) {
    initialName = resolved ? suggestDesignName(resolved) : "My cake";
  }

  return (
    <div className="pb-24 lg:pb-0">
      <section className="border-b border-sand/60 bg-gradient-to-b from-porcelain/80 via-cream to-cream">
        <div className="container-page flex flex-col gap-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-9">
          <div>
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-7 bg-gold" aria-hidden="true" />
              The atelier studio
            </p>
            <h1 className="mt-3 font-display text-[clamp(2.15rem,4.5vw,3.1rem)] leading-[0.98] tracking-[-0.045em]">
              Compose your{" "}
              <span className="serif-italic text-rose">cake.</span>
            </h1>
          </div>
          <p className="max-w-xs text-[12.5px] leading-relaxed text-mocha sm:text-right">
            Every choice updates the cake and the estimate in real time.
            Nothing is charged today — every pickup is confirmed by a baker.
          </p>
        </div>
      </section>

      {unavailable ? (
        <div className="container-page pt-5">
          <p
            role="status"
            className="rounded-xl border border-gold/20 bg-gold-soft/20 px-4 py-3 text-[12.5px] leading-relaxed text-cocoa"
          >
            That saved design is no longer available, so we have started a fresh
            one for you. Your account still has your other designs.
          </p>
        </div>
      ) : null}

      <StudioClient
        catalog={catalog}
        initialConfig={initialConfig}
        initialName={initialName}
        initialSavedId={initialSavedId}
        initialSource={initialSource}
        isAuthenticated={Boolean(user)}
      />
    </div>
  );
}
