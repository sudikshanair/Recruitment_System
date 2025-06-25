import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from("interviews")
      .select(`
        *,
        candidates!interviews_candidate_id_fkey (
          users!candidates_user_id_fkey (
            full_name,
            email
          )
        ),
        job_profiles!interviews_job_profile_id_fkey (
          title
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) throw error

    const formattedData = {
      id: data.id,
      candidate_name: data.candidates.users.full_name,
      candidate_email: data.candidates.users.email,
      job_title: data.job_profiles.title,
      scheduled_date: data.scheduled_date,
    }

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Error fetching interview:", error)
    return NextResponse.json({ error: "Failed to fetch interview" }, { status: 500 })
  }
}
