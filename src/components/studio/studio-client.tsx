"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronDown,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { saveDesignAction } from "@/app/actions/designs";
import { CakePreview } from "@/components/cake/CakePreview";
import { captureCakeThumbnail } from "@/components/cake/capture";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input, Label } from "@/components/ui/form";
import { configKey, resolveDesign } from "@/lib/pricing";
import { cn, formatPrice } from "@/lib/utils";
import type { Catalog, DesignConfig } from "@/lib/types";
import { DesignControls } from "./design-controls";
import { DesignProvider, useDesignStore } from "./design-store";

const DRAFT_KEY = "ycake:studio-draft:v1";

type InitialSource = "default" | "preset" | "design";

type StudioClientProps = {
  catalog: Catalog;
  initialConfig: DesignConfig;
  initialName: string;
  initialSavedId: string | null;
  initialSource: InitialSource;
  isAuthenticated: boolean;
};

export function StudioClient(props: StudioClientProps) {
  if (
    !props.catalog.sizes.length ||
    !props.catalog.flavors.length ||
    !props.catalog.frostings.length
  ) {
    return (
      <div className="container-page py-20 text-center">
        <Sparkles
          className="mx-auto h-6 w-6 text-gold"
          aria-hidden="true"
        />
        <h2 className="mt-5 font-display text-3xl">The studio is resting.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mocha">
          Our bakers are updating the options. Please check back shortly, or
          explore the collection for inspiration.
        </p>
        <Link
          href="/gallery"
          className={cn(buttonVariants({ variant: "secondary" }), "mt-6")}
        >
          Explore the collection
        </Link>
      </div>
    );
  }

  return (
    <DesignProvider
      initialConfig={props.initialConfig}
      initialName={props.initialName}
      initialSavedId={props.initialSavedId}
      catalog={props.catalog}
    >
      <StudioWorkspace {...props} />
    </DesignProvider>
  );
}

