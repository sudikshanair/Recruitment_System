import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { candidate_id, faculty_id, recruiter_id } = await request.json();

    // Optional: Check recruiter permissions
    const { data: recruiter, error: recruiterError } = await supabase
      .from("users")
      .select("role")
      .eq("id", recruiter_id)
      .single();

    if (recruiterError || !recruiter || recruiter.role !== "recruiter") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Assign faculty to candidate
    const { error } = await supabase
      .from("candidates")
      .update({ faculty_id })
      .eq("id", candidate_id);

    if (error) {
      return NextResponse.json({ error: "Assignment failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}