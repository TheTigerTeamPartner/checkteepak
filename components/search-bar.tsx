"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  Camera,
  CreditCard,
  User,
  Phone,
  Building,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Shield,
  Eye,
  Flag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type VerificationStatus = "verified" | "unknown" | "fraud"

interface SearchResult {
  id: string
  searchTerm: string
  searchType: string
  status: VerificationStatus
  name?: string
  details: string[]
  riskLevel: "low" | "medium" | "high"
  lastUpdated: string
  reportCount: number
  verificationDate?: string
}

export function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const searchTypes = [
    { value: "all", label: "ทั้งหมด", icon: <Search className="h-4 w-4" /> },
    { value: "bank_account", label: "เลขบัญชีธนาคาร", icon: <CreditCard className="h-4 w-4" /> },
    { value: "id_card", label: "เลขบัตรประชาชน", icon: <User className="h-4 w-4" /> },
    { value: "phone", label: "เบอร์โทรศัพท์", icon: <Phone className="h-4 w-4" /> },
    { value: "name", label: "ชื่อ-นามสกุล", icon: <User className="h-4 w-4" /> },
    { value: "business", label: "ชื่อธุรกิจ", icon: <Building className="h-4 w-4" /> },
  ]

  // Mock data สำหรับผลการค้นหา
  const mockResults: SearchResult[] = [
    {
      id: "1",
      searchTerm: "081-234-5678",
      searchType: "phone",
      status: "verified",
      name: "คุณสมชาย ใจดี",
      details: [
        "ยืนยันตัวตนแล้วเมื่อ 15 พ.ค. 2566",
        "เป็นเจ้าของที่พักรับรองใน 3 จังหวัด",
        "มีประวัติการทำธุรกรรมที่ดี",
        "ไม่มีรายงานการโกงหรือหลอกลวง",
      ],
      riskLevel: "low",
      lastUpdated: "2 ชั่วโมงที่แล้ว",
      reportCount: 0,
      verificationDate: "15 พฤษภาคม 2566",
    },
    {
      id: "2",
      searchTerm: "123-4-56789-0",
      searchType: "bank_account",
      status: "unknown",
      details: [
        "ไม่พบข้อมูลในระบบของเรา",
        "บัญชีนี้อาจเป็นบัญชีใหม่หรือไม่เคยมีการรายงาน",
        "แนะนำให้ตรวจสอบเพิ่มเติมก่อนโอนเงิน",
        "ขอดูเอกสารยืนยันตัวตนจากเจ้าของบัญชี",
      ],
      riskLevel: "medium",
      lastUpdated: "1 วันที่แล้ว",
      reportCount: 0,
    },
    {
      id: "3",
      searchTerm: "1-2345-67890-12-3",
      searchType: "id_card",
      status: "fraud",
      name: "นายปลอม หลอกลวง",
      details: [
        "มีรายงานการหลอกลวงหลายครั้ง",
        "ใช้ข้อมูลปลอมในการทำธุรกรรม",
        "มีประวัติโกงเงินค่าที่พักหลายราย",
        "อย่าทำธุรกรรมใดๆ กับบุคคลนี้",
      ],
      riskLevel: "high",
      lastUpdated: "30 นาทีที่แล้ว",
      reportCount: 15,
      verificationDate: "ถูกรายงานเมื่อ 10 พฤษภาคม 2566",
    },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsSearching(true)

      // Simulate API call
      setTimeout(() => {
        // Filter mock results based on search term
        const filteredResults = mockResults.filter(
          (result) =>
            result.searchTerm.includes(searchTerm) ||
            result.name?.includes(searchTerm) ||
            searchTerm.includes(result.searchTerm),
        )

        setSearchResults(filteredResults.length > 0 ? filteredResults : [])
        setIsSearching(false)
        setIsResultDialogOpen(true)
      }, 1500)
    }
  }

  const getPlaceholder = () => {
    switch (searchType) {
      case "bank_account":
        return "เช่น 123-4-56789-0 หรือ 1234567890"
      case "id_card":
        return "เช่น 1-2345-67890-12-3"
      case "phone":
        return "เช่น 081-234-5678 หรือ 0812345678"
      case "name":
        return "เช่น สมชาย ใจดี"
      case "business":
        return "เช่น บริษัท ABC จำกัด"
      default:
        return "ค้นหาด้วยเลขบัญชี, เลขบัตรประชาชน, เบอร์โทร, หรือชื่อ"
    }
  }

  const getStatusCard = (result: SearchResult) => {
    switch (result.status) {
      case "verified":
        return (
          <Card className="border-green-200 bg-green-50 mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-full">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-green-800">ปลอดภัย - ยืนยันตัวตนแล้ว</CardTitle>
                    <p className="text-sm text-green-600">สามารถทำธุรกรรมได้อย่างมั่นใจ</p>
                  </div>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  ปลอดภัย
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-800">ข้อมูลที่ค้นหา:</span>
                    <p className="text-green-700">{result.searchTerm}</p>
                  </div>
                  {result.name && (
                    <div>
                      <span className="font-medium text-green-800">ชื่อ:</span>
                      <p className="text-green-700">{result.name}</p>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-green-800 mb-2">รายละเอียด:</h4>
                  <ul className="space-y-1">
                    {result.details.map((detail, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "unknown":
        return (
          <Card className="border-amber-200 bg-amber-50 mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-amber-800">ไม่มีข้อมูลในระบบ</CardTitle>
                    <p className="text-sm text-amber-600">รบกวนตรวจสอบเพิ่มเติมก่อนทำธุรกรรม</p>
                  </div>
                </div>
                <Badge className="bg-amber-500 hover:bg-amber-600">
                  <Eye className="h-3 w-3 mr-1" />
                  ระวัง
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-amber-800">ข้อมูลที่ค้นหา:</span>
                  <p className="text-amber-700">{result.searchTerm}</p>
                </div>
                <div>
                  <h4 className="font-medium text-amber-800 mb-2">คำแนะนำ:</h4>
                  <ul className="space-y-1">
                    {result.details.map((detail, index) => (
                      <li key={index} className="text-sm text-amber-700 flex items-start">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                    <Flag className="h-4 w-4 mr-2" />
                    แจ้งข้อมูลเพิ่มเติม
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )

      case "fraud":
        return (
          <Card className="border-red-200 bg-red-50 mb-4">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500 rounded-full">
                    <XCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-red-800">อันตราย - มิจฉาชีพ</CardTitle>
                    <p className="text-sm text-red-600">อย่าโอนเงินหรือทำธุรกรรมใดๆ</p>
                  </div>
                </div>
                <Badge className="bg-red-500 hover:bg-red-600">
                  <XCircle className="h-3 w-3 mr-1" />
                  อันตราย
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-red-800">ข้อมูลที่ค้นหา:</span>
                    <p className="text-red-700">{result.searchTerm}</p>
                  </div>
                  {result.name && (
                    <div>
                      <span className="font-medium text-red-800">ชื่อที่ใช้:</span>
                      <p className="text-red-700">{result.name}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-red-800">จำนวนรายงาน:</span>
                    <p className="text-red-700">{result.reportCount} ครั้ง</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-red-800 mb-2">รายละเอียดการโกง:</h4>
                  <ul className="space-y-1">
                    {result.details.map((detail, index) => (
                      <li key={index} className="text-sm text-red-700 flex items-start">
                        <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-100 border border-red-200 rounded-md p-3">
                  <p className="text-red-800 text-sm font-medium">
                    ⚠️ คำเตือน: หากคุณได้รับการติดต่อจากบุคคลนี้ กรุณาไม่โอนเงินและแจ้งตำรวจทันที
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="เลือกประเภทการค้นหา" />
                </SelectTrigger>
                <SelectContent>
                  {searchTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-1">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  placeholder={getPlaceholder()}
                  className="pl-10 pr-4 py-6 text-lg rounded-l-lg border-r-0 focus-visible:ring-2 focus-visible:ring-teal-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>

              <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-none border-l-0"
                  title="อัพโหลดรูปภาพเพื่อค้นหา"
                  onClick={() => setIsImageDialogOpen(true)}
                >
                  <Camera className="h-5 w-5" />
                </Button>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>อัพโหลดรูปภาพเพื่อค้นหา</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                      <Camera className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">คลิกเพื่ออัพโหลดรูปภาพ หรือลากไฟล์มาวาง</p>
                      <p className="mt-1 text-xs text-gray-400">รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB</p>
                      <input type="file" className="hidden" accept="image/*" />
                    </div>
                    <Button type="button">ค้นหาด้วยรูปภาพ</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button type="submit" className="rounded-r-lg bg-teal-600 hover:bg-teal-700 px-6" disabled={isSearching}>
                {isSearching ? "กำลังตรวจสอบ..." : "ตรวจสอบ"}
              </Button>
            </div>
          </div>

          {/* Quick Search Types */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {searchTypes.slice(1).map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setSearchType(type.value)}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-colors text-sm ${
                  searchType === type.value
                    ? "bg-teal-50 border-teal-200 text-teal-700"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {type.icon}
                <span className="hidden sm:inline">{type.label}</span>
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Search Results Dialog */}
      <Dialog open={isResultDialogOpen} onOpenChange={setIsResultDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">ผลการตรวจสอบ: "{searchTerm}"</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result) => (
                  <div key={result.id}>{getStatusCard(result)}</div>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <AlertTriangle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-amber-800 mb-2">ไม่พบข้อมูลในระบบ</h3>
                  <p className="text-amber-600 mb-4">ไม่พบข้อมูลสำหรับ "{searchTerm}" ในระบบของเรา</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
                    <h4 className="font-medium text-amber-800 mb-2">คำแนะนำ:</h4>
                    <ul className="space-y-1 text-sm text-amber-700">
                      <li>• ตรวจสอบการสะกดให้ถูกต้อง</li>
                      <li>• ขอดูเอกสารยืนยันตัวตนจากเจ้าของข้อมูล</li>
                      <li>• ระวังการทำธุรกรรมกับบุคคลที่ไม่รู้จัก</li>
                      <li>• แจ้งข้อมูลให้เราเพื่อเพิ่มในระบบ</li>
                    </ul>
                  </div>
                  <div className="flex gap-2 justify-center mt-4">
                    <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                      <Flag className="h-4 w-4 mr-2" />
                      แจ้งข้อมูลเพิ่มเติม
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
