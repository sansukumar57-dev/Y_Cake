import { getFrostingColor } from "./colors";
import type {
  Catalog,
  DesignConfig,
  FinishId,
  FinishOption,
  ResolvedDesign,
} from "./types";

export const FINISHES: FinishOption[] = [
  {
    id: "smooth",
    name: "Smooth",
    description: "A clean, hand-smoothed buttercream finish.",
    priceCents: 0,
  },
  {
    id: "swirl",
    name: "Vintage piping",
    description: "Delicate piped pearls around each tier.",
    priceCents: 800,
  },
  {
    id: "drip",
    name: "Chocolate drip",
    description: "A slow ganache drip over the top edges.",
    priceCents: 1400,
  },
];

export const INSCRIPTION_PRICE_CENTS = 800;
export const MAX_INSCRIPTION_LENGTH = 30;

export function getFinish(id: string): FinishOption | undefined {
  return FINISHES.find((finish) => finish.id === id);
}

export function isFinishId(value: string): value is FinishId {
  return FINISHES.some((finish) => finish.id === value);
}

export function createDefaultConfig(catalog: Catalog): DesignConfig {
  const size = catalog.sizes[0];
  const flavor = catalog.flavors[0];
  const frosting = catalog.frostings[0];
  const tierCount = size?.tiers ?? 1;

  return {
    sizeId: size?.id ?? "",
    tiers: Array.from({ length: tierCount }, () => ({
      flavorId: flavor?.id ?? "",
      colorHex: "#F3E9D8",
    })),
    frostingId: frosting?.id ?? "",
    finish: "smooth",
    decorationIds: [],
    inscription: "",
  };
}

export function normalizeConfig(
  config: DesignConfig,
  catalog: Catalog,
): DesignConfig {
  const size = catalog.sizes.find((item) => item.id === config.sizeId);
  const tierCount = size?.tiers ?? 1;
  const fallbackFlavor = catalog.flavors[0]?.id ?? "";
  const fallbackColor = "#F3E9D8";
  const tiers = Array.from({ length: tierCount }, (_, index) => {
    const tier = config.tiers[index];
    return {
      flavorId:
        tier && catalog.flavors.some((flavor) => flavor.id === tier.flavorId)
          ? tier.flavorId
          : fallbackFlavor,
      colorHex:
        tier && getFrostingColor(tier.colorHex)
          ? tier.colorHex
          : fallbackColor,
    };
  });

  return {
    ...config,
    tiers,
    frostingId: catalog.frostings.some(
      (frosting) => frosting.id === config.frostingId,
    )
      ? config.frostingId
      : (catalog.frostings[0]?.id ?? ""),
    finish: isFinishId(config.finish) ? config.finish : "smooth",
    decorationIds: config.decorationIds.filter((id) =>
      catalog.decorations.some((decoration) => decoration.id === id),
    ),
    inscription: config.inscription.slice(0, MAX_INSCRIPTION_LENGTH),
  };
}

export function resolveDesign(
  config: DesignConfig,
  catalog: Catalog,
): ResolvedDesign | null {
  const size = catalog.sizes.find(
    (item) => item.id === config.sizeId && item.active,
  );
  if (!size || config.tiers.length !== size.tiers) {
    return null;
  }

  const tiers: ResolvedDesign["tiers"] = [];
  for (const tier of config.tiers) {
    const flavor = catalog.flavors.find(
      (item) => item.id === tier.flavorId && item.active,
    );
    const color = getFrostingColor(tier.colorHex);
    if (!flavor || !color) {
      return null;
    }
    tiers.push({ flavor, colorHex: color.hex, colorName: color.name });
  }

  const frosting = catalog.frostings.find(
    (item) => item.id === config.frostingId && item.active,
  );
  if (!frosting) {
    return null;
  }

  const finish = getFinish(config.finish);
  if (!finish) {
    return null;
  }

  const uniqueDecorationIds = new Set(config.decorationIds);
  if (uniqueDecorationIds.size !== config.decorationIds.length) {
    return null;
  }

  const decorations = config.decorationIds.map((id) =>
    catalog.decorations.find((item) => item.id === id && item.active),
  );
  if (decorations.some((decoration) => !decoration)) {
    return null;
  }

  const inscription = config.inscription.trim();
  if (inscription.length > MAX_INSCRIPTION_LENGTH) {
    return null;
  }

  const flavorsCents = tiers.reduce(
    (total, tier) => total + tier.flavor.priceCents,
    0,
  );
  const decorationsCents = decorations.reduce(
    (total, decoration) => total + (decoration?.priceCents ?? 0),
    0,
  );
  const inscriptionCents = inscription ? INSCRIPTION_PRICE_CENTS : 0;
  const totalCents =
    size.basePriceCents +
    flavorsCents +
    frosting.priceCents +
    finish.priceCents +
    decorationsCents +
    inscriptionCents;

  return {
    config: { ...config, inscription },
    size,
    tiers,
    frosting,
    finish,
    decorations: decorations.filter(
      (decoration): decoration is NonNullable<typeof decoration> =>
        Boolean(decoration),
    ),
    inscription,
    servings: size.servings,
    price: {
      baseCents: size.basePriceCents,
      flavorsCents,
      frostingCents: frosting.priceCents,
      finishCents: finish.priceCents,
      decorationsCents,
      inscriptionCents,
      totalCents,
    },
  };
}

export function suggestDesignName(resolved: ResolvedDesign) {
  const topTier = resolved.tiers[resolved.tiers.length - 1];
  const flavorWord = topTier?.flavor.name.split(" ")[0] ?? "Vanilla";
  return `${topTier?.colorName ?? "Ivory"} & ${flavorWord}`;
}

export function configKey(config: DesignConfig) {
  return JSON.stringify(config);
}
