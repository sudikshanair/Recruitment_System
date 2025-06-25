import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const {
      interview_id,
      scores,
      total_score,
      comments,
      recommendation,
      strengths,
      areas_for_improvement,
      overall_impression,
    } = body

    // Get faculty record
    const facultyResult = await sql`
      SELECT id FROM faculty WHERE user_id = ${sessionResult[0].user_id}
    `

    if (facultyResult.length === 0) {
      return NextResponse.json({ error: "Faculty not found" }, { status: 404 })
    }

    // Insert assessment into interview_scores table
    const result = await sql`
      INSERT INTO interview_scores (
        interview_id,
        interviewer_id,
        educational_background,
        experience,
        teaching_experience,
        technical_content,
        publications,
        communication_skills,
        personality_attitude,
        total_score,
        comments,
        recommendation,
        strengths,
        areas_for_improvement,
        overall_impression,
        created_at
      ) VALUES (
        ${interview_id},
        ${facultyResult[0].id},
        ${scores.educational_background[0]},
        ${scores.experience[0]},
        ${scores.teaching_experience[0]},
        ${scores.technical_content[0]},
        ${scores.publications[0]},
        ${scores.communication_skills[0]},
        ${scores.personality_attitude[0]},
        ${total_score},
        ${comments},
        ${recommendation},
        ${strengths},
        ${areas_for_improvement},
        ${overall_impression},
        NOW()
      )
      RETURNING id
    `

    // Update interview status to indicate it has been evaluated
    await sql`
      UPDATE interviews 
      SET status = 'completed_evaluated'
      WHERE id = ${interview_id}
    `

    return NextResponse.json({
      success: true,
      assessment_id: result[0].id,
      message: "Assessment submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting assessment:", error)
    return NextResponse.json({ error: "Failed to submit assessment" }, { status: 500 })
  }
}
