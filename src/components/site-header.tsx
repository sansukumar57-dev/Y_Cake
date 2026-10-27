"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { logoutAction } from "@/app/actions/auth";
import { cn, initials } from "@/lib/utils";
import type { SessionUser } from "@/lib/types";

const navLinks = [
  { href: "/studio", label: "Design studio" },
  { href: "/gallery", label: "The collection" },
  { href: "/#story", label: "Our story" },
  { href: "/#faq", label: "Questions" },
];

export function SiteHeader({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/88 backdrop-blur-xl">
      <div className="container-page flex h-[74px] items-center justify-between gap-6">
        <Logo />

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 lg:flex"
        >
          {navLinks.map((link) => {
            const active =
              link.href.startsWith("/") &&
              !link.href.includes("#") &&
              pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 text-[13.5px] text-cocoa transition-colors hover:text-espresso",
                  active && "text-espresso",
                )}
              >
                {link.label}
                {active ? (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-gold" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              {user.role === "ADMIN" ? (
                <Link
                  href="/admin"
                  className="hidden rounded-full px-3 py-2 text-[12.5px] text-mocha transition-colors hover:text-espresso sm:block"
                >
                  Admin
                </Link>
              ) : null}
              <Link
                href="/account"
                className="hidden items-center gap-2.5 rounded-full py-1 pl-1 pr-3 text-[13px] text-cocoa transition-colors hover:bg-porcelain sm:flex"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-linen text-[11px] font-medium tracking-wide text-espresso">
                  {initials(user.name)}
                </span>
                <span className="max-w-24 truncate">{user.name.split(" ")[0]}</span>
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden px-3 py-2 text-[13px] text-cocoa transition-colors hover:text-espresso sm:block"
            >
              Sign in
            </Link>
          )}

          <Link
            href="/studio"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden sm:inline-flex",
            )}
          >
            Design a cake
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-full border border-sand text-espresso transition-colors hover:bg-porcelain lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </DialogTrigger>
            <DialogContent className="h-[calc(100svh-2rem)] max-w-md overflow-y-auto p-0">
              <DialogTitle className="sr-only">Menu</DialogTitle>
              <DialogDescription className="sr-only">
                Navigate the site and your account.
              </DialogDescription>
              <div className="flex min-h-full flex-col p-6">
                <div className="pr-14">
                  <Logo />
                </div>

                <nav
                  aria-label="Mobile navigation"
                  className="mt-12 flex flex-col"
                >
                  {navLinks.map((link, index) => (
                    <DialogClose key={link.href} asChild>
                      <Link
                        href={link.href}
                        className="border-b border-sand/70 py-4 font-display text-[28px] leading-none text-espresso transition-colors hover:text-cocoa"
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        {link.label}
                      </Link>
                    </DialogClose>
                  ))}
                </nav>

                <div className="mt-10">
                  <p className="eyebrow">Your account</p>
                  {user ? (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-cocoa">
                        Signed in as{" "}
                        <span className="font-medium text-espresso">
                          {user.name}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <DialogClose asChild>
                          <Link
                            href="/account"
                            className={buttonVariants({
                              variant: "secondary",
                              size: "sm",
                            })}
                          >
                            Account & orders
                          </Link>
                        </DialogClose>
                        {user.role === "ADMIN" ? (
                          <DialogClose asChild>
                            <Link
                              href="/admin"
                              className={buttonVariants({
                                variant: "ghost",
                                size: "sm",
                              })}
                            >
                              Admin
                            </Link>
                          </DialogClose>
                        ) : null}
                      </div>
                      <form action={logoutAction}>
                        <button
                          type="submit"
                          className="inline-flex items-center gap-2 pt-2 text-sm text-mocha transition-colors hover:text-espresso"
                        >
                          <LogOut className="h-4 w-4" aria-hidden="true" />
                          Sign out
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <DialogClose asChild>
                        <Link
                          href="/login"
                          className={buttonVariants({
                            variant: "secondary",
                            size: "sm",
                          })}
                        >
                          Sign in
                        </Link>
                      </DialogClose>
                      <DialogClose asChild>
                        <Link
                          href="/register"
                          className={buttonVariants({ size: "sm" })}
                        >
                          Create account
                        </Link>
                      </DialogClose>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-10">
                  <Link
                    href="/studio"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "w-full",
                    )}
                  >
                    Design your cake
                  </Link>
                  <p className="mt-4 text-center text-[11.5px] text-mocha">
                    Made to order in Brooklyn · Pickup only
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
