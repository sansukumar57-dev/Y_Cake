export type FrostingColor = {
  name: string;
  hex: string;
};

export const FROSTING_COLORS: FrostingColor[] = [
  { name: "Ivory", hex: "#F3E9D8" },
  { name: "Blush", hex: "#E7C0B7" },
  { name: "Rose", hex: "#C98B84" },
  { name: "Sage", hex: "#B7C2A8" },
  { name: "Pistachio", hex: "#DCE0C4" },
  { name: "Butter", hex: "#F0DCA8" },
  { name: "Dusty blue", hex: "#B3C5CE" },
  { name: "Cocoa", hex: "#6B4A3A" },
];

export function getFrostingColor(hex: string): FrostingColor | undefined {
  return FROSTING_COLORS.find(
    (color) => color.hex.toLowerCase() === hex.toLowerCase(),
  );
}

function clamp(value: number) {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clamp(channel).toString(16).padStart(2, "0"))
    .join("")}`;
}

export function shadeHex(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);
  const target = amount < 0 ? 0 : 255;
  const ratio = Math.abs(amount);
  return rgbToHex(
    r + (target - r) * ratio,
    g + (target - g) * ratio,
    b + (target - b) * ratio,
  );
}

export function lightenHex(hex: string, amount: number) {
  return shadeHex(hex, amount);
}

export function darkenHex(hex: string, amount: number) {
  return shadeHex(hex, -amount);
}

export function isLightHex(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 > 168;
}
