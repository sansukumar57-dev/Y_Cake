import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/inter/wght-italic.css";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Y Cake Atelier — Design a cake as singular as the moment",
    template: "%s · Y Cake Atelier",
  },
  description:
    "Design your own tiered cake in the Y Cake Atelier studio, then let our Brooklyn bakers make it by hand. Small-batch, made to order, picked up fresh.",
  applicationName: "Y Cake Atelier",
  keywords: [
    "custom cake",
    "cake design",
    "Brooklyn bakery",
    "wedding cake",
    "celebration cake",
  ],
  openGraph: {
    title: "Y Cake Atelier",
    description:
      "A 3D cake design studio and small-batch bakery in Brooklyn. Compose your tiers, flavors, and flourishes.",
    type: "website",
    siteName: "Y Cake Atelier",
  },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f1",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-espresso focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
        >
          Skip to content
        </a>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4200,
            style: {
              background: "#2c211b",
              color: "#fbf7f1",
              border: "1px solid rgba(251, 247, 241, 0.14)",
            },
          }}
        />
      </body>
    </html>
  );
}
