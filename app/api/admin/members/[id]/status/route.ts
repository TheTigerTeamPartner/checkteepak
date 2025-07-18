import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (!session) {
    console.log("No session found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ตรวจสอบสิทธิ์: admin หรือเจ้าของข้อมูล
  const { data: agent } = await supabase
    .from("agents")
    .select("id, user_id")
    .eq("id", params.id)
    .single();

  if (!agent || (session.user.role !== "admin" && agent.user_id !== session.user.id)) {
    console.log("Forbidden: User role:", session.user.role, "Agent user_id:", agent?.user_id);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status, reason } = await request.json();
  const agentId = params.id;

  try {
    console.log(`Updating agent ${agentId} to status: ${status}, reason: ${reason}`);
    const { data, error } = await supabase
      .from("agents")
      .update({ status, rejection_reason: reason || null })
      .eq("id", agentId)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    console.log("Update successful:", data);
    return NextResponse.json(data[0]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error("Catch block error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}