import { NextResponse } from "next/server";

/**
 * Server-side signup handler that registers a user using the Supabase Service Key.
 * It automatically confirms the email for ease of use and inserts a corresponding profiles table row.
 */
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const supabaseUrl = process.env.SUPABASE_URL || "https://urrgttatzxcmuxphswdj.supabase.co";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseServiceKey) {
      return NextResponse.json(
        { error: "Supabase service key is not configured on the server." },
        { status: 500 }
      );
    }

    // 1. Create the user using the admin endpoint so they are auto-confirmed
    const adminRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseServiceKey,
        "Authorization": `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
      }),
    });

    const adminData = await adminRes.json();

    if (!adminRes.ok) {
      return NextResponse.json(
        { error: adminData.msg || adminData.message || "Failed to create user." },
        { status: adminRes.status }
      );
    }

    const userId = adminData.id || (adminData.user && adminData.user.id);

    if (!userId) {
      return NextResponse.json(
        { error: "User created but no ID was returned from database." },
        { status: 500 }
      );
    }

    // 2. Insert the profile row into the profiles table to prevent foreign key errors when building projects
    try {
      const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseServiceKey,
          "Authorization": `Bearer ${supabaseServiceKey}`,
        },
        body: JSON.stringify({
          id: userId,
          name: name || email.split("@")[0],
          subscription_plan: "free",
        }),
      });

      if (!profileRes.ok) {
        const profileError = await profileRes.json();
        console.error("Profile creation error:", profileError);
      }
    } catch (profileErr) {
      console.error("Profile creation fetch exception:", profileErr);
    }

    // 3. Automatically login the user to retrieve the JWT access_token
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
        { error: loginData.error_description || loginData.message || "User created but auto-login failed." },
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
    console.error("Signup handler error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
