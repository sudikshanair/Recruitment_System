import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Use the correct environment variable
const sql = neon(process.env.NEON_NEON_DATABASE_URL!)

let schemaReady: Promise<void> | null = null

/** Ensures that the minimum schema (users + faculty) exists. */
async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      try {
        console.log("Creating database schema...")

        // UUID extension (safe to re-run)
        await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`

        // USERS table
        await sql`
          CREATE TABLE IF NOT EXISTS users (
            id            UUID PRIMARY KEY  DEFAULT uuid_generate_v4(),
            email         TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name     TEXT NOT NULL,
            role          TEXT NOT NULL CHECK (role IN ('recruiter','faculty','candidate')),
            phone         TEXT,
            profile_image TEXT,
            created_at    TIMESTAMPTZ DEFAULT NOW(),
            updated_at    TIMESTAMPTZ DEFAULT NOW()
          )`

        // FACULTY table - matching the exact form structure
        await sql`
          CREATE TABLE IF NOT EXISTS faculty (
            id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            employee_id             TEXT,
            department              TEXT NOT NULL,
            designation             TEXT,
            specialization          TEXT,
            qualification           TEXT,
            experience_years        INTEGER DEFAULT 0,
            expertise_areas         TEXT[] DEFAULT '{}',
            research_interests      TEXT[] DEFAULT '{}',
            preferred_time_slots    TEXT[] DEFAULT '{}',
            interview_types         TEXT[] DEFAULT '{technical}',
            max_interviews_per_day  INTEGER DEFAULT 3,
            is_available            BOOLEAN DEFAULT TRUE,
            created_at              TIMESTAMPTZ DEFAULT NOW(),
            updated_at              TIMESTAMPTZ DEFAULT NOW()
          )`

        console.log("Schema created successfully")
      } catch (error) {
        console.error("Schema creation error:", error)
        throw error
      }
    })()
  }
  return schemaReady
}

export async function GET() {
  try {
    await ensureSchema()
    const faculty = await sql`
      SELECT 
        f.*,
        u.full_name,
        u.email,
        u.phone,
        u.profile_image
      FROM faculty f
      JOIN users u ON f.user_id = u.id
      ORDER BY f.created_at DESC
    `

    return NextResponse.json(faculty)
  } catch (error) {
    console.error("Error fetching faculty:", error)
    return NextResponse.json({ error: "Failed to fetch faculty", details: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting faculty creation process...")
    await ensureSchema()

    const body = await request.json()
    console.log("Received faculty data:", JSON.stringify(body, null, 2))

    // Extract data exactly as sent from the form
    const {
      full_name,
      email,
      phone,
      employee_id,
      department,
      designation,
      specialization,
      qualification,
      experience_years,
      expertise_areas = [],
      research_interests = [],
      preferred_time_slots = [],
      interview_types = ["technical"],
      max_interviews_per_day = 3,
    } = body

    // Validate required fields
    if (!full_name || !email || !department) {
      console.log("Validation failed: missing required fields")
      return NextResponse.json(
        {
          error: "Missing required fields",
          details: "full_name, email, and department are required",
          success: false,
        },
        { status: 400 },
      )
    }

    if (!Array.isArray(expertise_areas) || expertise_areas.length === 0) {
      console.log("Validation failed: no expertise areas")
      return NextResponse.json(
        {
          error: "At least one expertise area is required",
          success: false,
        },
        { status: 400 },
      )
    }

    console.log("Creating user record...")
    // First create the user
    const userResult = await sql`
      INSERT INTO users (email, password_hash, full_name, role, phone)
      VALUES (
        ${email},
        '$2b$10$rOzJqQZ9J9J9J9J9J9J9JOzJqQZ9J9J9J9J9J9JOzJqQZ9J9J9J9',
        ${full_name},
        'faculty',
        ${phone || null}
      )
      RETURNING id
    `

    if (!userResult || userResult.length === 0) {
      throw new Error("Failed to create user record")
    }

    const userId = userResult[0].id
    console.log("User created with ID:", userId)

    // --- Sanitize array fields for Postgres ---
    const safeArray = (arr: any) =>
      Array.isArray(arr) && arr.length > 0 && arr[0] !== ""
        ? arr.map(String)
        : [];
    const expertiseArr = safeArray(expertise_areas);
    const researchArr = safeArray(research_interests);
    const slotsArr = safeArray(preferred_time_slots);
    const interviewTypesArr = safeArray(interview_types);

    console.log("Creating faculty record...")
    // Then create the faculty record with exact field mapping
    const facultyResult = await sql`
      INSERT INTO faculty (
        user_id,
        employee_id,
        department,
        designation,
        specialization,
        qualification,
        experience_years,
        expertise_areas,
        research_interests,
        preferred_time_slots,
        interview_types,
        max_interviews_per_day,
        is_available
      )
      VALUES (
        ${userId},
        ${employee_id || null},
        ${department},
        ${designation || null},
        ${specialization || null},
        ${qualification || null},
        ${Number.parseInt(experience_years) || 0},
        ${expertiseArr as any}::text[],
        ${researchArr as any}::text[],
        ${slotsArr as any}::text[],
        ${interviewTypesArr as any}::text[],
        ${Number.parseInt(max_interviews_per_day) || 3},
        true
      )
      RETURNING *
    `

    if (!facultyResult || facultyResult.length === 0) {
      throw new Error("Failed to create faculty record")
    }

    const faculty = facultyResult[0]
    console.log("Faculty created successfully with ID:", faculty.id)

    return NextResponse.json({
      success: true,
      message: "Faculty added successfully",
      faculty: {
        ...faculty,
        full_name,
        email,
        phone,
      },
    })
  } catch (error) {
    console.error("Detailed error adding faculty:", error)

    // Return more specific error information
    if (error.message?.includes("duplicate key") || error.message?.includes("unique constraint")) {
      return NextResponse.json(
        {
          error: "Email already exists",
          details: "A faculty member with this email already exists in the system",
          success: false,
        },
        { status: 409 },
      )
    }

    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      return NextResponse.json(
        {
          error: "Database setup required",
          details: "Please contact administrator to set up the database",
          success: false,
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        error: "Failed to add faculty",
        details: error.message || "Unknown error occurred",
        success: false,
      },
      { status: 500 },
    )
  }
}

// PATCH: Add meeting link to interview list page
// In app/interviews/page.tsx, add a column for the meeting link
//
// <th className="text-left p-2">Meeting Link</th>
// ...
// <td className="p-2">
//   <a href={i.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
//     Join Meeting
//   </a>
// </td>
// ...existing code...
// PATCH: Backend already generates and includes Teams link and simulates email sending.
// To send real emails, integrate a service like SendGrid or Resend in sendInterviewNotifications.
//
// No further changes needed in faculty route.ts for scheduling/interview logic, as all logic is now unified on the faculty table.
