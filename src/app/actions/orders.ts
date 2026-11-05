"use server";

import { revalidatePath } from "next/cache";
import { getSessionUser } from "@/lib/auth";
import { getDesignForCheckout } from "@/lib/data";
import { isValidPickupDate } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { createOrderSchema } from "@/lib/schemas";

export type CreateOrderResult = {
  error?: string;
  orderId?: string;
};

async function nextOrderNumber() {
  const latest = await prisma.order.findFirst({
    orderBy: { createdAt: "desc" },
    select: { orderNumber: true },
  });
  const match = latest?.orderNumber.match(/(\d+)$/);
  const base = match ? Number(match[1]) : 1040;

  for (let offset = 1; offset <= 25; offset += 1) {
    const candidate = `YC-${base + offset}`;
    const existing = await prisma.order.findUnique({
      where: { orderNumber: candidate },
      select: { id: true },
    });
    if (!existing) {
      return candidate;
    }
  }

  return `YC-${Date.now().toString().slice(-7)}`;
}

export async function createOrderAction(
  input: unknown,
): Promise<CreateOrderResult> {
  const user = await getSessionUser();
  if (!user) {
    return { error: "Please sign in to place a pickup request." };
  }

  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      error:
        parsed.error.issues[0]?.message ??
        "Check your pickup details and try again.",
    };
  }

  const { designId, ...details } = parsed.data;

  if (!isValidPickupDate(details.pickupDate)) {
    return {
      error:
        "Choose a pickup date between three and ninety days from today.",
    };
  }

  const design = await getDesignForCheckout(designId, user.id);
  if (!design || !design.resolved) {
    return {
      error:
        "This design is no longer available to order. Please open it in the studio and try again.",
    };
  }

  const orderNumber = await nextOrderNumber();
  const notes = details.notes.trim();

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        designId: design.id,
        designName: design.name,
        configJson: JSON.stringify(design.resolved.config),
        snapshotJson: JSON.stringify(design.resolved),
        totalCents: design.resolved.price.totalCents,
        customerName: details.customerName,
        email: details.email,
        phone: details.phone,
        pickupDate: details.pickupDate,
        pickupSlot: details.pickupSlot,
        notes: notes || null,
      },
    });

    revalidatePath("/account");
    revalidatePath("/admin");
    revalidatePath("/admin/orders");

    return { orderId: order.id };
  } catch {
    return {
      error:
        "We could not place your request just now. Please try again in a moment.",
    };
  }
}
