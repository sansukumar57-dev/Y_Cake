import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/form";
import { getAdminOrders, getOrderStatsByStatus } from "@/lib/data";
import {
  formatShortDate,
  getPickupSlotLabel,
} from "@/lib/dates";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";
import { cn, formatPrice, pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Orders",
};

function firstValue(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }
  return Array.isArray(value) ? value[0] : undefined;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    q?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const rawStatus = firstValue(params.status);
  const selectedStatus = ORDER_STATUSES.find(
    (status) => status.value === rawStatus,
  )?.value as OrderStatus | undefined;
  const query = firstValue(params.q)?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();

  const [allOrders, counts] = await Promise.all([
    getAdminOrders(selectedStatus),
    getOrderStatsByStatus(),
  ]);
  const orders = normalizedQuery
    ? allOrders.filter((order) =>
        [
          order.orderNumber,
          order.designName,
          order.customerName,
          order.email,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
    : allOrders;
  const totalCount = Object.values(counts).reduce(
    (total, count) => total + count,
    0,
  );

  const hrefFor = (status?: OrderStatus) => {
    const search = new URLSearchParams();
    if (status) {
      search.set("status", status);
    }
    if (query) {
      search.set("q", query);
    }
    const suffix = search.toString();
    return suffix ? `/admin/orders?${suffix}` : "/admin/orders";
  };

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-3 text-[9.5px] font-medium uppercase tracking-[0.2em] text-mocha">
            <span className="h-px w-6 bg-gold" aria-hidden="true" />
            The book
          </p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4.5vw,3.2rem)] leading-[0.98] tracking-[-0.045em]">
            Pickup <span className="serif-italic text-rose">requests.</span>
          </h1>
          <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-mocha">
            Confirm requests, move cakes through the kitchen, and keep every
            pickup in view.
          </p>
        </div>
        <Link
          href="/admin/catalog"
          className={buttonVariants({ variant: "secondary" })}
        >
          Catalog
        </Link>
      </div>

      <div className="mt-7 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
          <Link
            href={hrefFor()}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-2 text-[11.5px] font-medium transition-colors",
              !selectedStatus
                ? "bg-espresso text-cream"
                : "bg-cream text-cocoa hover:bg-porcelain",
            )}
          >
            All
            <span className="ml-1.5 opacity-55">{totalCount}</span>
          </Link>
          {ORDER_STATUSES.map((status) => (
            <Link
              key={status.value}
              href={hrefFor(status.value)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[11.5px] font-medium transition-colors",
                selectedStatus === status.value
                  ? "bg-espresso text-cream"
                  : "bg-cream text-cocoa hover:bg-porcelain",
              )}
            >
              {status.label}
              <span className="ml-1.5 opacity-55">
                {counts[status.value] ?? 0}
              </span>
            </Link>
          ))}
        </div>

        <form
          action="/admin/orders"
          method="get"
          className="flex w-full items-center gap-2 lg:w-auto"
        >
          {selectedStatus ? (
            <input type="hidden" name="status" value={selectedStatus} />
          ) : null}
          <div className="relative min-w-0 flex-1 lg:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mocha"
              aria-hidden="true"
            />
            <label htmlFor="order-search" className="sr-only">
              Search orders
            </label>
            <Input
              id="order-search"
              name="q"
              defaultValue={query}
              placeholder="Order, name, or email"
              className="h-10 pl-9"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm">
            Search
          </Button>
          {query ? (
            <Link
              href={hrefFor(selectedStatus)}
              className="shrink-0 px-1 text-[11px] text-mocha transition-colors hover:text-espresso"
            >
              Clear
            </Link>
          ) : null}
        </form>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-sand/80 bg-cream">
        <div className="hidden border-b border-sand/70 px-4 py-2.5 text-[9px] font-medium uppercase tracking-[0.14em] text-mocha sm:grid sm:grid-cols-[1.2fr_1.05fr_0.9fr_0.55fr_0.7fr_18px] sm:items-center sm:gap-3">
          <span>Order</span>
          <span>Customer</span>
          <span>Pickup</span>
          <span>Total</span>
          <span>Status</span>
          <span />
        </div>

        {orders.length ? (
          <ul className="divide-y divide-sand/70">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="group grid gap-2 px-4 py-4 transition-colors hover:bg-porcelain/40 sm:grid-cols-[1.2fr_1.05fr_0.9fr_0.55fr_0.7fr_18px] sm:items-center sm:gap-3 sm:py-3.5"
                >
                  <div className="min-w-0">
                    <p className="text-[9px] font-medium uppercase tracking-[0.13em] text-mocha">
                      {order.orderNumber}
                    </p>
                    <p className="mt-1 truncate font-display text-[17px] leading-none text-espresso">
                      {order.designName}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[11.5px] text-cocoa">
                      {order.customerName}
                    </p>
                    <p className="mt-0.5 hidden truncate text-[10px] text-mocha sm:block">
                      {order.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11.5px] text-cocoa">
                      {formatShortDate(order.pickupDate)}
                    </p>
                    <p className="mt-0.5 text-[10px] text-mocha">
                      {getPickupSlotLabel(order.pickupSlot)}
                    </p>
                  </div>
                  <p className="text-[12px] font-medium text-espresso">
                    {formatPrice(order.totalCents)}
                  </p>
                  <div>
                    <StatusBadge status={order.status} />
                  </div>
                  <ArrowUpRight
                    className="hidden h-4 w-4 text-mocha transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-14 text-center">
            <h2 className="font-display text-2xl">Nothing on this page.</h2>
            <p className="mx-auto mt-2 max-w-sm text-[12px] leading-relaxed text-mocha">
              {query
                ? `No requests match “${query}”.`
                : "There are no requests with this status yet."}
            </p>
            {query || selectedStatus ? (
              <Link
                href="/admin/orders"
                className={cn(buttonVariants({ size: "sm" }), "mt-5")}
              >
                View all orders
              </Link>
            ) : null}
          </div>
        )}
      </div>

      <p className="mt-3 text-[10.5px] text-mocha">
        Showing {orders.length} {pluralize(orders.length, "request")}
        {selectedStatus ? ` · ${selectedStatus.replaceAll("_", " ").toLowerCase()}` : ""}
        {query ? ` · search “${query}”` : ""}
      </p>
    </div>
  );
}
