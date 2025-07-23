"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { User as SupabaseUser } from "@supabase/supabase-js";

import { LayoutDashboard,  User, Settings, CheckCircle, Bell, Crown, FileCheck } from "lucide-react";
import SidebarNav from "@/components/sidebarnav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
      }
      setLoading(false);
    }
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      }
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  // เมนู Sidebar
  const memberItems = [

    {
      href: `/dashboard/${user.id}/profile`,
      title: "จัดการโปรไฟล์",
      icon: <User className="h-5 w-5" />,
    },
  
    {
      href: `/dashboard/${user.id}/settings`,
      title: "ตั้งค่าบัญชี",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      href: `/dashboard/${user.id}/confirm`,
      title: "ยืนยันเอกสาร",
      icon: <FileCheck className="h-5 w-5" />,
    },


  
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="px-3 py-4">
          <SidebarNav items={memberItems} />
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
    </div>
  );
}
