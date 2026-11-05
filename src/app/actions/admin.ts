"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  catalogDecorationSchema,
  catalogFlavorSchema,
  catalogFrostingSchema,
  catalogSizeSchema,
  orderStatusSchema,
} from "@/lib/schemas";

const catalogKindSchema = z.enum([
  "size",
  "flavor",
  "frosting",
  "decoration",
]);

export type CatalogKind = z.infer<typeof catalogKindSchema>;

export type AdminActionResult = {
  ok?: boolean;
  error?: string;
};

async function requireAdminAction() {
  const user = await getSessionUser();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}

function revalidateCatalogPaths(kind: CatalogKind) {
  revalidatePath("/studio");
  revalidatePath("/gallery");
  revalidatePath("/admin/catalog");
  revalidatePath("/account");
  revalidatePath("/");
  if (kind === "size") {
    revalidatePath("/studio");
  }
}

export async function updateOrderStatusAction(
  input: unknown,
): Promise<AdminActionResult> {
  const admin = await requireAdminAction();
  if (!admin) {
    return { error: "You do not have permission to update orders." };
  }

  const parsed = z
    .object({
      orderId: z.string().min(1),
      status: orderStatusSchema,
    })
    .safeParse(input);
  if (!parsed.success) {
    return { error: "Choose a valid order status." };
  }

  const order = await prisma.order.findUnique({
    where: { id: parsed.data.orderId },
    select: { id: true },
  });
  if (!order) {
    return { error: "That order could not be found." };
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${order.id}`);
  revalidatePath("/account");
  revalidatePath(`/account/orders/${order.id}`);

  return { ok: true };
}

export async function setCatalogActiveAction(
  kindInput: unknown,
  idInput: unknown,
  activeInput: unknown,
): Promise<AdminActionResult> {
  const admin = await requireAdminAction();
  if (!admin) {
    return { error: "You do not have permission to edit the catalog." };
  }

  const kind = catalogKindSchema.safeParse(kindInput);
  const id = z.string().min(1).safeParse(idInput);
  const active = z.boolean().safeParse(activeInput);
  if (!kind.success || !id.success || !active.success) {
    return { error: "That catalog option could not be updated." };
  }

  try {
    switch (kind.data) {
      case "size":
        await prisma.cakeSize.update({
          where: { id: id.data },
          data: { active: active.data },
        });
        break;
      case "flavor":
        await prisma.flavor.update({
          where: { id: id.data },
          data: { active: active.data },
        });
        break;
      case "frosting":
        await prisma.frosting.update({
          where: { id: id.data },
          data: { active: active.data },
        });
        break;
      case "decoration":
        await prisma.decoration.update({
          where: { id: id.data },
          data: { active: active.data },
        });
        break;
    }
  } catch {
    return { error: "That catalog option could not be found." };
  }

  revalidateCatalogPaths(kind.data);
  return { ok: true };
}

export async function updateCatalogItemAction(
  input: unknown,
): Promise<AdminActionResult> {
  const admin = await requireAdminAction();
  if (!admin) {
    return { error: "You do not have permission to edit the catalog." };
  }

  const envelope = z
    .object({
      kind: catalogKindSchema,
      id: z.string().min(1),
      data: z.unknown(),
    })
    .safeParse(input);
  if (!envelope.success) {
    return { error: "That catalog option could not be updated." };
  }

  const { kind, id, data } = envelope.data;

  try {
    if (kind === "size") {
      const parsed = catalogSizeSchema.safeParse(data);
      if (!parsed.success) {
        return {
          error: parsed.error.issues[0]?.message ?? "Check the size details.",
        };
      }
      await prisma.cakeSize.update({ where: { id }, data: parsed.data });
    } else if (kind === "flavor") {
      const parsed = catalogFlavorSchema.safeParse(data);
      if (!parsed.success) {
        return {
          error:
            parsed.error.issues[0]?.message ?? "Check the flavor details.",
        };
      }
      await prisma.flavor.update({ where: { id }, data: parsed.data });
    } else if (kind === "frosting") {
      const parsed = catalogFrostingSchema.safeParse(data);
      if (!parsed.success) {
        return {
          error:
            parsed.error.issues[0]?.message ?? "Check the frosting details.",
        };
      }
      await prisma.frosting.update({ where: { id }, data: parsed.data });
    } else {
      const parsed = catalogDecorationSchema.safeParse(data);
      if (!parsed.success) {
        return {
          error:
            parsed.error.issues[0]?.message ??
            "Check the decoration details.",
        };
      }
      await prisma.decoration.update({ where: { id }, data: parsed.data });
    }
  } catch {
    return { error: "That catalog option could not be found." };
  }

  revalidateCatalogPaths(kind);
  return { ok: true };
}
