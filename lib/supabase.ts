import { createClient } from "@supabase/supabase-js"

// ตรวจสอบและกำหนดค่า environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// ตรวจสอบว่ามีค่า environment variables จำเป็นหรือไม่
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing environment variables NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// สร้าง client สำหรับ client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// ตรวจสอบ version ของ client
console.log('Supabase client version:', supabase.version)

// ฟังก์ชันช่วยสำหรับการตรวจสอบ error จาก Supabase
export function checkSupabaseError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return "เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล"
}

// ฟังก์ชันช่วยสำหรับการ format ข้อความ error
export function formatSupabaseError(error: unknown): string {
  const errorMessage = checkSupabaseError(error)
  return `เกิดข้อผิดพลาด: ${errorMessage}`
}