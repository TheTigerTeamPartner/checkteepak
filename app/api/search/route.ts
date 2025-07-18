// app/api/search/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q") || ""

  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%,title.ilike.%${query}%`)
    .maybeSingle()

  if (error) {
    console.error("API Search Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
