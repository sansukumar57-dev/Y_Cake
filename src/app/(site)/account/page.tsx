import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  LogOut,
  Plus,
  Sparkles,
} from "lucide-react";
import { DeleteDesignButton } from "@/components/account/delete-design-button";
import { CakeIllustration } from "@/components/cake/CakeIllustration";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth";
import { getUserDesigns, getUserOrders, parseSnapshot } from "@/lib/data";
import { formatShortDate, getPickupSlotLabel } from "@/lib/dates";
import { cn, formatPrice, pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your account",
  description: "Your saved cake designs, pickup requests, and order history.",
};

function updatedLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function AccountPage() {
  const user = await requireUser("/account");
  const [designs, orders] = await Promise.all([
    getUserDesigns(user.id),
    getUserOrders(user.id),
  ]);
  const activeOrders = orders.filter(
    (order) => order.status !== "COMPLETED" && order.status !== "CANCELLED",
  );
  const nextPickup = [...activeOrders].sort((a, b) =>
    a.pickupDate.localeCompare(b.pickupDate),
  )[0];
  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <>
      <section className="border-b border-sand/60 bg-gradient-to-b from-porcelain/80 via-cream to-cream">
        <div className="container-page py-10 sm:py-12">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-7 bg-gold" aria-hidden="true" />
                Your account
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.5rem,5.5vw,3.8rem)] leading-[0.98] tracking-[-0.045em]">
                Hello, <span className="serif-italic text-rose">{firstName}.</span>
              </h1>
              <p className="mt-3 text-[13px] text-mocha">
                {user.email} · Pickup at 84 Wythe Avenue, Brooklyn
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link href="/studio" className={buttonVariants()}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                New design
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className={buttonVariants({ variant: "secondary" })}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </button>
              </form>
            </div>
          </div>

          <div className="mt-9 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-sand/80 bg-cream/80 p-4">
              <p className="text-[9.5px] font-medium uppercase tracking-[0.16em] text-mocha">
                Saved designs
              </p>
              <p className="mt-1.5 font-display text-3xl leading-none text-espresso">
                {designs.length}
              </p>
            </div>
            <div className="rounded-xl border border-sand/80 bg-cream/80 p-4">
              <p className="text-[9.5px] font-medium uppercase tracking-[0.16em] text-mocha">
                Open requests
              </p>
              <p className="mt-1.5 font-display text-3xl leading-none text-espresso">
                {activeOrders.length}
              </p>
            </div>
            <div className="rounded-xl border border-sand/80 bg-cream/80 p-4">
              <p className="text-[9.5px] font-medium uppercase tracking-[0.16em] text-mocha">
                Next pickup
              </p>
              <p className="mt-1.5 flex items-center gap-2 font-display text-[22px] leading-none text-espresso">
                <CalendarDays
                  className="h-4 w-4 text-gold"
                  aria-hidden="true"
                />
                {nextPickup ? formatShortDate(nextPickup.pickupDate) : "—"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page space-y-16 py-12 sm:py-16">
        <section aria-labelledby="saved-designs-heading">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="eyebrow">Your atelier</p>
              <h2
                id="saved-designs-heading"
                className="mt-3 font-display text-[clamp(1.9rem,3.5vw,2.5rem)] leading-none"
              >
                Saved designs
              </h2>
            </div>
            {designs.length ? (
              <Link
                href="/gallery"
                className="group hidden items-center gap-2 border-b border-espresso/20 pb-1 text-[12.5px] text-espresso transition-colors hover:border-espresso sm:inline-flex"
              >
                Find a starting point
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            ) : null}
          </div>

          {designs.length ? (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {designs.map((design) => {
                const resolved = design.resolved;
                const price = resolved?.price.totalCents ?? design.priceCents;
                return (
                  <article
                    key={design.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-sand/80 bg-cream transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-mocha/40"
                  >
                    <div className="relative aspect-[5/4] overflow-hidden bg-gradient-to-b from-rose-soft/30 via-[#f8f1e6] to-sage-soft/35">
                      {design.thumbnail ? (
                        <Image
                          src={design.thumbnail}
                          alt={`Preview of ${design.name}`}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover"
                        />
                      ) : resolved ? (
                        <CakeIllustration
                          resolved={resolved}
                          showHalo={false}
                          className="h-full w-full"
                        />
                      ) : (
                        <div className="grid h-full place-items-center px-5 text-center">
                          <p className="text-[12px] leading-relaxed text-mocha">
                            Some options in this design have changed.
                          </p>
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full border border-white/60 bg-cream/80 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.13em] text-cocoa backdrop-blur-sm">
                        {resolved
                          ? `${resolved.size.tiers} ${pluralize(resolved.size.tiers, "tier")}`
                          : "Unavailable"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-display text-[1.4rem] leading-none text-espresso">
                            {design.name}
                          </h3>
                          <p className="mt-1.5 text-[10.5px] text-mocha">
                            Updated {updatedLabel(design.updatedAt)}
                          </p>
                        </div>
                        <p className="shrink-0 text-[13px] font-medium text-espresso">
                          {formatPrice(price)}
                        </p>
                      </div>

                      {resolved ? (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {resolved.tiers.map((tier, index) => (
                              <span
                                key={`${tier.colorHex}-${index}`}
                                className="h-3.5 w-3.5 rounded-full border border-white/80 shadow-sm"
                                style={{ backgroundColor: tier.colorHex }}
                                title={`${tier.colorName} ${tier.flavor.name}`}
                              />
                            ))}
                          </div>
                          <p className="truncate text-[11px] text-mocha">
                            {resolved.tiers
                              .map((tier) => tier.flavor.name)
                              .join(" · ")}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-3 text-[11.5px] leading-relaxed text-danger">
                          This design can no longer be ordered as configured.
                        </p>
                      )}

                      <div className="mt-auto flex items-center gap-2 pt-5">
                        <Link
                          href={`/studio?design=${design.id}`}
                          className={cn(
                            buttonVariants({
                              variant: "secondary",
                              size: "sm",
                            }),
                            "flex-1",
                          )}
                        >
                          Open in studio
                        </Link>
                        {resolved ? (
                          <Link
                            href={`/checkout/${design.id}`}
                            className={cn(
                              buttonVariants({ size: "sm" }),
                              "flex-1",
                            )}
                          >
                            Request
                            <ArrowRight
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                          </Link>
                        ) : null}
                        <DeleteDesignButton
                          designId={design.id}
                          designName={design.name}
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-sand bg-porcelain/40 px-6 py-12 text-center">
              <Sparkles
                className="mx-auto h-5 w-5 text-gold"
                aria-hidden="true"
              />
              <h3 className="mt-4 font-display text-2xl">
                Your first cake awaits.
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-mocha">
                Compose a cake in the studio and save it here for later — no
                payment needed until pickup.
              </p>
              <Link
                href="/studio"
                className={cn(buttonVariants({ size: "lg" }), "mt-6")}
              >
                Open the studio
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>

        <section aria-labelledby="orders-heading">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="eyebrow">From our ovens</p>
              <h2
                id="orders-heading"
                className="mt-3 font-display text-[clamp(1.9rem,3.5vw,2.5rem)] leading-none"
              >
                Pickup requests
              </h2>
            </div>
            {orders.length ? (
              <p className="text-[11.5px] text-mocha">
                {orders.length} {pluralize(orders.length, "order")}
              </p>
            ) : null}
          </div>

          {orders.length ? (
            <ul className="mt-7 divide-y divide-sand/70 overflow-hidden rounded-2xl border border-sand/80 bg-cream">
              {orders.map((order) => {
                const resolved = parseSnapshot(order.snapshotJson);
                return (
                  <li key={order.id}>
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="group flex items-center gap-4 p-4 transition-colors hover:bg-porcelain/50 sm:p-5"
                    >
                      <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-b from-rose-soft/25 to-sage-soft/30 sm:block">
                        {resolved ? (
                          <CakeIllustration
                            resolved={resolved}
                            showHalo={false}
                            className="h-full w-full"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-[9.5px] font-medium uppercase tracking-[0.15em] text-mocha">
                            {order.orderNumber}
                          </p>
                          <StatusBadge status={order.status} />
                        </div>
                        <h3 className="mt-1.5 truncate font-display text-[1.35rem] leading-none text-espresso">
                          {order.designName}
                        </h3>
                        <p className="mt-1.5 text-[11.5px] text-mocha">
                          Pickup {formatShortDate(order.pickupDate)} ·{" "}
                          {getPickupSlotLabel(order.pickupSlot)}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-[13px] font-medium text-espresso">
                          {formatPrice(order.totalCents)}
                        </p>
                        <p className="mt-1 hidden text-[10.5px] text-mocha sm:block">
                          View details
                        </p>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-mocha transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-espresso"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="mt-7 rounded-2xl border border-dashed border-sand bg-porcelain/40 px-6 py-12 text-center">
              <CalendarDays
                className="mx-auto h-5 w-5 text-gold"
                aria-hidden="true"
              />
              <h3 className="mt-4 font-display text-2xl">No pickups yet.</h3>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-mocha">
                When you request a cake, you will be able to follow its progress
                from request to ready right here.
              </p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
