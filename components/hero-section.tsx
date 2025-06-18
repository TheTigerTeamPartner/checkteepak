"use client"

import type React from "react"

import { useState } from "react"
import { Search, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export function HeroSection() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsSearching(true)
      // Navigate to search results page
      router.push(`/search-results?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Handle image upload logic - could extract text and search
      console.log("Image uploaded:", file.name)
      setIsImageDialogOpen(false)
      // For now, simulate search with image filename
      router.push(`/search-results?q=${encodeURIComponent(file.name)}`)
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10 bg-cover bg-center" />
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
                  className="pl-12 pr-4 py-4 md:py-6 text-base md:text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder-white/80 font-medium"
                  style={{ fontSize: "16px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 md:h-6 md:w-6 text-white/90" />
              </div>

              <div className="flex border-l border-white/20">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-none bg-transparent hover:bg-white/10 text-white border-0 px-3 md:px-4 py-4 md:py-6 h-auto"
                  title="อัพโหลดรูปภาพเพื่อค้นหา"
                  onClick={() => setIsImageDialogOpen(true)}
                >
                  <Camera className="h-5 w-5 md:h-6 md:w-6" />
                </Button>

                {/* ซ่อนปุ่มค้นหาบนมือถือ */}
                <Button
                  type="submit"
                  className="hidden md:flex rounded-none bg-white/20 hover:bg-white/30 text-white border-0 px-8 py-6 h-auto font-semibold text-lg shadow-none"
                  disabled={isSearching}
                >
                  {isSearching ? "กำลังค้นหา..." : "ค้นหา"}
                </Button>
              </div>
            </div>

            {/* Image Upload Dialog */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>อัพโหลดรูปภาพเพื่อค้นหา</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Camera className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">คลิกเพื่ออัพโหลดรูปภาพ หรือลากไฟล์มาวาง</p>
                    <p className="mt-1 text-xs text-gray-400">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" className="mt-4">
                        เลือกรูปภาพ
                      </Button>
                    </label>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </form>
        </div>
      </div>
    </div>
  )
}
