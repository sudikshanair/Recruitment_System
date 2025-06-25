import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { randomBytes } from "crypto"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, role } = body

    // Get user with role validation
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("role", role)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials or user not found" }, { status: 401 })
    }

    // For demo, accept password123. In production, verify hashed password
    if (password !== "password123") {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Generate session token
    const sessionToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Get client IP and user agent
    const clientIP = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"

    // Store session
    await supabase.from("user_sessions").insert({
      user_id: user.id,
      session_token: sessionToken,
      device_info: userAgent,
      ip_address: clientIP,
      expires_at: expiresAt.toISOString(),
    })

    // Update last login
    await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    return NextResponse.json({
      success: true,
      session_token: sessionToken,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        profile_image: user.profile_image,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
