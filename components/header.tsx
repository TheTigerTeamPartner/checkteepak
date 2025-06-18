"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

export default function Header() {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  const [isLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      const userType = localStorage.getItem("userType")
      return userType === "admin" || userType === "member"
    }
    return false
  })

  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${isDashboard ? "md:block hidden" : ""}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center justify-center md:justify-start flex-1 md:flex-initial">
          {/* ซ่อนเมนูแฮมเบอร์เกอร์บนมือถือ */}
          <div className="hidden md:block"></div>

          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-md p-1.5">
              <span className="text-lg">CT</span>
            </div>
            <span className="font-bold text-xl hidden sm:inline-block">เช็คที่พัก</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">{/* เมนูถูกลบออกทั้งหมด */}</nav>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-teal-600" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile">โปรไฟล์</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">แดชบอร์ด</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks">ที่พักที่บันทึกไว้</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    localStorage.removeItem("userType")
                    window.location.reload()
                  }}
                >
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="outline" className="hidden md:inline-flex">
                <Link href="/login">เข้าสู่ระบบ</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link href="/register">สมัครสมาชิก</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
