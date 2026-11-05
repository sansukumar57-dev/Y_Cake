import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CircleDollarSign,
  ClipboardList,
  Sparkles,
  Users,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getAdminDashboard } from "@/lib/data";
import {
  formatShortDate,
  getPickupSlotLabel,
} from "@/lib/dates";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const [user, dashboard] = await Promise.all([
    requireAdmin(),
    getAdminDashboard(),
  ]);
  const { stats, recentOrders, nextPickups } = dashboard;
  const firstName = user.name.split(" ")[0] || user.name;
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const statCards = [
    {
      label: "Pending requests",
      value: String(stats.pendingOrders),
      detail:
        stats.pendingOrders > 0
          ? "Waiting for a baker's reply"
          : "All caught up",
      icon: ClipboardList,
    },
    {
      label: "Upcoming pickups",
      value: String(stats.upcomingOrders),
      detail: "Future dates on the calendar",
      icon: CalendarDays,
    },
    {
      label: "Requested revenue",
      value: formatPrice(stats.revenueCents),
      detail: "Excludes cancelled orders",
      icon: CircleDollarSign,
    },
    {
      label: "Customers",
      value: String(stats.customers),
      detail: `${stats.designs} saved designs`,
      icon: Users,
    },
  ];

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="flex items-center gap-3 text-[9.5px] font-medium uppercase tracking-[0.2em] text-mocha">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            {today}
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.3rem,4.5vw,3.35rem)] leading-[0.98] tracking-[-0.045em]">
            Welcome back,{" "}
            <span className="serif-italic text-rose">{firstName}.</span>
          </h1>
          <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-mocha">
            A view of the atelier today — requests to review, pickups ahead,
            and the cakes taking shape.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/orders" className={buttonVariants()}>
            Open orders
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/admin/catalog"
            className={buttonVariants({ variant: "secondary" })}
          >
            Edit catalog
          </Link>
        </div>
      </div>

      {stats.pendingOrders > 0 ? (
        <div className="mt-7 flex flex-col gap-3 rounded-xl border border-gold/25 bg-gold-soft/20 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2.5 text-[12px] text-cocoa">
            <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
            <span>
              <span className="font-medium text-espresso">
                {stats.pendingOrders}{" "}
                {stats.pendingOrders === 1 ? "request" : "requests"}
              </span>{" "}
              still need a confirmation.
            </span>
          </p>
          <Link
            href="/admin/orders?status=PENDING"
            className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-espresso transition-colors hover:text-cocoa"
          >
            Review now
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-sand/80 bg-cream p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-mocha">
                  {card.label}
                </p>
                <Icon className="h-4 w-4 text-gold" aria-hidden="true" />
              </div>
              <p className="mt-3 font-display text-[2rem] leading-none tracking-[-0.03em] text-espresso">
                {card.value}
              </p>
              <p className="mt-2 text-[10.5px] text-mocha">{card.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <section className="overflow-hidden rounded-xl border border-sand/80 bg-cream">
          <div className="flex items-center justify-between gap-4 border-b border-sand/70 px-4 py-4 sm:px-5">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-mocha">
                Latest activity
              </p>
              <h2 className="mt-1.5 font-display text-[22px] leading-none">
                Recent requests
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1.5 text-[11.5px] text-mocha transition-colors hover:text-espresso"
            >
              All orders
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          {recentOrders.length ? (
            <ul className="divide-y divide-sand/70">
              {recentOrders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="group flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-porcelain/40 sm:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-mocha">
                          {order.orderNumber}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 truncate font-display text-[17px] leading-none text-espresso">
                        {order.designName}
                      </p>
                      <p className="mt-1 truncate text-[10.5px] text-mocha">
                        {order.customerName} · Pickup{" "}
                        {formatShortDate(order.pickupDate)}
                      </p>
                    </div>
                    <p className="shrink-0 text-[12px] font-medium text-espresso">
                      {formatPrice(order.totalCents)}
                    </p>
                    <ArrowUpRight
                      className="h-4 w-4 shrink-0 text-mocha transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-10 text-center text-[12px] text-mocha">
              No requests yet.
            </p>
          )}
        </section>

        <div className="space-y-5">
          <section className="overflow-hidden rounded-xl border border-sand/80 bg-cream">
            <div className="flex items-center justify-between gap-3 border-b border-sand/70 px-4 py-4">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-mocha">
                  On the calendar
                </p>
                <h2 className="mt-1.5 font-display text-[22px] leading-none">
                  Next pickups
                </h2>
              </div>
              <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
            </div>

            {nextPickups.length ? (
              <ul className="divide-y divide-sand/70">
                {nextPickups.map((order) => (
                  <li key={order.id}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-porcelain/40"
                    >
                      <span className="min-w-[40px] rounded-lg bg-porcelain px-2 py-1.5 text-center">
                        <span className="block text-[8.5px] font-medium uppercase tracking-[0.1em] text-mocha">
                          {new Intl.DateTimeFormat("en-US", {
                            month: "short",
                          }).format(
                            new Date(`${order.pickupDate}T12:00:00Z`),
                          )}
                        </span>
                        <span className="mt-0.5 block font-display text-[18px] leading-none text-espresso">
                          {new Date(
                            `${order.pickupDate}T12:00:00Z`,
                          ).getUTCDate()}
                        </span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[16px] leading-none text-espresso">
                          {order.designName}
                        </span>
                        <span className="mt-1 block truncate text-[10.5px] text-mocha">
                          {order.customerName} ·{" "}
                          {getPickupSlotLabel(order.pickupSlot)}
                        </span>
                        <StatusBadge
                          status={order.status}
                          className="mt-1.5"
                        />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-[12px] text-mocha">
                No upcoming pickups.
              </p>
            )}
          </section>

          <section className="rounded-xl border border-sand/80 bg-espresso p-5 text-cream">
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-cream/40">
              Atelier totals
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="font-display text-3xl leading-none text-cream">
                  {stats.totalOrders}
                </p>
                <p className="mt-1 text-[10.5px] text-cream/50">
                  All requests
                </p>
              </div>
              <div>
                <p className="font-display text-3xl leading-none text-cream">
                  {stats.designs}
                </p>
                <p className="mt-1 text-[10.5px] text-cream/50">
                  Saved designs
                </p>
              </div>
            </div>
            <Link
              href="/admin/catalog"
              className={cn(
                buttonVariants({ variant: "outlineLight", size: "sm" }),
                "mt-5 w-full",
              )}
            >
              Manage the options
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
