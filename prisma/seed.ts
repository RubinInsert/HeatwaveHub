// prisma/seed.ts
import { PrismaClient } from "./generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const adapter = new PrismaPg(pool);
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function main() {
  console.log("Seeding database...");

  // 1. Clear existing data (Optional, but prevents duplicates)
  await prisma.option.deleteMany();
  await prisma.question.deleteMany();

  // 2. Add your variable questions
  await prisma.question.create({
    data: {
      text: "Are you experiencing any of these symptoms?",
      slug: "heat-symptoms",
      category: "Symptoms",
      options: {
        create: [
          { label: "Extreme Thirst", icon: "💧", score: 10 },
          { label: "Dizziness", icon: "🌀", score: 15 },
          { label: "Muscle Cramps", icon: "💪", score: 5 },
          { label: "None", icon: "✅", score: 0 },
        ],
      },
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
