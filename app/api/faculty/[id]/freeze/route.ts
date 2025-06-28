import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  if (!id) {
    return NextResponse.json({ error: "Missing faculty id" }, { status: 400 })
  }
  const body = await request.json()
  // Default to freezing (is_available: false) if not specified
  const is_available = body.is_available === undefined ? false : body.is_available
  const { error } = await supabase
    .from("faculty")
    .update({ is_available })
    .eq("id", id)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
