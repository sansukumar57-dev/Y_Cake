export const STAND_TOP = 0.39;

const TIER_RADII: Record<number, number[]> = {
  1: [1.35],
  2: [1.45, 1.0],
  3: [1.55, 1.15, 0.82],
};

const TIER_HEIGHTS: Record<number, number[]> = {
  1: [1.0],
  2: [0.86, 0.8],
  3: [0.82, 0.76, 0.7],
};

export type CakeLayout = {
  tiers: Array<{
    radius: number;
    height: number;
    baseY: number;
    centerY: number;
    topY: number;
  }>;
  bottomRadius: number;
  topRadius: number;
  topY: number;
  targetY: number;
  height: number;
};

export function getCakeLayout(tierCount: number): CakeLayout {
  const radii = TIER_RADII[tierCount] ?? TIER_RADII[1];
  const heights = TIER_HEIGHTS[tierCount] ?? TIER_HEIGHTS[1];
  let cursor = STAND_TOP;

  const tiers = radii.map((radius, index) => {
    const height = heights[index] ?? 0.78;
    const baseY = cursor;
    cursor += height;
    return {
      radius,
      height,
      baseY,
      centerY: baseY + height / 2,
      topY: cursor,
    };
  });

  const bottomRadius = tiers[0]?.radius ?? 1.35;
  const topRadius = tiers[tiers.length - 1]?.radius ?? 1.35;
  const height = cursor - STAND_TOP;

  return {
    tiers,
    bottomRadius,
    topRadius,
    topY: cursor,
    targetY: STAND_TOP + height * 0.48,
    height,
  };
}

export function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}
