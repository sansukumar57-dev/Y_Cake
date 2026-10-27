export type Role = "USER" | "ADMIN";

export type FinishId = "smooth" | "swirl" | "drip";

export type DesignConfig = {
  sizeId: string;
  tiers: Array<{
    flavorId: string;
    colorHex: string;
  }>;
  frostingId: string;
  finish: FinishId;
  decorationIds: string[];
  inscription: string;
};

export type CakeSizeOption = {
  id: string;
  name: string;
  description: string;
  tiers: number;
  servings: number;
  basePriceCents: number;
  active: boolean;
  sortOrder: number;
};

export type FlavorOption = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  active: boolean;
  sortOrder: number;
};

export type FrostingOption = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  active: boolean;
  sortOrder: number;
};

export type DecorationOption = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  icon: DecorationIcon;
  active: boolean;
  sortOrder: number;
};

export type DecorationIcon =
  | "berries"
  | "roses"
  | "macarons"
  | "chocolate"
  | "gold"
  | "candles";

export type FinishOption = {
  id: FinishId;
  name: string;
  description: string;
  priceCents: number;
};

export type Catalog = {
  sizes: CakeSizeOption[];
  flavors: FlavorOption[];
  frostings: FrostingOption[];
  decorations: DecorationOption[];
};

export type PriceBreakdown = {
  baseCents: number;
  flavorsCents: number;
  frostingCents: number;
  finishCents: number;
  decorationsCents: number;
  inscriptionCents: number;
  totalCents: number;
};

export type ResolvedDesign = {
  config: DesignConfig;
  size: CakeSizeOption;
  tiers: Array<{
    flavor: FlavorOption;
    colorHex: string;
    colorName: string;
  }>;
  frosting: FrostingOption;
  finish: FinishOption;
  decorations: DecorationOption[];
  inscription: string;
  servings: number;
  price: PriceBreakdown;
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "READY"
  | "COMPLETED"
  | "CANCELLED";

export const ORDER_STATUSES: Array<{
  value: OrderStatus;
  label: string;
  description: string;
}> = [
  {
    value: "PENDING",
    label: "Pending",
    description: "Request received, waiting for bakery confirmation.",
  },
  {
    value: "CONFIRMED",
    label: "Confirmed",
    description: "The bakery has confirmed your pickup.",
  },
  {
    value: "IN_PROGRESS",
    label: "In progress",
    description: "Your cake is being baked and finished.",
  },
  {
    value: "READY",
    label: "Ready",
    description: "Your cake is boxed and ready for pickup.",
  },
  {
    value: "COMPLETED",
    label: "Completed",
    description: "Pickup complete. Thank you.",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
    description: "This order was cancelled.",
  },
];

export const ORDER_STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "READY",
  "COMPLETED",
];

export type OrderWithDesign = {
  id: string;
  orderNumber: string;
  designName: string;
  totalCents: number;
  pickupDate: string;
  pickupSlot: string;
  status: string;
  createdAt: Date;
};

export type PickupSlot = {
  value: string;
  label: string;
};

export type PresetView = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  featured: boolean;
  resolved: ResolvedDesign;
};
