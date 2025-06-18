"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  Shield,
  AlertTriangle,
  AlertCircle,
  Eye,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type SearchResultType = "verified" | "unknown" | "fraudster"

interface SearchResult {
  type: SearchResultType
  query: string
  data?: {
    id: string
    name: string
    phone: string
    email: string
    location: string
    joinDate: string
    verificationStatus: string
    profileImage: string
    specialties: string[]
  }
  fraudData?: {
    reportCount: number
    lastReported: string
    commonScams: string[]
  }
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [result, setResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate search API call
    const simulateSearch = () => {
      setIsLoading(true)

      setTimeout(() => {
        // Mock search logic based on query
        let mockResult: SearchResult

        if (query.includes("081-234-5678") || query.includes("สมชาย")) {
          // Verified member
          mockResult = {
            type: "verified",
            query,
            data: {
              id: "member-001",
              name: "คุณสมชาย ใจดี",
              phone: "081-234-5678",
              email: "somchai.jaidee@example.com",
              location: "เชียงใหม่, ประเทศไทย",
              joinDate: "มิถุนายน 2567",
              verificationStatus: "ยืนยันตัวตนแล้ว",
              profileImage: "/placeholder.svg?height=120&width=120",
              specialties: ["คอนโด", "บ้านเดี่ยว", "ทาวน์เฮาส์"],
            },
          }
        } else if (query.includes("โกง") || query.includes("หลอก") || query.includes("999")) {
          // Fraudster
          mockResult = {
            type: "fraudster",
            query,
            fraudData: {
              reportCount: 15,
              lastReported: "2 วันที่แล้ว",
              commonScams: ["หลอกโอนเงินมัดจำ", "ใช้รูปที่พักปลอม", "หายตัวหลังรับเงิน"],
            },
          }
        } else {
          // Unknown
          mockResult = {
            type: "unknown",
            query,
          }
        }

        setResult(mockResult)
        setIsLoading(false)
      }, 1500)
    }

    if (query) {
      simulateSearch()
    }
  }, [query])

  const getResultColor = (type: SearchResultType) => {
    switch (type) {
      case "verified":
        return "green"
      case "unknown":
        return "yellow"
      case "fraudster":
        return "red"
      default:
        return "gray"
    }
  }

  const getResultIcon = (type: SearchResultType) => {
    switch (type) {
      case "verified":
        return <Shield className="h-8 w-8" />
      case "unknown":
        return <AlertTriangle className="h-8 w-8" />
      case "fraudster":
        return <AlertCircle className="h-8 w-8" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับหน้าแรก
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">กำลังค้นหา...</h2>
              <p className="text-gray-600">กำลังตรวจสอบข้อมูล "{query}" ในระบบ</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
                <ArrowLeft className="h-4 w-4 mr-2" />
                กลับหน้าแรก
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">ไม่พบผลการค้นหา</h2>
              <p className="text-gray-600">กรุณาลองค้นหาด้วยคำค้นอื่น</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const color = getResultColor(result.type)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับหน้าแรก
            </Link>
          </div>

          {/* Search Query Display */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">ผลการค้นหา</h1>
            <p className="text-gray-600">
              คำค้นหา: <span className="font-medium">"{query}"</span>
            </p>
          </div>

          {/* Result Card */}
          <div
            className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-8 ${
              color === "green" ? "border-green-500" : color === "yellow" ? "border-yellow-500" : "border-red-500"
            }`}
          >
            {/* Header */}
            <div
              className={`p-6 ${color === "green" ? "bg-green-50" : color === "yellow" ? "bg-yellow-50" : "bg-red-50"}`}
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-full ${
                    color === "green"
                      ? "bg-green-100 text-green-600"
                      : color === "yellow"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                  }`}
                >
                  {getResultIcon(result.type)}
                </div>
                <div className="ml-4">
                  <h2
                    className={`text-xl font-bold ${
                      color === "green" ? "text-green-800" : color === "yellow" ? "text-yellow-800" : "text-red-800"
                    }`}
                  >
                    {result.type === "verified" && "✅ พบข้อมูลในระบบ - ปลอดภัย"}
                    {result.type === "unknown" && "⚠️ ไม่พบข้อมูลในระบบ - ควรระวัง"}
                    {result.type === "fraudster" && "🚨 ตรวจพบมิจฉาชีพ - อันตราย"}
                  </h2>
                  <p
                    className={`${
                      color === "green" ? "text-green-700" : color === "yellow" ? "text-yellow-700" : "text-red-700"
                    }`}
                  >
                    {result.type === "verified" && "สมาชิกที่ได้รับการรับรองจากระบบ"}
                    {result.type === "unknown" && "ไม่มีข้อมูลการยืนยันตัวตน"}
                    {result.type === "fraudster" && "มีรายงานการฉ้อโกงหลายครั้ง"}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {result.type === "verified" && result.data && (
                <div>
                  <div className="flex flex-col md:flex-row gap-6 mb-6">
                    <div className="flex-shrink-0">
                      <img
                        src={result.data.profileImage || "/placeholder.svg"}
                        alt={result.data.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto md:mx-0"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{result.data.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {result.data.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          สมาชิกตั้งแต่ {result.data.joinDate}
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          {result.data.verificationStatus}
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">ความเชี่ยวชาญ:</p>
                        <div className="flex flex-wrap gap-2">
                          {result.data.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-green-800 mb-1">การรับรอง 100%</h4>
                        <p className="text-green-700 text-sm">
                          สมาชิกคนนี้ได้ผ่านการตรวจสอบและยืนยันตัวตนจากระบบของเราแล้ว คุณสามารถจองที่พักกับสมาชิกคนนี้ได้อย่างปลอดภัย 100%
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href={`/agent/${result.data.id}`} className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <Eye className="h-4 w-4 mr-2" />
                        ดูโปรไฟล์เต็ม
                      </Button>
                    </Link>
                    <Button variant="outline" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      ติดต่อโดยตรง
                    </Button>
                  </div>
                </div>
              )}

              {result.type === "unknown" && (
                <div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-800 mb-1">ไม่พบข้อมูลในระบบ</h4>
                        <p className="text-yellow-700 text-sm mb-3">
                          เราไม่พบข้อมูลการยืนยันตัวตนของ "{query}" ในระบบของเรา ซึ่งอาจมีความเสี่ยงในการทำธุรกรรม
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">คำแนะนำเพื่อความปลอดภัย</h4>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• ขอดูเอกสารยืนยันตัวตนก่อนโอนเงิน</li>
                      <li>• ตรวจสอบที่พักจริงก่อนจ่ายเงิน</li>
                      <li>• หลีกเลี่ยงการโอนเงินล่วงหน้าทั้งหมด</li>
                      <li>• แนะนำให้เลือกใช้บริการจากสมาชิกที่ยืนยันตัวตนแล้ว</li>
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/" className="flex-1">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700">ค้นหาสมาชิกที่ยืนยันแล้ว</Button>
                    </Link>
                    <Link href="/report" className="flex-1">
                      <Button variant="outline" className="w-full">
                        แจ้งเหตุผิดปกติ
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {result.type === "fraudster" && result.fraudData && (
                <div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <XCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-red-800 mb-1">🚨 ตรวจพบมิจฉาชีพ</h4>
                        <p className="text-red-700 text-sm mb-3">
                          "{query}" ถูกรายงานว่าเป็นมิจฉาชีพ มีการฉ้อโกงหลายครั้ง
                          <strong className="font-semibold"> ควรเลิกติดต่อและบล็อคทันที</strong>
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium">จำนวนรายงาน:</span> {result.fraudData.reportCount} ครั้ง
                          </div>
                          <div>
                            <span className="font-medium">รายงานล่าสุด:</span> {result.fraudData.lastReported}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-gray-800 mb-2">รูปแบบการฉ้อโกงที่พบ</h4>
                    <ul className="text-gray-700 text-sm space-y-1">
                      {result.fraudData.commonScams.map((scam, index) => (
                        <li key={index}>• {scam}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold text-green-800 mb-2">คำแนะนำ</h4>
                    <p className="text-green-700 text-sm">
                      เพื่อความปลอดภัย แนะนำให้จองที่พักกับสมาชิกที่ผ่านการยืนยันตัวตนจากระบบของเราเท่านั้น ซึ่งจะได้รับการรับรองความปลอดภัย
                      100%
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/" className="flex-1">
                      <Button className="w-full bg-green-600 hover:bg-green-700">ค้นหาสมาชิกที่ปลอดภัย</Button>
                    </Link>
                    <Link href="/report" className="flex-1">
                      <Button variant="destructive" className="w-full">
                        แจ้งเหตุเพิ่มเติม
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>ข้อมูลอัปเดตล่าสุด: วันนี้ เวลา {new Date().toLocaleTimeString("th-TH")}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
