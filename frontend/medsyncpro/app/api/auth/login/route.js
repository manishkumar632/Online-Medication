// app/api/auth/login/route.js

import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 },
      );
    }

    if (password.length > 32) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 },
      );
    }

    const backendRes = await fetch(`${config.apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let responseData;
    try {
      responseData = await backendRes.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid response from server" },
        { status: 502 },
      );
    }

    const res = NextResponse.json(
      {
        success: responseData.success ?? backendRes.ok,
        message: responseData.message,
        user: responseData.data ?? null,
      },
      { status: backendRes.status },
    );

    // Forward backend cookies (access_token)
    const setCookie = backendRes.headers.get("set-cookie");

    if (setCookie) {
      const tokenMatch = setCookie.match(/access_token=([^;]+)/);

      if (tokenMatch) {
        res.cookies.set("access_token", tokenMatch[1], {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24,
        });
      }
    }

    if (responseData?.data?.role) {
      res.cookies.set("user_role", responseData.data.role, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
      });
    }

    return res;
  } catch (error) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { success: false, message: "Login failed" },
      { status: 500 },
    );
  }
}
