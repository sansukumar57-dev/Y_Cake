import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Sparkles,
} from "lucide-react";
import { AdminOrderStatus } from "@/components/admin/admin-order-status";
import { CakeIllustration } from "@/components/cake/CakeIllustration";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatDateTime,
  formatPickupDate,
  getPickupSlotLabel,
} from "@/lib/dates";
import { getAdminOrder, parseSnapshot } from "@/lib/data";
import { formatPrice, tierLabel } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Order details",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrder(id);

  if (!order) {
    notFound();
  }

  const resolved = parseSnapshot(order.snapshotJson);

  return (
    <div className="mx-auto max-w-[1240px]">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-[11.5px] text-mocha transition-colors hover:text-espresso"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        All orders
      </Link>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-3 text-[9.5px] font-medium uppercase tracking-[0.18em] text-mocha">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            {order.orderNumber}
          </p>
          <h1 className="mt-2.5 font-display text-[clamp(2.1rem,4.5vw,3rem)] leading-[0.98] tracking-[-0.045em]">
            {order.designName}
          </h1>
          <p className="mt-2 text-[11.5px] text-mocha">
            Requested {formatDateTime(order.createdAt)} by {order.customerName}
          </p>
        </div>
        <StatusBadge status={order.status} className="w-fit px-3 py-1.5" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <section className="overflow-hidden rounded-xl border border-sand/80 bg-cream">
            <div className="relative aspect-[16/10] bg-gradient-to-b from-rose-soft/30 via-[#f8f1e6] to-sage-soft/35 sm:aspect-[16/9]">
              {resolved ? (
                <CakeIllustration
                  resolved={resolved}
                  showHalo={false}
                  className="h-full w-full"
                />
              ) : (
                <div className="grid h-full place-items-center px-6 text-center text-[12px] text-mocha">
                  The design snapshot could not be read.
                </div>
              )}
              <span className="absolute right-3 top-3 rounded-full border border-white/60 bg-cream/80 px-2.5 py-1 text-[9.5px] font-medium uppercase tracking-[0.13em] text-cocoa backdrop-blur-sm">
                Design snapshot
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-mocha">
                    Order total
                  </p>
                  <p className="mt-1.5 font-display text-[30px] leading-none text-espresso">
                    {formatPrice(order.totalCents)}
                  </p>
                </div>
                <p className="text-right text-[10.5px] leading-relaxed text-mocha">
                  Pay at pickup
                  <br />
                  No payment taken
                </p>
              </div>

              {resolved ? (
                <dl className="mt-5 grid gap-3 border-t border-sand/70 pt-4 sm:grid-cols-2">
                  {resolved.tiers.map((tier, index) => (
                    <div
                      key={`${tier.flavor.id}-${index}`}
                      className="flex items-start gap-2.5"
                    >
                      <span
                        className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border border-black/10"
                        style={{ backgroundColor: tier.colorHex }}
                        aria-hidden="true"
                      />
                      <div>
                        <dt className="text-[8.5px] uppercase tracking-[0.12em] text-mocha">
                          {tierLabel(index, resolved.tiers.length)}
                        </dt>
                        <dd className="mt-0.5 text-[11.5px] text-cocoa">
                          {tier.flavor.name} · {tier.colorName}
                        </dd>
                      </div>
                    </div>
                  ))}
                  <div>
                    <dt className="text-[8.5px] uppercase tracking-[0.12em] text-mocha">
                      Frosting & finish
                    </dt>
                    <dd className="mt-0.5 text-[11.5px] text-cocoa">
                      {resolved.frosting.name} · {resolved.finish.name}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[8.5px] uppercase tracking-[0.12em] text-mocha">
                      Decorations
                    </dt>
                    <dd className="mt-0.5 text-[11.5px] leading-relaxed text-cocoa">
                      {resolved.decorations.length
                        ? resolved.decorations
                            .map((decoration) => decoration.name)
                            .join(", ")
                        : "None"}
                    </dd>
                  </div>
                  {resolved.inscription ? (
                    <div>
                      <dt className="text-[8.5px] uppercase tracking-[0.12em] text-mocha">
                        Plaque
                      </dt>
                      <dd className="mt-0.5 font-display text-[14px] italic text-cocoa">
                        “{resolved.inscription}”
                      </dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-[8.5px] uppercase tracking-[0.12em] text-mocha">
                      Servings
                    </dt>
                    <dd className="mt-0.5 text-[11.5px] text-cocoa">
                      {resolved.size.name} · serves {resolved.servings}
                    </dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </section>

          <section className="rounded-xl border border-sand/80 bg-cream p-5">
            <p className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.16em] text-mocha">
              <MessageSquare
                className="h-3.5 w-3.5 text-gold"
                aria-hidden="true"
              />
              Notes for the bakery
            </p>
            <p className="mt-3 whitespace-pre-wrap text-[12px] leading-relaxed text-cocoa">
              {order.notes || "No notes were left with this request."}
            </p>
          </section>
        </div>

        <div className="space-y-5">
          <section className="rounded-xl border border-sand/80 bg-cream p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-mocha">
                  Kitchen
                </p>
                <h2 className="mt-1.5 font-display text-[22px] leading-none">
                  Update status
                </h2>
              </div>
              <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            </div>
            <div className="mt-4">
              <AdminOrderStatus
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
          </section>

          <section className="rounded-xl border border-sand/80 bg-cream p-5">
            <p className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.16em] text-mocha">
              <CalendarDays
                className="h-3.5 w-3.5 text-gold"
                aria-hidden="true"
              />
              Pickup
            </p>
            <p className="mt-3 font-display text-[22px] leading-tight text-espresso">
              {formatPickupDate(order.pickupDate)}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-mocha">
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
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-sand/80 bg-cream p-5">
            <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-mocha">
              Customer
            </p>
            <p className="mt-3 font-display text-[21px] leading-none text-espresso">
              {order.customerName}
            </p>
            <div className="mt-3 space-y-2 text-[11.5px] text-cocoa">
              <a
                href={`mailto:${order.email}?subject=${encodeURIComponent(
                  `Your Y Cake Atelier order ${order.orderNumber}`,
                )}`}
                className="flex items-center gap-2.5 transition-colors hover:text-espresso"
              >
                <Mail
                  className="h-3.5 w-3.5 shrink-0 text-mocha"
                  aria-hidden="true"
                />
                <span className="break-all">{order.email}</span>
              </a>
              <a
                href={`tel:${order.phone.replace(/[^\d+]/g, "")}`}
                className="flex items-center gap-2.5 transition-colors hover:text-espresso"
              >
                <Phone
                  className="h-3.5 w-3.5 shrink-0 text-mocha"
                  aria-hidden="true"
                />
                {order.phone}
              </a>
            </div>
            {order.user ? (
              <p className="mt-4 border-t border-sand/70 pt-3 text-[10px] text-mocha">
                Account: {order.user.email}
              </p>
            ) : (
              <p className="mt-4 border-t border-sand/70 pt-3 text-[10px] text-mocha">
                Guest checkout
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
