"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { getCatalog } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { resolveDesign } from "@/lib/pricing";
import { saveDesignSchema } from "@/lib/schemas";

export type SaveDesignResult = {
  error?: string;
  id?: string;
  name?: string;
};

export async function saveDesignAction(
  input: unknown,
): Promise<SaveDesignResult> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Please sign in to save your design." };
  }

  const parsed = saveDesignSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "That design could not be saved. Check your choices and try again.",
    };
  }

  const catalog = await getCatalog();
  const resolved = resolveDesign(parsed.data.config, catalog);
  if (!resolved) {
    return {
      error:
        "One of your choices is no longer available. Please refresh the studio and try again.",
    };
  }

  const thumbnail = parsed.data.thumbnail?.trim() || null;

  if (parsed.data.id) {
    const existing = await prisma.design.findFirst({
      where: { id: parsed.data.id, userId: user.id },
      select: { id: true },
    });
    if (!existing) {
      return { error: "That saved design could not be found." };
    }

    const design = await prisma.design.update({
      where: { id: existing.id },
      data: {
        name: parsed.data.name,
        configJson: JSON.stringify(resolved.config),
        priceCents: resolved.price.totalCents,
        ...(thumbnail ? { thumbnail } : {}),
      },
    });

    revalidatePath("/account");
    revalidatePath("/studio");
    return { id: design.id, name: design.name };
  }

  const design = await prisma.design.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      configJson: JSON.stringify(resolved.config),
      priceCents: resolved.price.totalCents,
      thumbnail,
    },
  });

  revalidatePath("/account");
  revalidatePath("/studio");
  return { id: design.id, name: design.name };
}

export async function deleteDesignAction(
  id: string,
): Promise<{ error?: string; ok?: boolean }> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Please sign in again." };
  }

  if (!id || typeof id !== "string") {
    return { error: "That design could not be found." };
  }

  await prisma.design.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/account");
  return { ok: true };
}
