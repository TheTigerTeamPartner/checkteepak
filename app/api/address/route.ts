// app/api/address/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = 10

    // ดึงข้อมูลจากตาราง addresses พร้อม join กับ users
    const { data, error, count } = await supabase
      .from('addresses')
      .select(`
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
      `, { count: 'exact' })
      .range((page - 1) * pageSize, page * pageSize - 1)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch addresses', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      data: data || [], 
      count: count || 0 
    })

  } catch (error: any) {
    console.error('Server error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}