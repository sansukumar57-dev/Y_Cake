import { z } from "zod";
import { PICKUP_SLOTS } from "./dates";
import { FINISHES, MAX_INSCRIPTION_LENGTH } from "./pricing";
import { FROSTING_COLORS } from "./colors";
import type { DecorationIcon } from "./types";

const finishIds = FINISHES.map((finish) => finish.id) as [
  "smooth",
  "swirl",
  "drip",
];

const colorHexes = FROSTING_COLORS.map((color) => color.hex.toLowerCase());

export const designConfigSchema = z.object({
  sizeId: z.string().min(1, "Choose a size"),
  tiers: z
    .array(
      z.object({
        flavorId: z.string().min(1, "Choose a flavor"),
        colorHex: z
          .string()
          .refine((value) => colorHexes.includes(value.toLowerCase()), {
            message: "Choose a frosting color",
          }),
      }),
    )
    .min(1)
    .max(3),
  frostingId: z.string().min(1, "Choose a frosting"),
  finish: z.enum(finishIds),
  decorationIds: z.array(z.string()).max(6),
  inscription: z.string().trim().max(MAX_INSCRIPTION_LENGTH),
});

export const saveDesignSchema = z.object({
  id: z.string().min(1).optional(),
  name: z
    .string()
    .trim()
    .min(2, "Give your cake a name of at least 2 characters")
    .max(60, "Keep the name under 60 characters"),
  config: designConfigSchema,
  thumbnail: z
    .string()
    .max(420_000, "The preview image is too large")
    .refine(
      (value) =>
        value === "" ||
        value.startsWith("data:image/jpeg;base64,") ||
        value.startsWith("data:image/png;base64,"),
      { message: "Invalid preview image" },
    )
    .nullish(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(60, "Keep your name under 60 characters"),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Use 72 characters or fewer"),
  next: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  password: z.string().min(1, "Enter your password"),
  next: z.string().optional(),
});

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Enter the name for the order")
    .max(80, "Keep the name under 80 characters"),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email")),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number")
    .max(24, "Keep the phone number under 24 characters")
    .regex(/^[+()\-\s\d.]+$/, "Use digits, spaces, and standard symbols"),
  pickupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a pickup date"),
  pickupSlot: z.enum(
    PICKUP_SLOTS.map((slot) => slot.value) as [string, ...string[]],
    { message: "Choose a pickup window" },
  ),
  notes: z.string().trim().max(500, "Keep notes under 500 characters"),
});

export const catalogSizeSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(2).max(160),
  tiers: z.coerce.number().int().min(1).max(3),
  servings: z.coerce.number().int().min(1).max(500),
  basePriceCents: z.coerce.number().int().min(0).max(1_000_000),
  sortOrder: z.coerce.number().int().min(0).max(999),
  active: z.boolean(),
});

export const catalogFlavorSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(2).max(160),
  priceCents: z.coerce.number().int().min(0).max(100_000),
  sortOrder: z.coerce.number().int().min(0).max(999),
  active: z.boolean(),
});

export const catalogFrostingSchema = catalogFlavorSchema;

const decorationIcons: DecorationIcon[] = [
  "berries",
  "roses",
  "macarons",
  "chocolate",
  "gold",
  "candles",
];

export const catalogDecorationSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(2).max(160),
  priceCents: z.coerce.number().int().min(0).max(100_000),
  icon: z.enum(decorationIcons as [DecorationIcon, ...DecorationIcon[]]),
  sortOrder: z.coerce.number().int().min(0).max(999),
  active: z.boolean(),
});

export const orderStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "READY",
  "COMPLETED",
  "CANCELLED",
]);

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SaveDesignInput = z.infer<typeof saveDesignSchema>;
