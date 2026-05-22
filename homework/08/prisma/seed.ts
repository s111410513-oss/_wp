import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.score.createMany({
    data: [
      { playerName: "Alice", attempts: 5 },
      { playerName: "Bob", attempts: 7 },
      { playerName: "Charlie", attempts: 3 },
    ],
  });
  console.log("Seeded 3 scores");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
