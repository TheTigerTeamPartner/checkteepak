import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const typeId = parseInt(searchParams.get('type_id') || '0');
    const pageSize = 10;

    let query = supabase
      .from('addresses')
      .select(
        `
        *,
        user:users!inner(
          id,
          name,
          email,
          phone,
          role,
          status,
          created_at,
          updated_at
        )
      `,
        { count: 'exact' }
      )
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false });

    if (typeId > 0) {
      query = query.eq('type_id', typeId);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch addresses', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: data || [],
      count: count || 0,
    });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id, status, comment } = await request.json();

    const updates = {
      status,
      updated_at: new Date().toISOString(),
      ...(comment && { comment }), // เพิ่ม comment ถ้ามี
    };

    const { error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .select(); // เพิ่ม select เพื่อให้ได้ข้อมูลกลับมา

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json(
        { error: 'Failed to update address status', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Status updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}