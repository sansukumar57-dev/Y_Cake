import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { AuthLayout } from "@/components/auth-layout";
import { getSessionUser, sanitizeNextPath } from "@/lib/auth";
import { getFeaturedPresets } from "@/lib/data";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Y Cake Atelier account.",
};

export default async function LoginPage({
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
      eyebrow="Welcome back"
      title={
        <>
          Good to see you{" "}
          <span className="serif-italic text-rose">again.</span>
        </>
      }
      lede="Sign in to return to your designs, place a request, or check on a pickup."
      preset={preset}
    >
      <AuthForm mode="login" next={next} showDemo />
    </AuthLayout>
  );
}
