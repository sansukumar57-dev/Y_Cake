import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Atelier desk",
    template: "%s · Atelier desk",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <AdminShell userName={user.name} userEmail={user.email}>
      {children}
    </AdminShell>
  );
}
