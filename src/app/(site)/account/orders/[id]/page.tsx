import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
} from "lucide-react";
import { CakePreview } from "@/components/cake/CakePreview";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import {
  formatDateTime,
  formatPickupDate,
  getPickupSlotLabel,
} from "@/lib/dates";
import { getOrderForUser, parseSnapshot } from "@/lib/data";
import { ORDER_STATUSES, ORDER_STATUS_FLOW } from "@/lib/types";
import { cn, formatPrice, tierLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pickup request",
  description: "The details and progress of your Y Cake Atelier pickup request.",
};

function firstValue(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }
  return Array.isArray(value) ? value[0] : undefined;
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ placed?: string | string[] }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const user = await requireUser("/account");
  const order = await getOrderForUser(id, user.id);

  if (!order) {
    notFound();
  }

  const placed = firstValue(query.placed) === "1";
  const resolved = parseSnapshot(order.snapshotJson);
  const currentIndex = Math.max(
    0,
    ORDER_STATUS_FLOW.indexOf(order.status as (typeof ORDER_STATUS_FLOW)[number]),
  );
  const cancelled = order.status === "CANCELLED";

  return (
    <>
      <section className="border-b border-sand/60 bg-gradient-to-b from-porcelain/80 via-cream to-cream">
        <div className="container-page py-9 sm:py-11">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-[11.5px] text-mocha transition-colors hover:text-espresso"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to your account
          </Link>

          <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-7 bg-gold" aria-hidden="true" />
                {order.orderNumber}
              </p>
              <h1 className="mt-3 max-w-2xl font-display text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.98] tracking-[-0.045em]">
                {placed ? (
                  <>
                    Your cake is{" "}
                    <span className="serif-italic text-rose">requested.</span>
                  </>
                ) : (
                  <>
                    {order.designName}{" "}
                    <span className="serif-italic text-mocha">· pending.</span>
                  </>
                )}
              </h1>
              <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-mocha">
                {placed
                  ? `Thank you, ${user.name.split(" ")[0]}. Your request is with the atelier. We will email within one working day to confirm your pickup — no payment has been taken.`
                  : `Requested ${formatDateTime(order.createdAt)}. Keep this page bookmarked for the latest pickup details.`}
              </p>
            </div>
            <StatusBadge status={order.status} className="w-fit px-3 py-1.5" />
          </div>
        </div>
      </section>

      <div className="container-page grid gap-7 py-9 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:gap-12 lg:py-12">
        <div>
          {resolved ? (
            <div className="relative h-[48svh] min-h-[320px] max-h-[460px] overflow-hidden rounded-2xl border border-white/70 bg-gradient-to-b from-rose-soft/35 via-[#f8f1e6] to-sage-soft/45 shadow-soft lg:h-[440px] lg:max-h-none">
              <CakePreview resolved={resolved} />
              <span className="pointer-events-none absolute right-3 top-3 rounded-full border border-white/60 bg-cream/80 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.13em] text-cocoa backdrop-blur-sm">
                Your approved design
              </span>
            </div>
          ) : (
            <div className="grid h-64 place-items-center rounded-2xl border border-sand bg-porcelain/40 px-6 text-center">
              <p className="text-[13px] leading-relaxed text-mocha">
                The preview for this order is unavailable, but the bakery has
                your full design on file.
              </p>
            </div>
          )}

          <div className="mt-5 rounded-2xl border border-sand/80 bg-cream p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-[9.5px]">The cake</p>
                <h2 className="mt-2 font-display text-2xl leading-none">
                  {order.designName}
                </h2>
              </div>
              <p className="font-display text-[26px] leading-none text-espresso">
                {formatPrice(order.totalCents)}
              </p>
            </div>

            {resolved ? (
              <>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-mocha">
                  <span>{resolved.size.name}</span>
                  <span className="h-1 w-1 rounded-full bg-sand" />
                  <span>{resolved.size.tiers} tiers</span>
                  <span className="h-1 w-1 rounded-full bg-sand" />
                  <span>Serves {resolved.servings}</span>
                </div>

                <dl className="mt-4 grid gap-2.5 border-t border-sand/70 pt-4 sm:grid-cols-2">
                  {resolved.tiers.map((tier, index) => (
                    <div
                      key={`${tier.flavor.id}-${index}`}
                      className="flex items-start gap-2.5"
                    >
                      <span
                        className="mt-1 h-3 w-3 shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: tier.colorHex }}
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-[9px] uppercase tracking-[0.12em] text-mocha">
                          {tierLabel(index, resolved.tiers.length)}
                        </dt>
                        <dd className="mt-0.5 text-[11.5px] text-cocoa">
                          {tier.flavor.name} · {tier.colorName}
                        </dd>
                      </div>
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <dt className="text-[9px] uppercase tracking-[0.12em] text-mocha">
                      Finish
                    </dt>
                    <dd className="mt-0.5 text-[11.5px] text-cocoa">
                      {resolved.frosting.name} · {resolved.finish.name}
                      {resolved.decorations.length
                        ? ` · ${resolved.decorations
                            .map((decoration) => decoration.name)
                            .join(", ")}`
                        : ""}
                    </dd>
                  </div>
                  {resolved.inscription ? (
                    <div className="sm:col-span-2">
                      <dt className="text-[9px] uppercase tracking-[0.12em] text-mocha">
                        Plaque
                      </dt>
                      <dd className="mt-0.5 font-display text-[15px] italic text-cocoa">
                        “{resolved.inscription}”
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2 border-t border-sand/70 pt-4">
              {order.design ? (
                <Link
                  href={`/studio?design=${order.design.id}`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                >
                  Open design in studio
                </Link>
              ) : null}
              <a
                href={`mailto:hello@ycakeatelier.com?subject=${encodeURIComponent(
                  `Change to order ${order.orderNumber}`,
                )}`}
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Ask about this order
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-sand/80 bg-cream p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
              <p className="eyebrow text-[9.5px]">Pickup</p>
            </div>
            <p className="mt-3 font-display text-[1.55rem] leading-tight text-espresso">
              {formatPickupDate(order.pickupDate)}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-mocha">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {getPickupSlotLabel(order.pickupSlot)}
            </p>
            <div className="mt-4 flex items-start gap-2.5 border-t border-sand/70 pt-4 text-[11.5px] leading-relaxed text-mocha">
              <MapPin
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold"
                aria-hidden="true"
              />
              <p>
                84 Wythe Avenue
                <br />
                Brooklyn, NY 11249
                <br />
                <span className="text-[10.5px]">
                  Pickup by appointment · Wed–Sat, 9am–5pm
                </span>
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-sand/80 bg-cream p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-[9.5px]">Progress</p>
              {!cancelled ? (
                <p className="text-[10px] text-mocha">
                  Step {currentIndex + 1} of {ORDER_STATUS_FLOW.length}
                </p>
              ) : null}
            </div>

            {cancelled ? (
              <div className="mt-4 rounded-xl border border-danger/15 bg-danger-soft/45 p-4">
                <p className="text-[12.5px] font-medium text-danger">
                  This request was cancelled.
                </p>
                <p className="mt-1 text-[11.5px] leading-relaxed text-danger/80">
                  If this was unexpected, email hello@ycakeatelier.com and we
                  will help.
                </p>
              </div>
            ) : (
              <ol className="mt-5">
                {ORDER_STATUS_FLOW.map((step, index) => {
                  const info = ORDER_STATUSES.find(
                    (item) => item.value === step,
                  );
                  const done = index < currentIndex;
                  const active = index === currentIndex;
                  return (
                    <li
                      key={step}
                      className="relative flex gap-3.5 pb-6 last:pb-0"
                    >
                      {index < ORDER_STATUS_FLOW.length - 1 ? (
                        <span
                          className={cn(
                            "absolute left-[11px] top-6 h-[calc(100%-1.25rem)] w-px",
                            done ? "bg-espresso/20" : "bg-sand/80",
                          )}
                          aria-hidden="true"
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative z-10 mt-0.5 grid h-[23px] w-[23px] shrink-0 place-items-center rounded-full border",
                          done
                            ? "border-espresso bg-espresso text-cream"
                            : active
                              ? "border-espresso bg-cream"
                              : "border-sand bg-cream",
                        )}
                      >
                        {done ? (
                          <Check className="h-3 w-3" aria-hidden="true" />
                        ) : active ? (
                          <span className="h-2 w-2 rounded-full bg-espresso" />
                        ) : (
                          <span className="h-1.5 w-1.5 rounded-full bg-sand" />
                        )}
                      </span>
                      <div className="min-w-0 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={cn(
                              "text-[12.5px] font-medium",
                              active || done ? "text-espresso" : "text-mocha",
                            )}
                          >
                            {info?.label ?? step}
                          </p>
                          {active ? (
                            <span className="rounded-full bg-porcelain px-2 py-0.5 text-[9px] font-medium uppercase tracking-[0.1em] text-cocoa">
                              Now
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-mocha">
                          {info?.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
            <p className="mt-4 border-t border-sand/70 pt-3 text-[10px] leading-relaxed text-mocha">
              Questions? Email{" "}
              <a
                href="mailto:hello@ycakeatelier.com"
                className="underline decoration-gold/50 underline-offset-2 hover:text-espresso"
              >
                hello@ycakeatelier.com
              </a>{" "}
              with {order.orderNumber}.
            </p>
          </div>

          <div className="rounded-2xl border border-sand/80 bg-cream p-5 sm:p-6">
            <p className="eyebrow text-[9.5px]">Contact</p>
            <div className="mt-3 space-y-2 text-[12px] text-cocoa">
              <p className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {order.customerName}
              </p>
              <p className="flex items-start gap-2.5">
                <Mail
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mocha"
                  aria-hidden="true"
                />
                <span className="break-all">{order.email}</span>
              </p>
              <p className="flex items-start gap-2.5">
                <Phone
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-mocha"
                  aria-hidden="true"
                />
                {order.phone}
              </p>
            </div>
            {order.notes ? (
              <div className="mt-4 border-t border-sand/70 pt-4">
                <p className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.12em] text-mocha">
                  <MessageSquare
                    className="h-3.5 w-3.5 text-gold"
                    aria-hidden="true"
                  />
                  Notes for the bakery
                </p>
                <p className="mt-2 text-[11.5px] leading-relaxed text-cocoa">
                  {order.notes}
                </p>
              </div>
            ) : null}
          </div>

          <Link
            href="/account"
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          >
            All saved designs & orders
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
