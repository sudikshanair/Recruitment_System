import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("job_profiles")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching job profiles:", error)
    return NextResponse.json({ error: "Failed to fetch job profiles" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, requirements, location, salary_range } = body

    // Get recruiter user (for demo purposes, using first recruiter)
    const { data: recruiterData } = await supabase.from("users").select("id").eq("role", "recruiter").limit(1).single()

    const { data, error } = await supabase
      .from("job_profiles")
      .insert({
        title,
        description,
        requirements,
        location,
        salary_range,
        created_by: recruiterData?.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error creating job profile:", error)
    return NextResponse.json({ error: "Failed to create job profile" }, { status: 500 })
  }
}
