"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession, sanitizeNextPath } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/schemas";

export type AuthActionResult = {
  error?: string;
};

export async function registerAction(input: unknown): Promise<AuthActionResult> {
  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check your details and try again.",
    };
  }

  const { name, email, password, next } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      error:
        "An account with that email already exists. Try signing in instead.",
    };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      role: "USER",
    },
  });

  await createSession(user.id);
  redirect(sanitizeNextPath(next, "/account"));
}

export async function loginAction(input: unknown): Promise<AuthActionResult> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check your details and try again.",
    };
  }

  const { email, password, next } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "That email and password combination did not match." };
  }

  await createSession(user.id);
  redirect(sanitizeNextPath(next, "/account"));
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
