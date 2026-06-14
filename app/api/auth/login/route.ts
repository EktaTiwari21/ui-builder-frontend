import { NextResponse } from "next/server";

/**
 * Server-side login handler that authenticates a user against Supabase.
 * Returns the JWT access_token to the client.
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const supabaseUrl = process.env.SUPABASE_URL || "https://urrgttatzxcmuxphswdj.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "Supabase service key is not configured on the server." },
        { status: 500 }
      );
    }

    const loginRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
      },
      body: JSON.stringify({ email, password }),
    });

    const loginData = await loginRes.json();

    if (!loginRes.ok) {
      return NextResponse.json(
        { error: loginData.error_description || loginData.message || "Invalid email or password." },
        { status: loginRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      token: loginData.access_token,
      refresh_token: loginData.refresh_token,
      user: loginData.user,
    });
  } catch (error) {
    console.error("Login handler error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
