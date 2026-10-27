import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";
import { getSessionUser, sanitizeNextPath } from "@/lib/auth";
import { getFeaturedPresets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Create a Y Cake Atelier account to save designs and order.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const next = sanitizeNextPath(params.next, "/account");
  const user = await getSessionUser();

  if (user) {
    redirect(next);
  }

  const preset = (await getFeaturedPresets(1))[0] ?? null;

  return (
    <AuthLayout
      eyebrow="Join the atelier"
      title={
        <>
          Make it{" "}
          <span className="serif-italic text-rose">yours.</span>
        </>
      }
      lede="Create an account to keep your cake designs, place pickup requests, and follow them from request to ready."
      preset={preset}
    >
      <AuthForm mode="register" next={next} />
    </AuthLayout>
  );
}
