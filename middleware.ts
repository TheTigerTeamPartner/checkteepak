// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // สร้าง Supabase client ที่ผูกกับ req และ res เพื่อให้ดึง session จาก cookie ได้
  const supabase = createMiddlewareClient({ req, res });

  // ดึง session และผูกไว้กับ req/res
  await supabase.auth.getSession();

  return res;
}

export const config = {
  // เลือก route ที่จะใช้ middleware (ยกเว้น static files และ api route)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
