import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/password";
import { resolveDesign } from "../src/lib/pricing";
import type { Catalog, DesignConfig } from "../src/lib/types";

const prisma = new PrismaClient();

const colors = {
  ivory: "#F3E9D8",
  blush: "#E7C0B7",
  rose: "#C98B84",
  sage: "#B7C2A8",
  pistachio: "#DCE0C4",
  butter: "#F0DCA8",
  blue: "#B3C5CE",
  cocoa: "#6B4A3A",
};

const sizes = [
  {
    id: "size-petite",
    name: "Petite",
    description: "One 6-inch tier for a small table.",
    tiers: 1,
    servings: 10,
    basePriceCents: 6500,
    active: true,
    sortOrder: 1,
  },
  {
    id: "size-classic",
    name: "Classic",
    description: "Two tiers with room for a crowd.",
    tiers: 2,
    servings: 24,
    basePriceCents: 11000,
    active: true,
    sortOrder: 2,
  },
  {
    id: "size-grand",
    name: "Grand",
    description: "Three tiers for a proper celebration.",
    tiers: 3,
    servings: 40,
    basePriceCents: 15500,
    active: true,
    sortOrder: 3,
  },
];

const flavors = [
  {
    id: "flavor-vanilla",
    name: "Vanilla bean",
    description: "Madagascar vanilla with a buttermilk crumb.",
    priceCents: 0,
    active: true,
    sortOrder: 1,
  },
  {
    id: "flavor-chocolate",
    name: "Dark chocolate",
    description: "Seventy percent cocoa with a brown-butter crumb.",
    priceCents: 400,
    active: true,
    sortOrder: 2,
  },
  {
    id: "flavor-pistachio",
    name: "Pistachio",
    description: "Roasted pistachio cream and toasted almond.",
    priceCents: 700,
    active: true,
    sortOrder: 3,
  },
  {
    id: "flavor-lemon",
    name: "Lemon & elderflower",
    description: "Amalfi lemon curd with elderflower cream.",
    priceCents: 500,
    active: true,
    sortOrder: 4,
  },
  {
    id: "flavor-redvelvet",
    name: "Red velvet",
    description: "Cocoa crumb with a tangy cream cheese layer.",
    priceCents: 600,
    active: true,
    sortOrder: 5,
  },
  {
    id: "flavor-rose",
    name: "Almond rose",
    description: "Toasted almond sponge with a whisper of rosewater.",
    priceCents: 700,
    active: true,
    sortOrder: 6,
  },
];

const frostings = [
  {
    id: "frosting-swiss",
    name: "Swiss meringue",
    description: "Silky buttercream, lightly sweet.",
    priceCents: 0,
    active: true,
    sortOrder: 1,
  },
  {
    id: "frosting-creamcheese",
    name: "Cream cheese",
    description: "Soft, tangy, and a little indulgent.",
    priceCents: 400,
    active: true,
    sortOrder: 2,
  },
  {
    id: "frosting-ganache",
    name: "Chocolate ganache",
    description: "Dark, glossy, and rich.",
    priceCents: 600,
    active: true,
    sortOrder: 3,
  },
  {
    id: "frosting-mascarpone",
    name: "Mascarpone cream",
    description: "Whipped mascarpone with a light finish.",
    priceCents: 700,
    active: true,
    sortOrder: 4,
  },
];

const decorations = [
  {
    id: "deco-berries",
    name: "Market berries",
    description: "Seasonal berries tucked at the base.",
    priceCents: 1200,
    icon: "berries",
    active: true,
    sortOrder: 1,
  },
  {
    id: "deco-roses",
    name: "Garden roses",
    description: "Hand-piped buttercream roses.",
    priceCents: 1800,
    icon: "roses",
    active: true,
    sortOrder: 2,
  },
  {
    id: "deco-macarons",
    name: "Macarons",
    description: "Three house-made macarons.",
    priceCents: 1400,
    icon: "macarons",
    active: true,
    sortOrder: 3,
  },
  {
    id: "deco-chocolate",
    name: "Chocolate shards",
    description: "Tempered dark chocolate, set on the top tier.",
    priceCents: 1000,
    icon: "chocolate",
    active: true,
    sortOrder: 4,
  },
  {
    id: "deco-gold",
    name: "Gold leaf",
    description: "A quiet scatter of edible gold.",
    priceCents: 900,
    icon: "gold",
    active: true,
    sortOrder: 5,
  },
  {
    id: "deco-candles",
    name: "Birthday candles",
    description: "Three slim beeswax candles.",
    priceCents: 600,
    icon: "candles",
    active: true,
    sortOrder: 6,
  },
];

