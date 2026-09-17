import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import { createSessionToken, SESSION_COOKIE, SESSION_COOKIE_MAX_AGE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: "請輸入帳號與密碼" }, { status: 400 });
  }

  await connectToDatabase();
  const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
  if (!admin) {
    return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "帳號或密碼錯誤" }, { status: 401 });
  }

  const token = await createSessionToken(admin.email);

  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return res;
}
