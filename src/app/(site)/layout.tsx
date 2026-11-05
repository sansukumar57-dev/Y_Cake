import { getSessionUser } from "@/lib/auth";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileTabBar } from "@/components/mobile-tab-bar";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader user={user} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <MobileTabBar />
    </div>
  );
}
