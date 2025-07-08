import { RecentAccommodations } from "@/components/recent-accommodations"
import { QuickActions } from "@/components/quick-actions"
import { HeroSection } from "@/components/hero-section"
import { FraudAwareness } from "@/components/fraud-awareness"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />



      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">โปรไฟล์ล่าสุดที่ตรวจสอบ</h2>
        <RecentAccommodations />
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">รู้ทันกลโกงของมิจฉาชีพ</h2>
        <FraudAwareness />
      </div>
    </div>
  )
}