const presets = [
  {
    id: "preset-jardin",
    name: "The Jardin",
    tagline: "Sage, blush, and garden roses",
    description:
      "Three quiet tiers with pistachio, almond rose, and vanilla. Finished with piped roses, market berries, and a little gold.",
    featured: true,
    sortOrder: 1,
    config: {
      sizeId: "size-grand",
      tiers: [
        { flavorId: "flavor-rose", colorHex: colors.sage },
        { flavorId: "flavor-pistachio", colorHex: colors.blush },
        { flavorId: "flavor-vanilla", colorHex: colors.ivory },
      ],
      frostingId: "frosting-swiss",
      finish: "smooth",
      decorationIds: ["deco-roses", "deco-berries", "deco-gold"],
      inscription: "Happy days",
    },
  },
  {
    id: "preset-noir",
    name: "Noir",
    tagline: "Dark chocolate and dusty blue",
    description:
      "A two-tier study in contrast: cocoa buttercream against dusty blue, dark chocolate, gold leaf, and a slow ganache drip.",
    featured: true,
    sortOrder: 2,
    config: {
      sizeId: "size-classic",
      tiers: [
        { flavorId: "flavor-chocolate", colorHex: colors.cocoa },
        { flavorId: "flavor-redvelvet", colorHex: colors.blue },
      ],
      frostingId: "frosting-ganache",
      finish: "drip",
      decorationIds: ["deco-gold", "deco-chocolate"],
      inscription: "",
    },
  },
  {
    id: "preset-clementine",
    name: "The Clementine",
    tagline: "Butter yellow and citrus",
    description:
      "Lemon and vanilla tiers under mascarpone cream, scattered with macarons and the first berries of the season.",
    featured: true,
    sortOrder: 3,
    config: {
      sizeId: "size-classic",
      tiers: [
        { flavorId: "flavor-lemon", colorHex: colors.butter },
        { flavorId: "flavor-vanilla", colorHex: colors.ivory },
      ],
      frostingId: "frosting-mascarpone",
      finish: "smooth",
      decorationIds: ["deco-macarons", "deco-berries"],
      inscription: "Celebrate",
    },
  },
  {
    id: "preset-petite-blush",
    name: "Petite Blush",
    tagline: "A small cake with a soft finish",
    description:
      "One blush tier of vanilla bean, piped with pearls and finished with roses and berries. Made for a quiet occasion.",
    featured: false,
    sortOrder: 4,
    config: {
      sizeId: "size-petite",
      tiers: [{ flavorId: "flavor-vanilla", colorHex: colors.blush }],
      frostingId: "frosting-swiss",
      finish: "swirl",
      decorationIds: ["deco-berries", "deco-roses"],
      inscription: "For you",
    },
  },
  {
    id: "preset-golden-hour",
    name: "Golden Hour",
    tagline: "Warm neutrals and edible gold",
    description:
      "Three tiers in butter, ivory, and blush with lemon, almond rose, and vanilla. Gold leaf and macarons catch the light.",
    featured: false,
    sortOrder: 5,
    config: {
      sizeId: "size-grand",
      tiers: [
        { flavorId: "flavor-lemon", colorHex: colors.butter },
        { flavorId: "flavor-rose", colorHex: colors.ivory },
        { flavorId: "flavor-vanilla", colorHex: colors.blush },
      ],
      frostingId: "frosting-mascarpone",
      finish: "smooth",
      decorationIds: ["deco-gold", "deco-macarons"],
      inscription: "",
    },
  },
  {
    id: "preset-midnight",
    name: "Midnight",
    tagline: "Candles, cocoa, and a little drama",
    description:
      "Dark chocolate tiers under glossy ganache, with chocolate shards, gold, and three slim candles for the wish.",
    featured: false,
    sortOrder: 6,
    config: {
      sizeId: "size-classic",
      tiers: [
        { flavorId: "flavor-chocolate", colorHex: colors.cocoa },
        { flavorId: "flavor-chocolate", colorHex: colors.ivory },
      ],
      frostingId: "frosting-ganache",
      finish: "drip",
      decorationIds: ["deco-candles", "deco-chocolate", "deco-gold"],
      inscription: "Make a wish",
    },
  },
];

