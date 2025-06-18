"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, CheckCircle } from "lucide-react"

interface Accommodation {
  id: string
  name: string
  location: string
  imageUrl: string
  rating: number
  reviewCount: number
  isVerified: boolean
}

export function RecommendedAccommodations() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch from Supabase API
    // fetchAccommodations()
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="h-40 bg-gray-200"></div>
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-3"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (accommodations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">ยังไม่มีข้อมูลที่พัก</p>
        <p className="text-sm text-gray-400 mt-2">กรุณาเพิ่มข้อมูลในระบบ</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {accommodations.map((accommodation) => (
        <Link href={`/accommodation/${accommodation.id}`} key={accommodation.id}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-40 overflow-hidden relative">
              <img
                src={accommodation.imageUrl || "/placeholder.svg"}
                alt={accommodation.name}
                className="w-full h-full object-cover"
              />
              {accommodation.isVerified && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    รับรองแล้ว
                  </Badge>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-1">{accommodation.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{accommodation.location}</p>
              <div className="flex items-center">
                <div className="flex items-center text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm font-medium">{accommodation.rating}</span>
                </div>
                <span className="mx-2 text-gray-300">•</span>
                <span className="text-xs text-gray-500">{accommodation.reviewCount} รีวิว</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
