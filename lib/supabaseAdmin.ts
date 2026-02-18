import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('กรุณาตั้งค่า environment variables: NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY');
}

// สร้าง client สำหรับการจัดการฝั่งเซิร์ฟเวอร์ (ใช้ service_role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});