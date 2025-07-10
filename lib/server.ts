import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ใช้ Service Role Key ถ้ามี ไม่เช่นนั้น fallback ไปที่ anon key (เหมาะสำหรับ dev)
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (and optionally SUPABASE_SERVICE_ROLE_KEY) in your .env file")
}

if (!supabaseServiceRoleKey) {
  // แจ้งเตือนหากไม่มี Service Role (บาง operation อาจจะทำไม่ได้ เช่น insert ข้อมูล bypass RLS)
  console.warn("⚠️  SUPABASE_SERVICE_ROLE_KEY is not set. Falling back to anon key for server client. Some privileged operations may fail.")
}

// สร้าง Supabase client สำหรับฝั่ง server (เช่น API Routes)
export const supabaseServer = createClient(supabaseUrl, supabaseKey)