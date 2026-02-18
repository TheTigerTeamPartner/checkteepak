// API สำหรับ Google OAuth 2.0 เชื่อมต่อ Google Drive และบันทึก token ลง Supabase
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ดึง environment variables ที่จำเป็น
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ตรวจสอบ env ครบถ้วนหรือไม่
function checkEnv() {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REDIRECT_URI || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Environment variables missing: กรุณาตรวจสอบ .env.local ให้ครบถ้วน');
  }
}

// POST: รับ authorization code และ user_id เพื่อแลก token แล้วบันทึกลง Supabase
export async function POST(req: NextRequest) {
  try {
    checkEnv();
    const body = await req.json();
    const code = body.code;
    const user_id = body.user_id;

    // เช็คข้อมูลที่รับเข้ามา
    if (!code || !user_id) {
      return NextResponse.json({ error: 'Missing authorization code หรือ user_id' }, { status: 400 });
    }

    // 1. แลก code เป็น access_token/refresh_token จาก Google
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.json();
      return NextResponse.json({ error: 'แลก token ไม่สำเร็จ', details: err }, { status: 400 });
    }

    const tokenJson = await tokenRes.json();
    const { access_token, refresh_token, expires_in, scope, token_type } = tokenJson;
    if (!access_token) {
      return NextResponse.json({ error: 'ไม่ได้รับ access_token จาก Google', details: tokenJson }, { status: 400 });
    }

    // 2. บันทึก token ลง Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const expires_at = new Date(Date.now() + (expires_in || 3600) * 1000).toISOString();
    const { error } = await supabase
      .from('user_tokens')
      .upsert([
        {
          user_id,
          provider: 'google',
          access_token,
          refresh_token,
          scope,
          token_type,
          expires_at,
        },
      ], { onConflict: ['user_id', 'provider'] });

    if (error) {
      return NextResponse.json({ error: 'บันทึก token ลง Supabase ไม่สำเร็จ', details: error.message }, { status: 500 });
    }

    // 3. (Creative twist) แจ้งเตือนวันหมดอายุ token ใน response
    return NextResponse.json({
      access_token,
      message: `เชื่อมต่อ Google Drive สำเร็จ! ระบบจะเตือนคุณก่อน token หมดอายุในวันที่ ${new Date(expires_at).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในฝั่งเซิร์ฟเวอร์', details: err.message }, { status: 500 });
  }
}
