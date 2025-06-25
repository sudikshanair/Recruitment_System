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
      SELECT us.user_id, u.role
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

    const facultyId = facultyResult[0].id

    // Get statistics
    const [totalInterviews, upcomingInterviews, completedInterviews, pendingEvaluations] = await Promise.all([
      sql`SELECT COUNT(*) as count FROM interviews WHERE interviewer_id = ${facultyId}`,
      sql`SELECT COUNT(*) as count FROM interviews WHERE interviewer_id = ${facultyId} AND status IN ('scheduled', 'in_progress')`,
      sql`SELECT COUNT(*) as count FROM interviews WHERE interviewer_id = ${facultyId} AND status = 'completed'`,
      sql`
        SELECT COUNT(*) as count 
        FROM interviews i 
        LEFT JOIN interview_scores s ON i.id = s.interview_id 
        WHERE i.interviewer_id = ${facultyId} 
        AND i.status = 'completed' 
        AND s.id IS NULL
      `,
    ])

    const stats = {
      total_interviews: Number.parseInt(totalInterviews[0].count),
      upcoming_interviews: Number.parseInt(upcomingInterviews[0].count),
      completed_interviews: Number.parseInt(completedInterviews[0].count),
      pending_evaluations: Number.parseInt(pendingEvaluations[0].count),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching faculty stats:", error)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
