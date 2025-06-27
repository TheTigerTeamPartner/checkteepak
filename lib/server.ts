import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase server environment variables")
}

// สร้าง Supabase client สำหรับฝั่ง server (เช่น API Routes)
export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey)