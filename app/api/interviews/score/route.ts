import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      interview_id,
      technical_skills,
      communication,
      problem_solving,
      cultural_fit,
      overall_rating,
      comments,
      recommendation,
    } = body

    // Get interviewer user (for demo purposes, using first interviewer)
    const { data: interviewerData } = await supabase
      .from("users")
      .select("id")
      .eq("role", "interviewer")
      .limit(1)
      .single()

    // Insert interview score
    const { data: scoreData, error: scoreError } = await supabase
      .from("interview_scores")
      .insert({
        interview_id,
        technical_skills,
        communication,
        problem_solving,
        cultural_fit,
        overall_rating,
        comments,
        recommendation,
        scored_by: interviewerData?.id,
      })
      .select()
      .single()

    if (scoreError) throw scoreError

    // Update interview status to completed
    const { error: updateError } = await supabase
      .from("interviews")
      .update({ status: "completed" })
      .eq("id", interview_id)

    if (updateError) throw updateError

    // Get interview details for email notification
    const { data: interviewData } = await supabase
      .from("interviews")
      .select(`
        *,
        candidates!interviews_candidate_id_fkey (
          users!candidates_user_id_fkey (
            full_name,
            email
          )
        )
      `)
      .eq("id", interview_id)
      .single()

    // Update candidate status based on recommendation
    if (interviewData) {
      const newStatus = recommendation === "hire" ? "selected" : "rejected"
      await supabase.from("candidates").update({ status: newStatus }).eq("id", interviewData.candidate_id)

      // Send result email
      await sendResultNotification(interviewData, recommendation)
    }

    return NextResponse.json({ success: true, data: scoreData })
  } catch (error) {
    console.error("Error submitting interview score:", error)
    return NextResponse.json({ error: "Failed to submit interview score" }, { status: 500 })
  }
}

async function sendResultNotification(interview: any, recommendation: string) {
  const candidateName = interview.candidates.users.full_name
  const candidateEmail = interview.candidates.users.email
  const jobTitle = interview.job_profiles.title

  let emailContent
  if (recommendation === "hire") {
    emailContent = {
      subject: `Congratulations! Interview Result - ${jobTitle}`,
      body: `
        Dear ${candidateName},
        
        Congratulations! We are pleased to inform you that you have been selected for the position of ${jobTitle}.
        
        We were impressed with your performance during the interview and believe you would be a great addition to our team.
        
        Our HR team will contact you soon with the next steps and offer details.
        
        Welcome to the team!
        
        Best regards,
        Recruitment Team
      `,
    }
  } else {
    emailContent = {
      subject: `Interview Result - ${jobTitle}`,
      body: `
        Dear ${candidateName},
        
        Thank you for taking the time to interview for the position of ${jobTitle}.
        
        After careful consideration, we have decided to move forward with other candidates whose experience more closely matches our current needs.
        
        We appreciate your interest in our company and encourage you to apply for future opportunities that match your skills and experience.
        
        Best regards,
        Recruitment Team
      `,
    }
  }

  console.log("Sending result email:", {
    to: candidateEmail,
    ...emailContent,
  })
}
