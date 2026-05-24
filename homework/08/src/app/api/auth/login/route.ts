import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || typeof username !== "string" || username.trim().length === 0) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const name = username.trim();
  const user = await prisma.user.findUnique({ where: { username: name } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }

  const hash = createHash("sha256").update(password).digest("hex");
  if (user.password !== hash) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  return NextResponse.json({ username: name, message: "Login successful" });
}
