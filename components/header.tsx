"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { UserNav } from "@/components/user-nav";

import {
  LayoutDashboard,
  User,
  CheckCircle,
  Settings,
  Bell,
  Crown,
} from "lucide-react";
import SidebarNav from "@/components/sidebarnav";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    }
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  };

  const isDashboard = pathname?.startsWith("/dashboard");

  const memberItems = user
    ? [
        {
          href: `/dashboard/${user.id}`,
          title: "ภาพรวม",
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          href: `/dashboard/${user.id}/profile`,
          title: "จัดการโปรไฟล์",
          icon: <User className="h-5 w-5" />,
        },
        {
          href: `/dashboard/${user.id}/verification`,
          title: "สถานะการยืนยัน",
          icon: <CheckCircle className="h-5 w-5" />,
        },
        {
          href: `/dashboard/${user.id}/settings`,
          title: "ตั้งค่าบัญชี",
          icon: <Settings className="h-5 w-5" />,
        },
        {
          href: `/dashboard/${user.id}/notifications`,
          title: "การแจ้งเตือน",
          icon: <Bell className="h-5 w-5" />,
        },
        {
          href: `/dashboard/${user.id}/reports/subscription`,
          title: "การสมัครสมาชิก",
          icon: <Crown className="h-5 w-5" />,
        },
      ]
    : [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* มือถือ */}
        <div className="flex items-center w-full md:hidden justify-between">
          {/* Hamburger menu เฉพาะหน้า dashboard */}
          {isDashboard && user ? (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-0">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <SidebarNav items={memberItems} />
              </SheetContent>
            </Sheet>
          ) : null}

          {/* Logo มือถือ */}
          {isDashboard ? (
            // โลโก้กลาง
            <Link
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            </Link>
          ) : (
            // โลโก้ชิดซ้าย
            <div className="flex-1">
              <Link href="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                <span className="font-bold text-xl">เช็คที่พัก</span>
              </Link>
            </div>
          )}

          {/* UserNav / Login มือถือ */}
          <div className="flex items-center gap-2">
            {user ? (
              <UserNav user={user} onLogout={handleLogout} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1 text-sm text-gray-700 hover:underline"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>

        {/* เดสก์ท็อป */}
        <div className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex items-center justify-start flex-1">
            {/* เว้นซ้ายให้โลโก้ดูบาลานซ์ */}

            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              <span className="font-bold text-xl hidden sm:inline-block">
                เช็คที่พัก
              </span>
            </Link>
          </div>

          {/* ตำแหน่งกลาง (ใส่เมนูได้ในอนาคต) */}
          <nav className="hidden md:flex items-center gap-6"></nav>

          {/* Login / UserNav Desktop */}
          <div className="flex items-center gap-4">
            {user ? (
              <UserNav user={user} onLogout={handleLogout} />
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
