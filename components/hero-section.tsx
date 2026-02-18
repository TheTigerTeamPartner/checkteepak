"use client"

import type React from "react"
import { useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsSearching(true)
      router.push(`/search-results?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <div className="relative rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center opacity-100" />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative px-6 py-12 md:py-20 md:px-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">เช็คที่พัก ก่อนจอง</h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          ตรวจสอบความน่าเชื่อถือของที่พักในไทย เพื่อความปลอดภัยในการท่องเที่ยวของคุณ
        </p>
        <div className="w-full max-w-4xl mx-auto">
          <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
            <div className="flex bg-white/15 backdrop-blur-md rounded-xl border border-white/30 shadow-2xl overflow-hidden">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder="ค้นหาด้วยเลขบัญชี, เบอร์โทร, หรือชื่อ"
                  className="pl-12 pr-4 py-8 md:py-10 text-base md:text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/95 font-medium"
                  style={{ fontSize: "16px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-white/90" />
              </div>
              <Button
                type="submit"
                className="rounded-none bg-white/20 hover:bg-white/30 text-white border-0 px-8 py-6 h-auto font-semibold text-lg shadow-none"
                disabled={isSearching}
              >
                {isSearching ? "กำลังค้นหา..." : "ค้นหา"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}