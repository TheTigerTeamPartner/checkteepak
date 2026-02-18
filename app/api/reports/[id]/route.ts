import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status } = await req.json();

    console.log('--- [API DEBUG] กำลังอัปเดตข้อมูล ---');
    console.log(`Report ID: ${id}, Status: ${status}`);

    const { data, error } = await supabase
      .from('reports')
      .update({ 
        status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('--- [API ERROR] เกิดข้อผิดพลาดจาก Supabase ---', error);
      return NextResponse.json(
        { error: 'ไม่สามารถอัปเดตข้อมูลได้', details: error },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('--- [API ERROR] เกิดข้อผิดพลาดทั่วไป ---', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์' },
      { status: 500 }
    );
  }
}