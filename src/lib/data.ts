import "server-only";

import { cache } from "react";
import { prisma } from "./prisma";
import { designConfigSchema } from "./schemas";
import { resolveDesign } from "./pricing";
import type {
  Catalog,
  DecorationIcon,
  DesignConfig,
  OrderStatus,
  PresetView,
  ResolvedDesign,
} from "./types";

function parseConfig(value: string): DesignConfig | null {
  try {
    const parsed = designConfigSchema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function parseSnapshot(value: string): ResolvedDesign | null {
  try {
    const snapshot = JSON.parse(value) as ResolvedDesign;
    if (
      !snapshot ||
      typeof snapshot !== "object" ||
      !snapshot.size ||
      !Array.isArray(snapshot.tiers) ||
      !snapshot.price
    ) {
      return null;
    }
    return snapshot;
  } catch {
    return null;
  }
}

export const getCatalog = cache(async (): Promise<Catalog> => {
  const [sizes, flavors, frostings, decorations] = await Promise.all([
    prisma.cakeSize.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.flavor.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.frosting.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.decoration.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return {
    sizes,
    flavors,
    frostings,
    decorations: decorations.map((decoration) => ({
      ...decoration,
      icon: decoration.icon as DecorationIcon,
    })),
  };
});

export const getAdminCatalog = cache(async (): Promise<Catalog> => {
  const [sizes, flavors, frostings, decorations] = await Promise.all([
    prisma.cakeSize.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.flavor.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.frosting.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.decoration.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return {
    sizes,
    flavors,
    frostings,
    decorations: decorations.map((decoration) => ({
      ...decoration,
      icon: decoration.icon as DecorationIcon,
    })),
  };
});

export const getPresets = cache(async (): Promise<PresetView[]> => {
  const [presets, catalog] = await Promise.all([
    prisma.preset.findMany({ orderBy: { sortOrder: "asc" } }),
    getCatalog(),
  ]);

  return presets.flatMap((preset) => {
    const config = parseConfig(preset.configJson);
    if (!config) {
      return [];
    }
    const resolved = resolveDesign(config, catalog);
    if (!resolved) {
      return [];
    }
    return [
      {
        id: preset.id,
        name: preset.name,
        tagline: preset.tagline,
        description: preset.description,
        featured: preset.featured,
        resolved,
      },
    ];
  });
});

export const getFeaturedPresets = cache(async (limit = 3) => {
  const presets = await getPresets();
  return presets.filter((preset) => preset.featured).slice(0, limit);
});

export async function getPreset(id: string) {
  const presets = await getPresets();
  return presets.find((preset) => preset.id === id) ?? null;
}

export type SavedDesignView = {
  id: string;
  name: string;
  priceCents: number;
  thumbnail: string | null;
  updatedAt: Date;
  resolved: ResolvedDesign | null;
};

export async function getDesignForStudio(id: string, userId: string) {
  const [design, catalog] = await Promise.all([
    prisma.design.findFirst({ where: { id, userId } }),
    getCatalog(),
  ]);
  if (!design) {
    return null;
  }
  const config = parseConfig(design.configJson);
  if (!config) {
    return null;
  }
  return {
    id: design.id,
    name: design.name,
    config,
    resolved: resolveDesign(config, catalog),
  };
}

export async function getUserDesigns(userId: string): Promise<SavedDesignView[]> {
  const [designs, catalog] = await Promise.all([
    prisma.design.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    }),
    getCatalog(),
  ]);

  return designs.map((design) => {
    const config = parseConfig(design.configJson);
    return {
      id: design.id,
      name: design.name,
      priceCents: design.priceCents,
      thumbnail: design.thumbnail,
      updatedAt: design.updatedAt,
      resolved: config ? resolveDesign(config, catalog) : null,
    };
  });
}

export async function getDesignForCheckout(id: string, userId: string) {
  return getDesignForStudio(id, userId);
}

export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      orderNumber: true,
      designName: true,
      totalCents: true,
      pickupDate: true,
      pickupSlot: true,
      status: true,
      createdAt: true,
      design: { select: { thumbnail: true, configJson: true } },
    },
  });
}

export async function getOrderForUser(id: string, userId: string) {
  return prisma.order.findFirst({
    where: { id, userId },
    include: {
      design: { select: { id: true, name: true, thumbnail: true } },
    },
  });
}

export async function getAdminDashboard() {
  const today = new Date().toISOString().slice(0, 10);
  const [totalOrders, pendingOrders, upcomingOrders, revenue, designs, customers, recentOrders, nextPickups] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({
        where: {
          pickupDate: { gte: today },
          status: { notIn: ["COMPLETED", "CANCELLED"] },
        },
      }),
      prisma.order.aggregate({
        _sum: { totalCents: true },
        where: { status: { not: "CANCELLED" } },
      }),
      prisma.design.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true,
          orderNumber: true,
          designName: true,
          customerName: true,
          totalCents: true,
          pickupDate: true,
          status: true,
        },
      }),
      prisma.order.findMany({
        where: {
          pickupDate: { gte: today },
          status: { notIn: ["COMPLETED", "CANCELLED"] },
        },
        orderBy: { pickupDate: "asc" },
        take: 5,
        select: {
          id: true,
          orderNumber: true,
          designName: true,
          customerName: true,
          pickupDate: true,
          pickupSlot: true,
          status: true,
        },
      }),
    ]);

  return {
    stats: {
      totalOrders,
      pendingOrders,
      upcomingOrders,
      revenueCents: revenue._sum.totalCents ?? 0,
      designs,
      customers,
    },
    recentOrders,
    nextPickups,
  };
}

export async function getAdminOrders(status?: OrderStatus) {
  return prisma.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    take: 80,
    select: {
      id: true,
      orderNumber: true,
      designName: true,
      customerName: true,
      email: true,
      totalCents: true,
      pickupDate: true,
      pickupSlot: true,
      status: true,
      createdAt: true,
    },
  });
}

export async function getAdminOrder(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      design: { select: { id: true, name: true, thumbnail: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function getOrderStatsByStatus() {
  const counts = await prisma.order.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  return Object.fromEntries(
    counts.map((count) => [count.status, count._count._all]),
  ) as Record<string, number>;
}
