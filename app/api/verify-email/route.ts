import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') || '/';

  if (token_hash && type === 'email') {
    const { data, error } = await supabase.auth.verifyOtp({
      type: 'email',
      token_hash,
    });

    if (!error && data.user?.email) {
      // อัพเดทสถานะในฐานข้อมูลของคุณ
      await supabase
        .from('user_emails')
        .update({ verified: true })
        .eq('email', data.user.email);

      return NextResponse.redirect(new URL(`/?verified=true&email=${data.user.email}`, request.url));
    }
  }

  return NextResponse.redirect(new URL('/?error=verify_email', request.url));
}