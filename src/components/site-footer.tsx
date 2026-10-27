import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { buttonVariants } from "@/components/ui/button";

const exploreLinks = [
  { href: "/studio", label: "Design studio" },
  { href: "/gallery", label: "The collection" },
  { href: "/#story", label: "Our story" },
  { href: "/#process", label: "How it works" },
];

const visitLinks = [
  { href: "/#faq", label: "Pickup & lead times" },
  { href: "/#faq", label: "Dietary questions" },
  { href: "/account", label: "Your account" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-espresso text-cream">
      <div className="container-page py-14 sm:py-16">
        <div className="flex flex-col gap-10 border-b border-cream/12 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow text-cream/45">Y Cake Atelier</p>
            <h2 className="mt-4 font-display text-3xl leading-[1.08] text-cream sm:text-[2.6rem]">
              There is always something{" "}
              <span className="serif-italic text-gold-soft">to celebrate.</span>
            </h2>
          </div>
          <Link
            href="/studio"
            className={buttonVariants({ variant: "light", size: "lg" })}
          >
            Design your cake
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/60">
              A small-batch cake studio in Brooklyn. Composed by you, baked and
              finished by hand.
            </p>
          </div>

          <div>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-cream/40">
              Explore
            </p>
            <ul className="mt-4 space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/72 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-cream/40">
              Good to know
            </p>
            <ul className="mt-4 space-y-2.5">
              {visitLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/72 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10.5px] font-medium uppercase tracking-[0.2em] text-cream/40">
              Visit
            </p>
            <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-cream/72">
              <p>84 Wythe Avenue</p>
              <p>Brooklyn, NY 11249</p>
            </address>
            <p className="mt-4 text-sm leading-relaxed text-cream/72">
              Wed–Sat, 9am–5pm
              <br />
              Pickup by appointment
            </p>
            <a
              href="mailto:hello@ycakeatelier.com"
              className="mt-4 inline-block text-sm text-cream/72 underline decoration-cream/20 underline-offset-4 transition-colors hover:text-cream"
            >
              hello@ycakeatelier.com
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-cream/12 pt-7 text-[11.5px] text-cream/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Y Cake Atelier. All rights reserved.</p>
          <p>Made by hand in Brooklyn, New York.</p>
        </div>
      </div>
    </footer>
  );
}