function addDaysIso(days: number) {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function main() {
  for (const size of sizes) {
    await prisma.cakeSize.upsert({
      where: { id: size.id },
      update: size,
      create: size,
    });
  }
  for (const flavor of flavors) {
    await prisma.flavor.upsert({
      where: { id: flavor.id },
      update: flavor,
      create: flavor,
    });
  }
  for (const frosting of frostings) {
    await prisma.frosting.upsert({
      where: { id: frosting.id },
      update: frosting,
      create: frosting,
    });
  }
  for (const decoration of decorations) {
    await prisma.decoration.upsert({
      where: { id: decoration.id },
      update: decoration,
      create: decoration,
    });
  }

  const [adminHash, customerHash, secondCustomerHash] = await Promise.all([
    hashPassword("admin1234"),
    hashPassword("cake1234"),
    hashPassword("cake1234"),
  ]);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ycake.test" },
    update: { name: "Yara Kim", role: "ADMIN", passwordHash: adminHash },
    create: {
      name: "Yara Kim",
      email: "admin@ycake.test",
      passwordHash: adminHash,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "hello@ycake.test" },
    update: { name: "Noor Haddad", passwordHash: customerHash },
    create: {
      name: "Noor Haddad",
      email: "hello@ycake.test",
      passwordHash: customerHash,
      role: "USER",
    },
  });

  const secondCustomer = await prisma.user.upsert({
    where: { email: "elena@ycake.test" },
    update: { name: "Elena Rossi", passwordHash: secondCustomerHash },
    create: {
      name: "Elena Rossi",
      email: "elena@ycake.test",
      passwordHash: secondCustomerHash,
      role: "USER",
    },
  });

  for (const preset of presets) {
    const configJson = JSON.stringify(preset.config);
    const data = {
      name: preset.name,
      tagline: preset.tagline,
      description: preset.description,
      configJson,
      featured: preset.featured,
      sortOrder: preset.sortOrder,
    };
    await prisma.preset.upsert({
      where: { id: preset.id },
      update: data,
      create: { id: preset.id, ...data },
    });
  }

  const catalog: Catalog = {
    sizes,
    flavors,
    frostings,
    decorations: decorations.map((decoration) => ({
      ...decoration,
      icon: decoration.icon as Catalog["decorations"][number]["icon"],
    })),
  };

  const resolvePreset = (index: number) => {
    const resolved = resolveDesign(
      presets[index].config as DesignConfig,
      catalog,
    );
    if (!resolved) {
      throw new Error(`Preset ${presets[index].id} could not be resolved`);
    }
    return resolved;
  };

  const jardin = resolvePreset(0);
  const blush = resolvePreset(3);

  await prisma.design.upsert({
    where: { id: "design-demo-jardin" },
    update: {
      userId: customer.id,
      name: "Garden lunch",
      configJson: JSON.stringify(jardin.config),
      priceCents: jardin.price.totalCents,
    },
    create: {
      id: "design-demo-jardin",
      userId: customer.id,
      name: "Garden lunch",
      configJson: JSON.stringify(jardin.config),
      priceCents: jardin.price.totalCents,
    },
  });

  await prisma.design.upsert({
    where: { id: "design-demo-blush" },
    update: {
      userId: customer.id,
      name: "Sunday, small",
      configJson: JSON.stringify(blush.config),
      priceCents: blush.price.totalCents,
    },
    create: {
      id: "design-demo-blush",
      userId: customer.id,
      name: "Sunday, small",
      configJson: JSON.stringify(blush.config),
      priceCents: blush.price.totalCents,
    },
  });

  const demoOrders = [
    {
      orderNumber: "YC-1042",
      userId: customer.id,
      designId: "design-demo-jardin",
      designName: presets[0].name,
      totalCents: jardin.price.totalCents,
      customerName: "Noor Haddad",
      email: "hello@ycake.test",
      phone: "(718) 555-0142",
      pickupDate: addDaysIso(5),
      pickupSlot: "13:00-15:00",
      notes: "Please leave the inscription as written. Bringing a cooler bag.",
      status: "PENDING",
      design: jardin,
    },
    {
      orderNumber: "YC-1043",
      userId: secondCustomer.id,
      designId: null,
      designName: presets[1].name,
      totalCents: resolvePreset(1).price.totalCents,
      customerName: "Elena Rossi",
      email: "elena@ycake.test",
      phone: "(718) 555-0198",
      pickupDate: addDaysIso(9),
      pickupSlot: "10:00-12:00",
      notes: "It is for an engagement dinner. Thank you.",
      status: "CONFIRMED",
      design: resolvePreset(1),
    },
    {
      orderNumber: "YC-1044",
      userId: customer.id,
      designId: "design-demo-blush",
      designName: presets[3].name,
      totalCents: blush.price.totalCents,
      customerName: "Noor Haddad",
      email: "hello@ycake.test",
      phone: "(718) 555-0142",
      pickupDate: addDaysIso(14),
      pickupSlot: "16:00-18:00",
      notes: "",
      status: "IN_PROGRESS",
      design: blush,
    },
    {
      orderNumber: "YC-1039",
      userId: secondCustomer.id,
      designId: null,
      designName: presets[2].name,
      totalCents: resolvePreset(2).price.totalCents,
      customerName: "Elena Rossi",
      email: "elena@ycake.test",
      phone: "(718) 555-0198",
      pickupDate: addDaysIso(-12),
      pickupSlot: "13:00-15:00",
      notes: "",
      status: "COMPLETED",
      design: resolvePreset(2),
    },
  ];

  for (const order of demoOrders) {
    const { design, ...orderData } = order;
    const data = {
      ...orderData,
      configJson: JSON.stringify(design.config),
      snapshotJson: JSON.stringify(design),
    };
    await prisma.order.upsert({
      where: { orderNumber: order.orderNumber },
      update: data,
      create: data,
    });
  }

  console.log(
    `Seeded ${sizes.length} sizes, ${flavors.length} flavors, ${frostings.length} frostings, ${decorations.length} decorations, ${presets.length} presets and ${demoOrders.length} orders.`,
  );
  console.log(`Admin: admin@ycake.test / admin1234`);
  console.log(`Customer: hello@ycake.test / cake1234`);
  console.log(`Admin id: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
