import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // ใช้เฉพาะฝั่ง backend เท่านั้น
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      user_id,
      name,
      phone_number,
      line_id,
      bio,
      email,
      instagram,
      website,
      banking,
      certification
    } = body

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id' }, { status: 400 })
    }

    const now = new Date()
    const join_date = now.toISOString()
    const last_viewed = now.toISOString()

    // ตรวจสอบว่ามี agent นี้อยู่แล้วหรือไม่
    const { data: existing, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user_id)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (existing) {
      // อัปเดตข้อมูล
      const { data, error: updateError } = await supabase
        .from('agents')
        .update({
          name,
          phone_number,
          line_id,
          bio,
          email,
          instagram,
          website,
          banking,
          certification,
          last_viewed
        })
        .eq('user_id', user_id)
        .select()

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ message: 'อัปเดตโปรไฟล์สำเร็จ', data: data[0] })
    } else {
      // สร้างใหม่
      const { data, error: insertError } = await supabase
        .from('agents')
        .insert([
          {
            user_id,
            name,
            phone_number,
            line_id,
            bio,
            email,
            instagram,
            website,
            banking,
            certification,
            join_date,
            last_viewed,
            total_contacts: 0,
            avg_response_time: null,
            sucssesful_deals: 0
          }
        ])
        .select()

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }

      return NextResponse.json({ message: 'สร้างโปรไฟล์ตัวแทนสำเร็จ', data: data[0] })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
