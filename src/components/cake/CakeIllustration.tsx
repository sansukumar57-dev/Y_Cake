import { darkenHex, lightenHex } from "@/lib/colors";
import type { ResolvedDesign } from "@/lib/types";
import { seededRandom } from "@/lib/random";

const TIER_WIDTHS: Record<number, number[]> = {
  1: [220],
  2: [232, 174],
  3: [240, 188, 136],
};

const TIER_HEIGHT = 76;
const STACK_BOTTOM = 286;
const CENTER_X = 210;

function flower(
  x: number,
  y: number,
  scale: number,
  tone: "rose" | "blush",
) {
  const petal = tone === "rose" ? "#C98B84" : "#DCAFA7";
  const petals = Array.from({ length: 6 }, (_, index) => {
    const angle = (index / 6) * Math.PI * 2;
    return {
      x: Math.cos(angle) * 6.5,
      y: Math.sin(angle) * 6.5,
    };
  });

  return (
    <g key={`${x}-${y}`} transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="10" cy="6" rx="9" ry="4" fill="#7E8F70" opacity="0.9" transform="rotate(20)" />
      <ellipse cx="-10" cy="7" rx="7" ry="3.2" fill="#8B9B7C" opacity="0.9" transform="rotate(-25)" />
      {petals.map((petal, index) => (
        <circle
          key={`petal-${index}`}
          cx={petal.x}
          cy={petal.y}
          r="6.4"
          fill={index % 2 === 0 ? petal : lightenHex(petal, 0.08)}
        />
      ))}
      <circle cx="0" cy="0" r="5.2" fill={darkenHex(petal, 0.08)} />
      <circle cx="-1.5" cy="-1.5" r="1.6" fill={lightenHex(petal, 0.18)} opacity="0.7" />
    </g>
  );
}

function macaron(x: number, y: number, color: string, rotation: number) {
  return (
    <g key={`macaron-${x}`} transform={`translate(${x} ${y}) rotate(${rotation})`}>
      <rect x="-12" y="-14" width="24" height="7" rx="3.5" fill={color} />
      <rect x="-11" y="-7" width="22" height="3.4" rx="1.7" fill="#F6E8CE" />
      <rect x="-12" y="-3.6" width="24" height="7" rx="3.5" fill={color} />
      <ellipse cx="-4" cy="-11" rx="3.2" ry="1.4" fill="#FFFFFF" opacity="0.22" />
    </g>
  );
}

