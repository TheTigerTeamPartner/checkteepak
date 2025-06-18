import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, ArrowLeft } from "lucide-react"

export default function ComingSoonPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-gradient-to-r from-teal-500 to-blue-500 text-white font-bold rounded-md p-3 mb-6">
        <span className="text-2xl">CT</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">เร็วๆ นี้</h1>

      <div className="flex items-center justify-center mb-8">
        <Clock className="h-8 w-8 text-teal-500 mr-2" />
        <p className="text-xl text-gray-600">อยู่ระหว่างการพัฒนา</p>
      </div>

      <p className="text-gray-600 text-center max-w-lg mb-8">
        ขออภัยในความไม่สะดวก ฟีเจอร์นี้กำลังอยู่ในระหว่างการพัฒนา เราจะเปิดให้บริการในเร็วๆ นี้ โปรดกลับมาใหม่อีกครั้ง
      </p>

      <Button asChild>
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับไปยังหน้าหลัก
        </Link>
      </Button>
    </div>
  )
}
