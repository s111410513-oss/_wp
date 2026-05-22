import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.score.createMany({
    data: [
      { playerName: "Alice", attempts: 5, difficulty: "easy", mode: "normal" },
      { playerName: "Bob", attempts: 7, difficulty: "hard", mode: "normal" },
      { playerName: "Charlie", attempts: 3, difficulty: "easy", mode: "normal" },
      { playerName: "Dave", attempts: 12, difficulty: "extreme", mode: "normal" },
      { playerName: "Eve", attempts: 8, levelsCleared: 3, difficulty: "easy", mode: "challenge" },
      { playerName: "Frank", attempts: 6, levelsCleared: 1, difficulty: "hard", mode: "challenge" },
    ],
  });
  console.log("Seeded 6 scores");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => prisma.$disconnect());
