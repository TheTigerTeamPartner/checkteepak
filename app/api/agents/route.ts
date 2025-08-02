import { type NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface AgentData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: "draft" | "pending" | "verified" | "rejected";
  submitted_at: string;
  social_facebook: string;
  instagram: string;
  line_id: string;
  website: string;
  banking: { bankName: string; accountNumber: string; status: string }[];
  email_verified: boolean;
  specialties: string[];
  image_url: string;
  cover_image_url: string;
  bio: string;
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
        banking,
        email_verified,
        specialties,
        image_url,
        cover_image_url,
        bio
      `);

    if (!fullData && session.user.role !== "admin") {
      query = query.eq("id", session.user.id);
    }

    const { data, error } = await query;

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ data: [] }, { status: 200 });
      }
      console.error("Error fetching agents:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: Array.isArray(data) ? data : [data] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in GET:", errorMessage);
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

  try {
    const agentData = await request.json();
    
    // Validate required fields
    if (!agentData.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!agentData.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const dataToUpsert = {
      ...agentData,
      id: session.user.id,
      user_id: session.user.id,
      updated_at: new Date().toISOString(),
      submitted_at: agentData.status === "pending" ? new Date().toISOString() : null,
    };

    const { data, error } = await supabase
      .from("agents")
      .upsert(dataToUpsert, { onConflict: "id" })
      .select()
      .single();

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in POST:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GETApprovals(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("agent_approvals")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching approvals:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data: Array.isArray(data) ? data : [] });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Error in GETApprovals:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}