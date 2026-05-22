import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.score.createMany({
    data: [
      { playerName: "Alice", attempts: 5, difficulty: "easy" },
      { playerName: "Bob", attempts: 7, difficulty: "hard" },
      { playerName: "Charlie", attempts: 3, difficulty: "easy" },
      { playerName: "Dave", attempts: 12, difficulty: "extreme" },
    ],
  });
  console.log("Seeded 3 scores");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
