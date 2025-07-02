"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import {
  ArrowLeft, Shield, AlertTriangle, AlertCircle,
  Eye, Phone, MapPin, Calendar, CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
    propertyTypes: string[]
    bio?: string
  }
}

export default function SearchResultsPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [result, setResult] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClientComponentClient()

    const fetchData = async () => {
      setIsLoading(true)

      try {
        const { data, error } = await supabase
          .from("agents")
          .select("*")
          .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%,title.ilike.%${query}%`)
          .maybeSingle()

        if (error) {
          console.error("Supabase error:", error)
          throw error
        }

        if (data) {
          setResult({
            type: "verified",
            query,
            data: {
              id: data.id,
              name: data.name || data.title || "ไม่ระบุชื่อ",
              phone: data.phone || "-",
              email: data.email || "-",
              location: data.location || "ไม่ระบุที่อยู่",
              joinDate: new Date(data.join_date).toLocaleDateString("th-TH", {
                year: "numeric", month: "long", day: "numeric",
              }),
              verificationStatus: "ยืนยันตัวตนแล้ว",
              profileImage: data.profileImage || "/placeholder.svg",
              specialties: Array.isArray(data.certification)
                ? data.certification
                : typeof data.certification === "string"
                  ? JSON.parse(data.certification || "[]")
                  : [],
              propertyTypes: Array.isArray(data.property_types)
                ? data.property_types
                : typeof data.property_types === "string"
                  ? JSON.parse(data.property_types || "[]")
                  : [],
              bio: data.bio || "",
            },
          })
        } else {
          setResult({ type: "unknown", query })
        }
      } catch (err) {
        console.error("Search error:", err)
        setResult({ type: "unknown", query })
      }

      setIsLoading(false)
    }

    if (query) fetchData()
  }, [query])

  const getResultColor = (type: SearchResultType) =>
    type === "verified" ? "green" : type === "fraudster" ? "red" : "yellow"

  const getResultIcon = (type: SearchResultType) =>
    type === "verified" ? <Shield className="h-8 w-8" /> :
      type === "fraudster" ? <AlertCircle className="h-8 w-8" /> :
        <AlertTriangle className="h-8 w-8" />

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-teal-600 rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">กำลังค้นหา...</h2>
          <p className="text-gray-600">กำลังตรวจสอบข้อมูล "{query}"</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const color = getResultColor(result.type)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับหน้าแรก
        </Link>

        <div className={`bg-white border-l-8 shadow-lg rounded-xl overflow-hidden ${color === "green" ? "border-green-500" : "border-yellow-500"}`}>
          <div className={`p-6 ${color === "green" ? "bg-green-50" : "bg-yellow-50"}`}>
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${color === "green" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
                {getResultIcon(result.type)}
              </div>
              <div className="ml-4">
                <h2 className={`text-xl font-bold ${color === "green" ? "text-green-800" : "text-yellow-800"}`}>
                  {result.type === "verified" && "✅ พบข้อมูลในระบบ - ปลอดภัย"}
                  {result.type === "unknown" && "⚠️ ไม่พบข้อมูลในระบบ - ควรระวัง"}
                </h2>
              </div>
            </div>
          </div>

          {result.type === "verified" && result.data && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <img
                  src={result.data.profileImage}
                  alt={result.data.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
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

                  {result.data.propertyTypes.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">อสังหาที่เชี่ยวชาญ</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.data.propertyTypes.map((type, i) => (
                          <Badge key={i} variant="outline" className="rounded-full border-blue-300 text-blue-700">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.data.specialties.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">ความเชี่ยวชาญ</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.data.specialties.map((item, i) => (
                          <Badge key={i} variant="secondary" className="rounded-full">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.data.bio && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-1">ข้อมูลพื้นฐาน</h4>
                      <p className="text-sm text-gray-700">{result.data.bio}</p>
                    </div>
                  )}
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
        </div>
      </div>
    </div>
  )
}
