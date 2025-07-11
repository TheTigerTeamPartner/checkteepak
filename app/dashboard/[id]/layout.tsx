"use client"

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User as SupabaseUser } from "@supabase/supabase-js"

import { LayoutDashboard, CheckCircle, Settings, Bell, Home, Crown, User, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
      setUser(session?.user ?? null);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };
    if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return null // Or a redirect component, though the effect already handles it
  }

  const memberItems = [
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="px-3 py-4">
          <div className="flex items-center px-3 py-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Check Teepak</h2>
                <p className="text-xs text-gray-500">สมาชิกยืนยัน</p>
              </div>
            </div>
          </div>
          <SidebarNav items={memberItems} />
        </div>

        {/* Bottom section */}
        <div className="mt-auto p-3 border-t border-gray-200">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <Home className="h-5 w-5" />
            กลับหน้าหลัก
          </Link>
        </div>
      </aside>

      <div className="flex flex-col flex-1">


        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item) => {
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {item.icon}
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}
