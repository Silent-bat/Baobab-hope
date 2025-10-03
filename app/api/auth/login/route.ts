import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  authenticateUser,
  createSession,
  checkRateLimit,
} from "@/lib/auth/auth";
import { cookies } from "next/headers";

const loginSchema = z.object({
  email: z.string(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.parse(body);
    const { email, password, rememberMe } = {
      email: parsed.email,
      password: parsed.password,
      rememberMe: parsed.rememberMe || false,
    };

    // Check rate limiting
    if (!checkRateLimit(email)) {
      return NextResponse.json(
        {
          error: "Too many login attempts. Please try again in 15 minutes.",
        },
        { status: 429 },
      );
    }

    // Authenticate user
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid email or password",
        },
        { status: 401 },
      );
    }

    // Check if user has admin access
    if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(user.role)) {
      return NextResponse.json(
        {
          error: "Access denied. Admin privileges required.",
        },
        { status: 403 },
      );
    }

    // Create session
    const token = await createSession(user);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60, // 30 days or 24 hours
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error: any) {
    if (error && error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
