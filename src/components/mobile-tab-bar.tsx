"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CakeSlice, CircleUser, House, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/gallery", label: "Cakes", icon: CakeSlice },
  { href: "/studio", label: "Studio", icon: Sparkles },
  { href: "/account", label: "Account", icon: CircleUser },
];

// The studio and checkout carry their own fixed bottom bars,
// and the auth pages should stay free of distractions.
const hiddenPrefixes = ["/studio", "/checkout", "/login", "/register", "/admin"];

export function MobileTabBar() {
  const pathname = usePathname();

  if (hiddenPrefixes.some((prefix) => pathname.startsWith(prefix))) {
    return null;
  }

  return (
    <>
      <div
        className="h-[calc(4.5rem+env(safe-area-inset-bottom))] lg:hidden"
        aria-hidden="true"
      />
      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/70 bg-cream/95 pb-[max(0.4rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4">
          {tabs.map((tab) => {
            const active =
              tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-1 pt-2 text-[10px] font-medium transition-colors",
                  active ? "text-espresso" : "text-mocha hover:text-cocoa",
                )}
              >
                <span className="relative">
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={active ? 2.2 : 1.8}
                    aria-hidden="true"
                  />
                  {active ? (
                    <span className="absolute -top-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gold" />
                  ) : null}
                </span>
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
