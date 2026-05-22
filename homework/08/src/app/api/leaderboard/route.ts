import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const scores = await prisma.score.findMany({
    orderBy: { attempts: "asc" },
    take: 50,
  });

  return NextResponse.json(scores);
}
