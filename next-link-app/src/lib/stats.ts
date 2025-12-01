import { prisma } from "./prisma";

const GLOBAL_STATS_ID = "global";

export async function incrementTotalLinks() {
  return prisma.stats.upsert({
    where: { id: GLOBAL_STATS_ID },
    create: { id: GLOBAL_STATS_ID, totalLinks: 1, totalShortLinks: 0 },
    update: { totalLinks: { increment: 1 } },
    select: { totalLinks: true, totalShortLinks: true },
  });
}

export async function incrementTotalShortLinks() {
  return prisma.stats.upsert({
    where: { id: GLOBAL_STATS_ID },
    create: { id: GLOBAL_STATS_ID, totalLinks: 0, totalShortLinks: 1 },
    update: { totalShortLinks: { increment: 1 } },
    select: { totalLinks: true, totalShortLinks: true },
  });
}

export async function getGlobalStats() {
  try {
    const stats = await prisma.stats.findUnique({
      where: { id: GLOBAL_STATS_ID },
      select: { totalLinks: true, totalShortLinks: true },
    });
    return (
      stats ?? {
        totalLinks: 0,
        totalShortLinks: 0,
      }
    );
  } catch (error) {
    // If the Stats table doesn't exist yet (no migration/db push), fall back to zeros.
    console.error("Failed to read global stats", error);
    return {
      totalLinks: 0,
      totalShortLinks: 0,
    };
  }
}
