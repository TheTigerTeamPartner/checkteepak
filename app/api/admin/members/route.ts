import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("members") // เปลี่ยนเป็นชื่อตารางจริงใน Supabase
      .select(`
        id,
        name,
        email,
        phone,
        type,
        submit_date,
        status,
        avatar,
        location,
        pending_items,
        contact_info,
        social_media,
        business_info
      `)

    if (error) {
      console.error("Error fetching members:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data || [])
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error"
    console.error("Catch block error in GET:", errorMessage)
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}