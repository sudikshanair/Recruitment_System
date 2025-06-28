import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("interviewers")
      .select(`
        *,
        users!interviewers_user_id_fkey (
          id,
          email,
          full_name,
          phone
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error


    const formattedData = data.map((interviewer) => {
      // Normalize expertise_areas to always be an array of lowercase strings
      let expertise_areas: string[] = [];
      if (typeof interviewer.expertise_areas === 'string') {
        expertise_areas = interviewer.expertise_areas.split(',').map((s: string) => s.trim().toLowerCase());
      } else if (Array.isArray(interviewer.expertise_areas)) {
        expertise_areas = interviewer.expertise_areas.map((s: string) => s.toLowerCase());
      }
      return {
        id: interviewer.id,
        full_name: interviewer.users.full_name,
        email: interviewer.users.email,
        phone: interviewer.users.phone,
        department: interviewer.department,
        expertise_areas,
        is_available: interviewer.is_available,
      };
    });

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching interviewers:", error)
    return NextResponse.json({ error: "Failed to fetch interviewers" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { full_name, email, phone, department, expertise_areas } = body

    // First create user
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        full_name,
        role: "interviewer",
        phone,
      })
      .select()
      .single()

    if (userError) throw userError

    // Then create interviewer
    const { data: interviewerData, error: interviewerError } = await supabase
      .from("interviewers")
      .insert({
        user_id: userData.id,
        department,
        expertise_areas,
        is_available: true,
      })
      .select()
      .single()

    if (interviewerError) throw interviewerError

    return NextResponse.json({ success: true, data: interviewerData })
  } catch (error) {
    console.error("Error creating interviewer:", error)
    return NextResponse.json({ error: "Failed to create interviewer" }, { status: 500 })
  }
}
