import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Generate Microsoft Teams meeting link (simulated)
function generateTeamsMeetingLink(): string {
  const meetingId = Math.random().toString(36).substring(2, 15)
  return `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${meetingId}%40thread.v2/0?context=%7b%22Tid%22%3a%22${meetingId}%22%2c%22Oid%22%3a%22${meetingId}%22%7d`
}

export async function GET() {
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
        interviewers!interviews_interviewer_id_fkey (
          users!interviewers_user_id_fkey (
            full_name,
            email
          )
        )
      `)
      .order("scheduled_date", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { candidate_id, interviewer_id, scheduled_date } = body

    // Generate Teams meeting link
    const meeting_link = generateTeamsMeetingLink()

    // Get recruiter user (for demo purposes, using first recruiter)
    const { data: recruiterData } = await supabase.from("users").select("id").eq("role", "recruiter").limit(1).single()

    const { data, error } = await supabase
      .from("interviews")
      .insert({
        candidate_id,
        interviewer_id,
        scheduled_date,
        meeting_link,
        created_by: recruiterData?.id,
      })
      .select(`
        *,
        candidates!interviews_candidate_id_fkey (
          users!candidates_user_id_fkey (
            full_name,
            email
          )
        ),
        interviewers!interviews_interviewer_id_fkey (
          users!interviewers_user_id_fkey (
            full_name,
            email
          )
        )
      `)
      .single()

    if (error) throw error

    // Send email notifications (simulated)
    await sendInterviewNotifications(data)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error creating interview:", error)
    return NextResponse.json({ error: "Failed to create interview" }, { status: 500 })
  }
}

async function sendInterviewNotifications(interview: any) {
  // This would integrate with your email service
  // For now, we'll just log the email content

  const candidateEmail = {
    to: interview.candidates.users.email,
    subject: `Interview Scheduled`,
    body: `
      Dear ${interview.candidates.users.full_name},
      
      Your interview has been scheduled for ${new Date(interview.scheduled_date).toLocaleString()}.
      
      Interviewer: ${interview.interviewers.users.full_name}
      Meeting Link: ${interview.meeting_link}
      
      Please join the meeting at the scheduled time.
      
      Best regards,
      Recruitment Team
    `,
  }

  const interviewerEmail = {
    to: interview.interviewers.users.email,
    subject: `Interview Assignment`,
    body: `
      Dear ${interview.interviewers.users.full_name},
      
      You have been assigned to conduct an interview on ${new Date(interview.scheduled_date).toLocaleString()}.
      
      Candidate: ${interview.candidates.users.full_name}
      Meeting Link: ${interview.meeting_link}
      
      Please review the candidate's profile and join the meeting at the scheduled time.
      
      Best regards,
      Recruitment Team
    `,
  }

  console.log("Sending emails:", { candidateEmail, interviewerEmail })
}
