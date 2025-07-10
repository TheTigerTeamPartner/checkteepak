import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // This means no agent profile was found for the user, which is not an error.
        return NextResponse.json({ data: null });
      }
      // For other errors, return the error message.
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const agentData = await request.json();

  // Force the agent ID to match the logged-in user's ID for security.
  const dataToUpsert = {
    ...agentData,
    id: session.user.id, // This is the primary key and FK to users table.
    user_id: session.user.id, // Ensure user_id is also set.
  };

  try {
    const { data, error } = await supabase
      .from('agents')
      .upsert(dataToUpsert, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase agent upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 }); // Return 200 for upsert

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    console.error('Catch block error:', errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
