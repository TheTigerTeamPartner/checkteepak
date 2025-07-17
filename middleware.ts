// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // สร้าง Supabase client ที่ผูกกับ req และ res เพื่อให้ดึง session จาก cookie ได้
  const supabase = createMiddlewareClient({ req, res });

  // ดึง session และผูกไว้กับ req/res
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // ตรวจสอบการเข้าถึงหน้า admin
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // ตรวจสอบการเข้าถึงหน้า dashboard
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return res;
}

export const config = {
  // เลือก route ที่จะใช้ middleware (ยกเว้น static files และ api route)
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
