import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || typeof username !== "string" || username.trim().length === 0) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }
  if (!password || typeof password !== "string" || password.length < 3) {
    return NextResponse.json({ error: "Password must be at least 3 characters" }, { status: 400 });
  }

  const name = username.trim();

  const existing = await prisma.user.findUnique({ where: { username: name } });
  if (existing) {
    return NextResponse.json({ error: "Username already exists" }, { status: 409 });
  }

  const hash = createHash("sha256").update(password).digest("hex");

  await prisma.user.create({
    data: { username: name, password: hash },
  });

  return NextResponse.json({ username: name, title: "初心者", message: "Registration successful" });
}
