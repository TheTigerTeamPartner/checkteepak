import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '' // ต้องใช้ service role สำหรับฝั่ง backend
);

export async function POST(request: Request) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json();
    const fullName = `${firstName} ${lastName}`.trim();

    // สร้าง user ใน Supabase Auth
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { fullName, phone_number: phone }, // ✅ เก็บลง metadata ด้วยชื่อ phone_number
      email_confirm: false,
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError.message);
      return NextResponse.json({ error: signUpError.message }, { status: 400 });
    }

    const user = signUpData?.user;
    if (!user) {
      return NextResponse.json({ error: 'สมัครสมาชิกไม่สำเร็จ' }, { status: 500 });
    }

    // วันที่สมัครและหมดอายุ
    const subscriptionStartDate = new Date();
    const subscriptionExpiryDate = new Date(
      subscriptionStartDate.getFullYear(),
      subscriptionStartDate.getMonth() + 1,
      1
    );

    // บันทึกลงตาราง agents
    const { error: insertError } = await supabase.from('agents').insert([
      {
        id: user.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone_number: phone, // ✅ ใช้ phone_number ให้ตรงกับชื่อคอลัมน์ใน DB
        subscription_start_date: subscriptionStartDate.toISOString(),
        subscription_expiry_date: subscriptionExpiryDate.toISOString(),
      },
    ]);

    if (insertError) {
      console.error('Insert agent error:', insertError.message);
      return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลเพิ่มเติม' }, { status: 500 });
    }

    return NextResponse.json({ message: 'สมัครสมาชิกสำเร็จ' }, { status: 201 });

  } catch (e) {
    const message = e instanceof Error ? e.message : 'เกิดข้อผิดพลาด';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
