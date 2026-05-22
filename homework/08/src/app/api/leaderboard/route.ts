import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const difficulty = req.nextUrl.searchParams.get("difficulty");

  const where = difficulty ? { difficulty } : {};

  const scores = await prisma.score.findMany({
    where,
    orderBy: { attempts: "asc" },
    take: 50,
  });

  return NextResponse.json(scores);
}
