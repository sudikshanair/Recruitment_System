import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("candidates")
      .select(`
        *,
        users!candidates_user_id_fkey (
          id,
          email,
          full_name,
          phone
        )
      `)
      .order("created_at", { ascending: false })

    if (error) throw error

    const formattedData = data.map((candidate) => ({
      id: candidate.id,
      full_name: candidate.users.full_name,
      email: candidate.users.email,
      phone: candidate.users.phone,
      experience_years: candidate.experience_years,
      skills: candidate.skills || [],
      current_company: candidate.current_company,
      expected_salary: candidate.expected_salary,
      status: candidate.status,
    }))

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching candidates:", error)
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      full_name,
      email,
      phone,
      experience_years,
      skills,
      current_company,
      expected_salary,
      notice_period,
      resume_url,
    } = body

    // First create user
    const PLACEHOLDER_HASH = "$2b$10$rXfVh3i8vI0C6gF7U25T3u8z2yKxk6mTMYj99R3Jx4Cl5kPIK8hXK" // dummy bcrypt hash
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        email,
        full_name,
        role: "candidate",
        phone,
        password_hash: PLACEHOLDER_HASH,
      })
      .select()
      .single()

    if (userError) throw userError

    // Then create candidate
    const { data: candidateData, error: candidateError } = await supabase
      .from("candidates")
      .insert({
        user_id: userData.id,
        experience_years,
        skills,
        current_company,
        expected_salary,
        notice_period,
        resume_url,
      })
      .select()
      .single()

    if (candidateError) throw candidateError

    return NextResponse.json({ success: true, data: candidateData })
  } catch (error) {
    console.error("Error creating candidate:", error)
    return NextResponse.json({ error: "Failed to create candidate" }, { status: 500 })
  }
}
