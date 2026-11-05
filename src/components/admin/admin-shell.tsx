"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  SlidersHorizontal,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { Logo } from "@/components/ui/logo";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, initials } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/catalog", label: "Catalog", icon: SlidersHorizontal },
];

export function AdminShell({
  userName,
  userEmail,
  children,
}: {
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const nav = (
    <nav aria-label="Admin navigation" className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] transition-colors",
              active
                ? "bg-cream/10 text-cream"
                : "text-cream/60 hover:bg-cream/5 hover:text-cream",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-svh bg-[#f8f3eb] lg:grid lg:grid-cols-[252px_minmax(0,1fr)]">
      <aside className="sticky top-0 z-30 hidden h-svh flex-col bg-espresso text-cream lg:flex">
        <div className="px-6 pt-7">
          <Logo light />
        </div>

        <div className="mt-10 px-3">
          <p className="px-3 text-[9px] font-medium uppercase tracking-[0.22em] text-cream/35">
            Atelier desk
          </p>
          <div className="mt-3">{nav}</div>
        </div>

        <div className="mt-auto px-3 pb-5">
          <Link
            href="/"
            className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[12px] text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
          >
            View storefront
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <div className="mt-3 border-t border-cream/10 pt-4">
            <div className="flex items-center gap-2.5 px-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-cream/10 text-[10px] font-medium text-cream">
                {initials(userName)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11.5px] font-medium text-cream">
                  {userName}
                </p>
                <p className="truncate text-[9.5px] text-cream/40">
                  {userEmail}
                </p>
              </div>
            </div>
            <form action={logoutAction} className="mt-2">
              <button
                type="submit"
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[11.5px] text-cream/50 transition-colors hover:bg-cream/5 hover:text-cream"
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-sand/70 bg-cream/92 px-4 backdrop-blur-xl lg:hidden">
          <Logo />
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label="Open admin menu"
                className="grid h-10 w-10 place-items-center rounded-full border border-sand text-espresso transition-colors hover:bg-porcelain"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogTitle className="sr-only">Admin menu</DialogTitle>
              <DialogDescription className="sr-only">
                Navigate the atelier desk, storefront, and account.
              </DialogDescription>
              <div className="pr-10">
                <Logo />
              </div>
              <nav aria-label="Admin mobile navigation" className="mt-7 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href, item.exact);
                  return (
                    <DialogClose key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-3 text-[14px] transition-colors",
                          active
                            ? "bg-porcelain text-espresso"
                            : "text-cocoa hover:bg-porcelain/60",
                        )}
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </Link>
                    </DialogClose>
                  );
                })}
              </nav>

              <div className="mt-7 border-t border-sand/70 pt-5">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-porcelain text-[11px] font-medium text-espresso">
                    {initials(userName)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-medium text-espresso">
                      {userName}
                    </p>
                    <p className="truncate text-[10px] text-mocha">
                      {userEmail}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <DialogClose asChild>
                    <Link
                      href="/"
                      className="flex items-center justify-between rounded-lg border border-sand px-3 py-2.5 text-[12px] text-cocoa transition-colors hover:bg-porcelain"
                    >
                      View storefront
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </DialogClose>
                  <form action={logoutAction}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12px] text-mocha transition-colors hover:bg-porcelain hover:text-espresso"
                    >
                      <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                      Sign out
                    </button>
                  </form>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>

        <main className="px-4 py-7 sm:px-6 lg:px-10 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
