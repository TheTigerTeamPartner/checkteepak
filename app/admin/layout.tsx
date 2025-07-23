"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart,
  Settings,
  Bell,
  Home,
  ClipboardCheck,
  Shield,
  Megaphone,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    href: string
    title: string
    icon: React.ReactNode
  }[]
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminItems = [
    {
      href: "/admin",
      title: "ภาพรวม",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/admin/users",
      title: "จัดการผู้ใช้",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/admin/marketing",
      title: "การตลาด",
      icon: <Megaphone className="h-5 w-5" />,
    },
    {
      href: "/admin/verify",
      title: "ยืนยันตัวตน",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      href: "/admin/reports",
      title: "รับเรื่องร้องเรียน",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/admin/fraudsters",
      title: "มิจฉาชีพ",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      href: "/admin/document",
      title: "ยืนยันเอกสาร",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      href: "/admin/settings",
      title: "ตั้งค่าระบบ",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      href: "/admin/notifications",
      title: "การแจ้งเตือน",
      icon: <Bell className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="px-3 py-4">
          <div className="flex items-center px-3 py-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CT</span>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Check Teepak</h2>
                <p className="text-xs text-gray-500">ผู้ดูแลระบบ</p>
              </div>
            </div>
          </div>
          <SidebarNav items={adminItems} />
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
              isActive ? "bg-red-50 text-red-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
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
