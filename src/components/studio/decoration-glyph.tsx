import type { DecorationIcon } from "@/lib/types";

export function DecorationGlyph({
  icon,
  className,
}: {
  icon: DecorationIcon;
  className?: string;
}) {
  const common = {
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };

  switch (icon) {
    case "berries":
      return (
        <svg {...common}>
          <circle cx="12" cy="19" r="4.2" />
          <circle cx="20" cy="21" r="4.8" />
          <circle cx="18" cy="13" r="3.4" />
          <path d="M16 9c1.6-2.8 4.4-3.8 7-3.3-.8 2.8-3.3 4.5-6.2 4.5" />
        </svg>
      );
    case "roses":
      return (
        <svg {...common}>
          <path d="M16 12.2c1.8-2.4 4.9-2.2 6.2.2 1.4 2.6-.2 5.5-3 6.1-2.6.6-5-1.7-4.2-4.2" />
          <path d="M17.4 13.7c.8-.8 2.1-.5 2.4.5.4 1.2-.7 2.1-1.8 1.9" />
          <path d="M10.8 20.5c2.8-1.3 6.2-1.4 9.6-.2" />
          <path d="M15.8 21.8c-1.8 1.2-2.4 3-2 5" />
          <path d="M18.4 21.6c1.7 1.5 2 3.2 1.5 4.6" />
        </svg>
      );
    case "macarons":
      return (
        <svg {...common}>
          <rect x="6.5" y="10.5" width="19" height="5.2" rx="2.6" />
          <rect x="7.5" y="16.3" width="17" height="2.4" rx="1.2" />
          <rect x="6.5" y="19.5" width="19" height="5.2" rx="2.6" />
          <path d="M9.5 12.5h4" opacity=".45" />
        </svg>
      );
    case "chocolate":
      return (
        <svg {...common}>
          <path d="M9 24.5 13 7.5l6.8 8.2 3.4-2.2-2.6 11H9Z" />
          <path d="M13 7.5v17" opacity=".4" />
        </svg>
      );
    case "gold":
      return (
        <svg {...common}>
          <path d="m16 6 2.2 5.2L23 13l-4.8 1.8L16 20l-2.2-5.2L9 13l4.8-1.8L16 6Z" />
          <path d="m24 20 .9 2.1 2.1.9-2.1.9L24 26l-.9-2.1-2.1-.9 2.1-.9L24 20Z" />
          <path d="m8 21 .7 1.6 1.6.7-1.6.7L8 25.6l-.7-1.6-1.6-.7 1.6-.7L8 21Z" />
        </svg>
      );
    case "candles":
      return (
        <svg {...common}>
          <path d="M10 26V14M16 26V11M22 26V15" />
          <path d="M10 9c1.5 1.3 1.5 3-.1 4.2C8.4 12 8.4 10.3 10 9ZM16 6c1.5 1.3 1.5 3-.1 4.2C14.4 9 14.4 7.3 16 6ZM22 10c1.5 1.3 1.5 3-.1 4.2C20.4 13 20.4 11.3 22 10Z" />
        </svg>
      );
  }
}