export function CakeIllustration({
  resolved,
  className,
  showHalo = true,
}: {
  resolved: ResolvedDesign;
  className?: string;
  showHalo?: boolean;
}) {
  const tierCount = resolved.tiers.length;
  const widths = TIER_WIDTHS[tierCount] ?? TIER_WIDTHS[1];
  const topWidth = widths[widths.length - 1];
  const topY = STACK_BOTTOM - tierCount * TIER_HEIGHT;
  const icons = new Set(resolved.decorations.map((decoration) => decoration.icon));
  const uniqueColors = Array.from(
    new Set(resolved.tiers.map((tier) => tier.colorHex.toLowerCase())),
  );
  const seedBase = resolved.inscription.length + tierCount * 17;
  const random = seededRandom(seedBase + 23);

  const candleXs = [CENTER_X - 22, CENTER_X, CENTER_X + 22];
  const goldFlakes = Array.from({ length: 14 }, () => ({
    x: CENTER_X - topWidth * 0.38 + random() * topWidth * 0.76,
    y: topY + 2 + random() * 16,
    size: 2.2 + random() * 2.6,
  }));
  const berries = Array.from({ length: 8 }, (_, index) => ({
    x: CENTER_X - topWidth * 0.34 + (index / 7) * topWidth * 0.68,
    y: topY + 8 + (index % 3) * 3,
    blue: index % 3 === 0,
    size: 3.1 + (index % 2) * 0.6,
  }));

  return (
    <svg
      viewBox="0 0 420 400"
      role="img"
      aria-label={`Illustration of a ${resolved.size.name.toLowerCase()} cake with ${resolved.tiers
        .map((tier) => tier.colorName.toLowerCase())
        .join(", ")} tiers`}
      className={className}
    >
      <defs>
        {uniqueColors.map((color) => (
          <linearGradient
            key={color}
            id={`cake-tier-${color.replace("#", "")}`}
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0" stopColor={darkenHex(color, 0.12)} />
            <stop offset="0.22" stopColor={color} />
            <stop offset="0.58" stopColor={lightenHex(color, 0.035)} />
            <stop offset="1" stopColor={darkenHex(color, 0.1)} />
          </linearGradient>
        ))}
        <radialGradient id="cake-halo">
          <stop offset="0" stopColor="#F4E5D6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F4E5D6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cake-plate" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7EFE4" />
          <stop offset="1" stopColor="#E7D9C6" />
        </linearGradient>
        <linearGradient id="cake-stem" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#DCCDBA" />
          <stop offset="0.45" stopColor="#F2E8DA" />
          <stop offset="1" stopColor="#D6C5B1" />
        </linearGradient>
        <filter id="cake-stand-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {showHalo ? (
        <ellipse cx="210" cy="190" rx="190" ry="170" fill="url(#cake-halo)" />
      ) : null}

      <ellipse
        cx="210"
        cy="344"
        rx="118"
        ry="10"
        fill="#2C211B"
        opacity="0.16"
        filter="url(#cake-stand-shadow)"
      />

      <g>
        <ellipse cx="210" cy="292" rx={topWidth / 2 + 42} ry="15" fill="url(#cake-plate)" />
        <ellipse
          cx="210"
          cy="289"
          rx={topWidth / 2 + 42}
          ry="13"
          fill="none"
          stroke="#B08D57"
          strokeOpacity="0.55"
          strokeWidth="1.2"
        />
        <rect x="203" y="298" width="14" height="30" fill="url(#cake-stem)" />
        <ellipse cx="210" cy="330" rx="38" ry="9" fill="#E4D5C2" />
        <ellipse cx="210" cy="333" rx="34" ry="6" fill="#D8C6B0" opacity="0.7" />
      </g>

      {icons.has("macarons") ? (
        <g>
          {macaron(72, 276, "#E8BDB4", -12)}
          {macaron(346, 276, "#DCE0C4", 10)}
          {macaron(320, 282, "#C9BED3", -4)}
        </g>
      ) : null}

      {resolved.tiers.map((tier, index) => {
        const width = widths[index] ?? widths[0];
        const height = TIER_HEIGHT;
        const y = STACK_BOTTOM - (index + 1) * height;
        const left = CENTER_X - width / 2;
        const color = tier.colorHex.toLowerCase();
        const dark = darkenHex(color, 0.42);
        const pearlCount = Math.floor(width / 18);
        const dripRandom = seededRandom(seedBase + index * 41 + 7);
        const drips = Array.from({ length: Math.floor(width / 21) }, (_, dripIndex) => {
          const x = left + 9 + (dripIndex / Math.max(1, Math.floor(width / 21) - 1)) * (width - 18);
          const length = 7 + dripRandom() * 22;
          return { x, length };
        });

        return (
          <g key={`tier-${index}`}>
            <rect
              x={left}
              y={y}
              width={width}
              height={height}
              rx="15"
              fill={`url(#cake-tier-${color.replace("#", "")})`}
            />
            <ellipse
              cx={CENTER_X}
              cy={y}
              rx={width / 2}
              ry="11.5"
              fill={lightenHex(color, 0.08)}
            />
            <ellipse
              cx={CENTER_X}
              cy={y}
              rx={width / 2 - 4}
              ry="9"
              fill={lightenHex(color, 0.13)}
              opacity="0.55"
            />

            {resolved.finish.id === "swirl" ? (
              <g>
                {Array.from({ length: pearlCount }, (_, pearlIndex) => {
                  const x = left + (pearlIndex / pearlCount) * width + 4;
                  return (
                    <circle
                      key={`pearl-${pearlIndex}`}
                      cx={x}
                      cy={y + 1}
                      r="3.5"
                      fill={lightenHex(color, 0.16)}
                      stroke={darkenHex(color, 0.04)}
                      strokeWidth="0.4"
                    />
                  );
                })}
              </g>
            ) : null}

            {resolved.finish.id === "drip" ? (
              <g>
                {drips.map((drip, dripIndex) => (
                  <g key={`drip-${dripIndex}`}>
                    <rect
                      x={drip.x - 2.6}
                      y={y + 1}
                      width="5.2"
                      height={drip.length}
                      rx="2.6"
                      fill={dark}
                    />
                    <circle
                      cx={drip.x}
                      cy={y + drip.length}
                      r="2.9"
                      fill={dark}
                    />
                  </g>
                ))}
              </g>
            ) : null}
          </g>
        );
      })}

      {resolved.inscription ? (
        <g>
          <rect
            x="150"
            y={STACK_BOTTOM - 44}
            width="120"
            height="27"
            rx="5"
            fill="#3A241B"
            stroke="#B08D57"
            strokeWidth="0.8"
          />
          <text
            x="210"
            y={STACK_BOTTOM - 26}
            textAnchor="middle"
            fill="#F0DCA8"
            fontFamily="Fraunces Variable, Georgia, serif"
            fontStyle="italic"
            fontSize={resolved.inscription.length > 18 ? 7.4 : 9.4}
          >
            {resolved.inscription}
          </text>
        </g>
      ) : null}

      {icons.has("chocolate") ? (
        <g>
          <polygon
            points={`${CENTER_X - 18},${topY + 2} ${CENTER_X - 8},${topY - 46} ${CENTER_X + 2},${topY + 2}`}
            fill="#3E2821"
          />
          <polygon
            points={`${CENTER_X + 4},${topY + 2} ${CENTER_X + 16},${topY - 34} ${CENTER_X + 24},${topY + 2}`}
            fill="#52352A"
          />
          <polygon
            points={`${CENTER_X + 22},${topY + 2} ${CENTER_X + 32},${topY - 24} ${CENTER_X + 40},${topY + 2}`}
            fill="#3E2821"
          />
        </g>
      ) : null}

      {icons.has("candles") ? (
        <g>
          {candleXs.map((x, index) => (
            <g key={`candle-${index}`}>
              <rect
                x={x - 2.1}
                y={topY - 38}
                width="4.2"
                height="38"
                rx="2"
                fill="#F0E3C8"
                stroke="#DCC9A9"
                strokeWidth="0.5"
              />
              <path
                d={`M ${x} ${topY - 54} C ${x + 6} ${topY - 46}, ${x + 4} ${topY - 40}, ${x} ${topY - 38} C ${x - 4} ${topY - 40}, ${x - 6} ${topY - 46}, ${x} ${topY - 54} Z`}
                fill="#EBA255"
              />
              <circle cx={x} cy={topY - 44} r="1.6" fill="#FFF0C8" opacity="0.9" />
            </g>
          ))}
        </g>
      ) : null}

      {icons.has("roses") ? (
        <g>
          {flower(CENTER_X - topWidth * 0.22, topY + 5, 0.95, "rose")}
          {flower(CENTER_X + 2, topY + 2, 1.15, "blush")}
          {flower(CENTER_X + topWidth * 0.24, topY + 7, 0.82, "rose")}
        </g>
      ) : null}

      {icons.has("berries") ? (
        <g>
          {berries.map((berry, index) => (
            <circle
              key={`berry-${index}`}
              cx={berry.x}
              cy={berry.y}
              r={berry.size}
              fill={berry.blue ? "#3D4A66" : "#8C3440"}
            />
          ))}
          <ellipse
            cx={CENTER_X + topWidth * 0.3}
            cy={topY + 16}
            rx="8"
            ry="3"
            fill="#7E8F70"
            transform={`rotate(18 ${CENTER_X + topWidth * 0.3} ${topY + 16})`}
          />
        </g>
      ) : null}

      {icons.has("gold") ? (
        <g>
          {goldFlakes.map((flake, index) => (
            <path
              key={`gold-${index}`}
              d={`M ${flake.x} ${flake.y - flake.size} l ${flake.size * 0.7} ${flake.size} l -${flake.size * 0.7} ${flake.size} l -${flake.size * 0.7} -${flake.size} Z`}
              fill="#C9A45B"
              opacity="0.92"
            />
          ))}
        </g>
      ) : null}
    </svg>
  );
}
