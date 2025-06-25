import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    // Get session token from Authorization header
    const authHeader = request.headers.get("Authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify session and get user
    const sessionResult = await sql`
      SELECT us.user_id, u.role, u.full_name
      FROM user_sessions us
      JOIN users u ON us.user_id = u.id
      WHERE us.session_token = ${token}
      AND us.expires_at > NOW()
    `

    if (sessionResult.length === 0 || sessionResult[0].role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get faculty record
    const facultyResult = await sql`
      SELECT id FROM faculty WHERE user_id = ${sessionResult[0].user_id}
    `

    if (facultyResult.length === 0) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 })
    }

    // Get interviews assigned to this faculty member
    const interviews = await sql`
      SELECT 
        i.id,
        i.scheduled_date,
        i.status,
        i.meeting_link,
        i.round_number,
        i.interview_type,
        u.full_name as candidate_name,
        u.email as candidate_email,
        u.phone as candidate_phone,
        c.resume_url as candidate_resume_url,
        c.qualifications as candidate_qualifications,
        c.experience_years as candidate_experience
      FROM interviews i
      JOIN candidates c ON i.candidate_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE i.interviewer_id = ${facultyResult[0].id}
      ORDER BY i.scheduled_date DESC
    `

    const formattedInterviews = interviews.map((interview) => ({
      id: interview.id,
      candidate_name: interview.candidate_name,
      candidate_email: interview.candidate_email,
      candidate_phone: interview.candidate_phone,
      round_number: interview.round_number,
      scheduled_date: interview.scheduled_date,
      status: interview.status,
      meeting_link: interview.meeting_link,
      interview_type: interview.interview_type || "general",
      candidate_resume_url: interview.candidate_resume_url,
      candidate_qualifications: interview.candidate_qualifications,
      candidate_experience: interview.candidate_experience,
    }))

    return NextResponse.json(formattedInterviews)
  } catch (error) {
    console.error("Error fetching faculty interviews:", error)
    return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 })
  }
}
