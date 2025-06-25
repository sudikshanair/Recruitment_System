import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify session and get user
    const { data: session } = await supabase
      .from("user_sessions")
      .select(`
        user_id,
        users!user_sessions_user_id_fkey (
          id,
          role
        )
      `)
      .eq("session_token", token)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (!session || session.users.role !== "interviewer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get interviewer record
    const { data: interviewer } = await supabase
      .from("interviewers")
      .select("id")
      .eq("user_id", session.user_id)
      .single()

    if (!interviewer) {
      return NextResponse.json({ error: "Interviewer not found" }, { status: 404 })
    }

    // Get interviews assigned to this interviewer
    const { data: interviews, error } = await supabase
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
      .eq("interviewer_id", interviewer.id)
      .order("scheduled_date", { ascending: true })

    if (error) throw error

    const formattedInterviews = interviews.map((interview) => ({
      id: interview.id,
      candidate_name: interview.candidates.users.full_name,
      candidate_email: interview.candidates.users.email,
      job_title: interview.job_profiles.title,
      round_number: interview.round_number,
      scheduled_date: interview.scheduled_date,
      status: interview.status,
      meeting_link: interview.meeting_link,
    }))

    return NextResponse.json(formattedInterviews)
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}