function StudioWorkspace({
  catalog,
  initialSource,
  initialName,
  isAuthenticated,
}: StudioClientProps) {
  const router = useRouter();
  const config = useDesignStore((state) => state.config);
  const designName = useDesignStore((state) => state.name);
  const savedId = useDesignStore((state) => state.savedId);
  const savedConfigKey = useDesignStore((state) => state.savedConfigKey);
  const savedName = useDesignStore((state) => state.savedName);
  const setName = useDesignStore((state) => state.setName);
  const replaceConfig = useDesignStore((state) => state.replaceConfig);
  const markSaved = useDesignStore((state) => state.markSaved);

  const [dialogMode, setDialogMode] = useState<"save" | "order" | null>(
    null,
  );
  const [nameInput, setNameInput] = useState(initialName);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const hydratedRef = useRef(initialSource !== "default");
  const firstPersistRef = useRef(true);

  const resolved = useMemo(
    () => resolveDesign(config, catalog),
    [catalog, config],
  );

  useEffect(() => {
    if (initialSource !== "default") {
      return;
    }

    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as {
          config?: Partial<DesignConfig>;
          name?: unknown;
        };
        const maybeConfig = draft?.config;
        if (
          maybeConfig &&
          typeof maybeConfig === "object" &&
          typeof maybeConfig.sizeId === "string" &&
          Array.isArray(maybeConfig.tiers) &&
          typeof maybeConfig.frostingId === "string" &&
          typeof maybeConfig.finish === "string" &&
          Array.isArray(maybeConfig.decorationIds) &&
          typeof maybeConfig.inscription === "string"
        ) {
          replaceConfig(maybeConfig as DesignConfig);
        }
        if (
          typeof draft?.name === "string" &&
          draft.name.trim().length >= 2
        ) {
          setName(draft.name.trim().slice(0, 60));
        }
      }
    } catch {
      // A malformed or unavailable draft should never block the studio.
    }

    hydratedRef.current = true;
  }, [initialSource, replaceConfig, setName]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }
    if (firstPersistRef.current) {
      firstPersistRef.current = false;
      return;
    }

    const timeout = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ config, name: designName }),
        );
      } catch {
        // Local drafts are a convenience; saving still works without them.
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [config, designName]);

  const persistDraftNow = useCallback(() => {
    try {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ config, name: designName }),
      );
    } catch {
      // Ignore storage failures.
    }
  }, [config, designName]);

  if (!resolved) {
    return (
      <div className="container-page py-20 text-center">
        <h2 className="font-display text-3xl">This cake needs a refresh.</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-mocha">
          Some of the options in this design are no longer available. Start
          again with the current collection.
        </p>
        <Link href="/studio" className={cn(buttonVariants(), "mt-6")}>
          Start a fresh design
        </Link>
      </div>
    );
  }

  const isSaved =
    Boolean(savedId) &&
    configKey(config) === savedConfigKey &&
    designName === savedName;
  const hasSavedVersion = Boolean(savedId);

  const openSaveDialog = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setNameInput(designName);
    setDialogError(null);
    setDialogMode("save");
  };

  const openOrderDialog = () => {
    if (!isAuthenticated) {
      setAuthOpen(true);
      return;
    }
    setNameInput(designName);
    setDialogError(null);
    setDialogMode("order");
  };

  const handleDialogSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    if (!dialogMode) {
      return;
    }

    const trimmed = nameInput.trim();
    if (trimmed.length < 2) {
      setDialogError("Give your cake a name of at least 2 characters.");
      return;
    }

    setPending(true);
    setDialogError(null);

    try {
      setName(trimmed);
      const thumbnail = captureCakeThumbnail();
      const result = await saveDesignAction({
        id: savedId ?? undefined,
        name: trimmed,
        config: resolved.config,
        thumbnail,
      });

      if (result.error || !result.id) {
        setDialogError(
          result.error ?? "Your design could not be saved. Please try again.",
        );
        return;
      }

      markSaved(result.id, result.name ?? trimmed);
      setDialogMode(null);

      if (dialogMode === "order") {
        router.push(`/checkout/${result.id}`);
        return;
      }

      toast.success("Design saved", {
        description: "Find it any time in your account.",
        action: {
          label: "View",
          onClick: () => router.push("/account"),
        },
      });
    } catch {
      setDialogError(
        "Something went wrong while saving. Please check your connection and try again.",
      );
    } finally {
      setPending(false);
    }
  };

  const summary = (
    <SummaryCard
      resolved={resolved}
      saved={isSaved}
      hasSavedVersion={hasSavedVersion}
      onSave={openSaveDialog}
      onOrder={openOrderDialog}
    />
  );

  return (
    <>
      <div className="container-page py-7 lg:py-10">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.03fr)] lg:items-start lg:gap-10 xl:gap-14">
          <div className="mx-auto w-full max-w-[580px] lg:sticky lg:top-[92px]">
            <div className="relative h-[52svh] min-h-[340px] max-h-[480px] overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b from-rose-soft/35 via-[#f8f1e6] to-sage-soft/45 shadow-soft sm:h-[56svh] lg:h-[clamp(360px,48vh,450px)] lg:max-h-none">
              <CakePreview resolved={resolved} enableZoom />
              <div className="pointer-events-none absolute right-3 top-3 max-w-[46%] truncate rounded-full border border-white/60 bg-cream/80 px-3 py-1.5 text-[9.5px] font-medium uppercase tracking-[0.14em] text-cocoa shadow-soft backdrop-blur-md sm:right-4 sm:top-4">
                {initialSource === "preset"
                  ? `Starting point · ${initialName}`
                  : initialSource === "design"
                    ? "Editing a saved design"
                    : "Live preview"}
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 text-[10.5px] text-mocha">
              <span className="hidden sm:inline">
                Drag to rotate · Scroll to zoom
              </span>
              <span className="sm:hidden">Drag to rotate</span>
              <span>
                {resolved.size.name} · Serves {resolved.servings}
              </span>
            </div>

            <div className="mt-5 hidden lg:block">{summary}</div>
          </div>

          <div className="mx-auto w-full max-w-[660px]">
            <div className="rounded-2xl border border-sand/80 bg-cream px-4 py-6 shadow-[0_1px_0_rgba(44,33,27,0.03)] sm:px-6 sm:py-7 lg:px-7">
              <DesignControls catalog={catalog} />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-sand/80 bg-cream/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_40px_-28px_rgba(44,33,27,0.5)] backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2.5">
          <div className="min-w-0 flex-1">
            <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-mocha">
              Estimated total
            </p>
            <p className="mt-0.5 font-display text-[24px] leading-none text-espresso">
              {formatPrice(resolved.price.totalCents)}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={openSaveDialog}
            disabled={isSaved}
            aria-label={isSaved ? "Design saved" : "Save design"}
          >
            {isSaved ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Bookmark className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <Button
            type="button"
            onClick={openOrderDialog}
            className="min-w-0 flex-[1.4]"
          >
            Request this cake
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open && !pending) {
            setDialogMode(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogTitle>
            {dialogMode === "order" ? (
              <>
                Make it{" "}
                <span className="serif-italic text-rose">official.</span>
              </>
            ) : (
              <>
                Name your{" "}
                <span className="serif-italic text-rose">cake.</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {dialogMode === "order"
              ? "Save this design to your account, then choose a pickup date and window."
              : "Keep this design in your account so you can return to it, or request it for pickup."}
          </DialogDescription>

          <form onSubmit={handleDialogSubmit} className="mt-6" noValidate>
            <Label htmlFor="design-name">Design name</Label>
            <Input
              id="design-name"
              value={nameInput}
              onChange={(event) => {
                setNameInput(event.target.value);
                setDialogError(null);
              }}
              maxLength={60}
              placeholder="Mira's garden cake"
              autoFocus
            />
            <p className="mt-1.5 text-[11.5px] text-mocha">
              Just for you — our bakers see it with your request.
            </p>

            <div className="mt-4 flex items-center justify-between gap-4 rounded-xl border border-sand/80 bg-porcelain/70 p-3.5">
              <div>
                <p className="text-[9.5px] font-medium uppercase tracking-[0.16em] text-mocha">
                  Estimated total
                </p>
                <p className="mt-1 font-display text-[26px] leading-none text-espresso">
                  {formatPrice(resolved.price.totalCents)}
                </p>
              </div>
              <p className="text-right text-[10.5px] leading-relaxed text-mocha">
                {resolved.size.name}
                <br />
                Serves {resolved.servings} · Pay at pickup
              </p>
            </div>

            {dialogError ? (
              <div
                role="alert"
                className="mt-3 rounded-xl border border-danger/15 bg-danger-soft/60 px-3.5 py-2.5 text-[12px] leading-relaxed text-danger"
              >
                {dialogError}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setDialogMode(null)}
                disabled={pending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={pending || nameInput.trim().length < 2}
              >
                {pending ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                    Saving
                  </>
                ) : dialogMode === "order" ? (
                  <>
                    Continue to pickup
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </>
                ) : (
                  <>
                    Save design
                    <Bookmark className="h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={authOpen} onOpenChange={setAuthOpen}>
        <DialogContent className="max-w-md">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-porcelain text-espresso">
            <Lock className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <DialogTitle className="mt-4">
            Keep this{" "}
            <span className="serif-italic text-rose">cake.</span>
          </DialogTitle>
          <DialogDescription>
            Sign in to save your design and request a pickup. Your choices stay
            on this device while you do.
          </DialogDescription>

          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/login?next=/studio"
              onClick={persistDraftNow}
              className={buttonVariants({ size: "lg" })}
            >
              Sign in
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/register?next=/studio"
              onClick={persistDraftNow}
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
              })}
            >
              Create an account
            </Link>
          </div>

          <p className="mt-4 text-center text-[11px] leading-relaxed text-mocha">
            No payment is taken online. Every pickup is confirmed by a baker.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SummaryCard({
  resolved,
  saved,
  hasSavedVersion,
  onSave,
  onOrder,
}: {
  resolved: NonNullable<ReturnType<typeof resolveDesign>>;
  saved: boolean;
  hasSavedVersion: boolean;
  onSave: () => void;
  onOrder: () => void;
}) {
  const { price } = resolved;

  return (
    <div className="rounded-2xl border border-sand/80 bg-cream p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow">Estimated total</p>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium uppercase tracking-[0.1em]",
                saved
                  ? "bg-sage-soft/70 text-[#56664e]"
                  : hasSavedVersion
                    ? "bg-gold-soft/30 text-cocoa"
                    : "bg-porcelain text-mocha",
              )}
            >
              {saved ? (
                <Check className="h-2.5 w-2.5" aria-hidden="true" />
              ) : (
                <span className="h-1 w-1 rounded-full bg-current" />
              )}
              {saved
                ? "Saved"
                : hasSavedVersion
                  ? "Unsaved changes"
                  : "Draft"}
            </span>
          </div>
          <p className="mt-2 font-display text-[2.25rem] leading-none tracking-[-0.03em] text-espresso">
            {formatPrice(price.totalCents)}
          </p>
        </div>
        <div className="pt-1 text-right text-[10.5px] leading-relaxed text-mocha">
          <p>{resolved.size.name}</p>
          <p>Serves {resolved.servings}</p>
        </div>
      </div>

      <PriceDetails price={price} />

      <div className="mt-4 grid gap-2">
        <Button type="button" size="lg" onClick={onOrder} className="w-full">
          Request this cake
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onSave}
          disabled={saved}
          className="w-full"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Design saved
            </>
          ) : (
            <>
              <Bookmark className="h-4 w-4" aria-hidden="true" />
              {hasSavedVersion ? "Save changes" : "Save design"}
            </>
          )}
        </Button>
      </div>

      <p className="mt-3 text-center text-[10px] text-mocha">
        No payment now · Pay at pickup
      </p>
    </div>
  );
}

function PriceDetails({
  price,
}: {
  price: NonNullable<ReturnType<typeof resolveDesign>>["price"];
}) {
  const rows = [
    { label: "Base cake", cents: price.baseCents },
    { label: "Flavor upgrades", cents: price.flavorsCents },
    { label: "Frosting", cents: price.frostingCents },
    { label: "Finish", cents: price.finishCents },
    { label: "Decorations", cents: price.decorationsCents },
    { label: "Plaque", cents: price.inscriptionCents },
  ].filter((row) => row.cents > 0 || row.label === "Base cake");

  return (
    <details className="group mt-4 border-t border-sand/70 pt-3">
      <summary className="flex cursor-pointer items-center justify-between gap-3 text-[10.5px] text-mocha transition-colors hover:text-espresso">
        <span>Price details</span>
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <dl className="mt-2.5 space-y-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-4">
            <dt className="text-[11px] text-mocha">{row.label}</dt>
            <dd className="text-[11px] text-cocoa">
              {formatPrice(row.cents)}
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
