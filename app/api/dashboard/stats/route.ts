import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

export async function GET() {
  try {
    // Get faculty count
    const facultyCount = await sql`
      SELECT COUNT(*) as count FROM faculty WHERE is_available = true
    `.catch(() => [{ count: 0 }])

    // Get candidates count (if table exists)
    const candidatesCount = await sql`
      SELECT COUNT(*) as count FROM candidates
    `.catch(() => [{ count: 0 }])

    // Get interviews count (if table exists)
    const scheduledInterviews = await sql`
      SELECT COUNT(*) as count FROM interviews WHERE status = 'scheduled'
    `.catch(() => [{ count: 0 }])

    const completedInterviews = await sql`
      SELECT COUNT(*) as count FROM interviews WHERE status = 'completed'
    `.catch(() => [{ count: 0 }])

    return NextResponse.json({
      total_faculty: Number.parseInt(facultyCount[0]?.count || 0),
      total_candidates: Number.parseInt(candidatesCount[0]?.count || 0),
      scheduled_interviews: Number.parseInt(scheduledInterviews[0]?.count || 0),
      completed_interviews: Number.parseInt(completedInterviews[0]?.count || 0),
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return default stats if there's an error
    return NextResponse.json({
      total_faculty: 0,
      total_candidates: 0,
      scheduled_interviews: 0,
      completed_interviews: 0,
    })
  }
}
