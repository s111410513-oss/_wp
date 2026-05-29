import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_TITLES = ["管理員", "初心者", "挑戰者", "神之一筆"];

export async function POST(req: NextRequest) {
  const { username, title } = await req.json();

  if (!username || typeof username !== "string") {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }
  if (!title || !VALID_TITLES.includes(title)) {
    return NextResponse.json({ error: "Invalid title" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { username: username.trim() } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const name = username.trim();

  if (title === "管理員" && name !== "King") {
    return NextResponse.json({ error: "Only King can use this title" }, { status: 403 });
  }

  if (title === "挑戰者" && name !== "King") {
    if (!user.challengerUnlocked) {
      return NextResponse.json({ error: "Title locked. Play challenge mode to unlock." }, { status: 403 });
    }
  }

  if (title === "神之一筆" && name !== "King") {
    if (!user.godlyUnlocked) {
      return NextResponse.json({ error: "Title locked. Guess correctly in 1 attempt to unlock." }, { status: 403 });
    }
  }

  await prisma.user.update({
    where: { username: username.trim() },
    data: { title },
  });

  return NextResponse.json({ title, message: "Title updated" });
}
