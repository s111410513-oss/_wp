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

  await prisma.user.update({
    where: { username: username.trim() },
    data: { title },
  });

  return NextResponse.json({ title, message: "Title updated" });
}
