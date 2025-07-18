import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface AgentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "pending" | "verified" | "scammer";
  submitted_at: string;
  social_facebook: string;
  instagram: string;
  line_id: string;
  website: string;
  banking: { bankName: string; accountNumber: string; status: string } | null;
}

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const fullData = searchParams.get("full") === "true";

  try {
    let query = supabase
      .from("agents")
      .select(`
        id,
        name,
        email,
        phone,
        location,
        status,
        submitted_at,
        social_facebook,
        instagram,
        line_id,
        website,
        banking
      `);

    // ถ้าเป็น admin หรือมี ?full=true ให้ดึงข้อมูลทั้งหมด
    if (!fullData && session.user.role !== "admin") {
      query = query.eq("id", session.user.id);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ data: { status: null } }, { status: 200 });
      }
      console.error("Error fetching agents:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const formattedData = Array.isArray(data) ? data : [data]; // รับประกันว่าเป็น array
    return NextResponse.json({ data: formattedData });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Catch block error in GET:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentData = await request.json();

  const dataToUpsert = {
    ...agentData,
    id: session.user.id,
    user_id: session.user.id,
  };

  try {
    const { data, error } = await supabase
      .from("agents")
      .upsert(dataToUpsert, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase agent upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Catch block error in POST:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}