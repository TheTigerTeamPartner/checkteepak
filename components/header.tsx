"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { UserNav } from "@/components/user-nav";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const isDashboard = pathname?.startsWith("/dashboard");

  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error.message);
      return;
    }
    localStorage.removeItem("userType");
    setUser(null); // Clear user state
    router.push("/");
    router.refresh(); // Refresh the page to reflect signed-out state
  };

  return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center justify-start flex-1">
          <div className="hidden md:block"></div>
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-auto h-8" />
            <span className="font-bold text-xl hidden sm:inline-block">เช็คที่พัก</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6"></nav>
        <div className="flex items-center gap-2">
          {user ? (
            <UserNav user={user} onLogout={handleLogout} />
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => console.log("Login clicked")}
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                onClick={() => console.log("Register clicked")}
                className="inline-flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700"
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}