"use client"

import { MapPin } from "lucide-react"

interface AccommodationMapProps {
  location: string
}

export function AccommodationMap({ location }: AccommodationMapProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium">ที่ตั้ง</h2>

      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">แผนที่จะแสดงที่นี่</p>
          <p className="text-sm text-gray-400 mt-1">ในระบบจริงจะใช้ Google Maps หรือ OpenStreetMap</p>
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-medium mb-2">ที่อยู่</h3>
        <p className="text-gray-600">{location}</p>

        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-sm">สถานที่ใกล้เคียง</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• ตลาดวโรรส - 2.5 กม.</li>
            <li>• วัดพระสิงห์ - 3.1 กม.</li>
            <li>• ประตูท่าแพ - 2.8 กม.</li>
            <li>• สนามบินเชียงใหม่ - 15 กม.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
