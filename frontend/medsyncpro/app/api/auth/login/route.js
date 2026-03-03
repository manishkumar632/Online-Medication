import { NextResponse } from "next/server";
import { config } from "@/lib/config";

export async function POST(req) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();
    const password = body?.password;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid email format" },
        { status: 400 },
      );
    }

    // Prevent extremely large payload abuse
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

    // Build a structured response with user data for session storage + forward cookies
    const res = NextResponse.json(
      {
        success: responseData.success ?? backendRes.ok,
        message: responseData.message,
        user: responseData.data ?? null,
      },
      { status: backendRes.status },
    );

    // Forward set-cookie headers from backend (JWT token)
    const setCookie = backendRes.headers.get("set-cookie");
    if (setCookie) {
      res.headers.set("set-cookie", setCookie);
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
