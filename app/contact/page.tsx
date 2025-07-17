import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Component() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">ติดต่อเรา</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            เรายินดีที่จะรับฟังความคิดเห็นและข้อเสนอแนะจากคุณ กรุณาติดต่อเราผ่านช่องทางด้านล่าง
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">ส่งข้อความถึงเรา</CardTitle>
              <CardDescription>กรอกแบบฟอร์มด้านล่างแล้วเราจะติดต่อกลับโดยเร็วที่สุด</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">ชื่อ</Label>
                  <Input id="firstName" placeholder="กรอกชื่อของคุณ" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">นามสกุล</Label>
                  <Input id="lastName" placeholder="กรอกนามสกุลของคุณ" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" type="email" placeholder="example@email.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input id="phone" type="tel" placeholder="08X-XXX-XXXX" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">หัวข้อ</Label>
                <Input id="subject" placeholder="เรื่องที่ต้องการติดต่อ" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">ข้อความ</Label>
                <Textarea id="message" placeholder="กรุณาระบุรายละเอียดที่ต้องการติดต่อ..." className="min-h-[120px]" />
              </div>

              <Button className="w-full" size="lg">
                ส่งข้อความ
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">ข้อมูลการติดต่อ</CardTitle>
                <CardDescription>ช่องทางการติดต่อและที่อยู่ของเรา</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">ที่อยู่</h3>
                    <p className="text-gray-600 mt-1">
                      123 ถนนสุขุมวิท อาคารเช็คที่พัก  แขวงคลองตัน 
                      <br />
                      เขตวัฒนา กรุงเทพมหานคร 10110
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">โทรศัพท์</h3>
                    <p className="text-gray-600 mt-1">02-123-4567</p>
                    <p className="text-gray-600">02-123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">อีเมล</h3>
                    <p className="text-gray-600 mt-1">checkteepak@gmail.com </p>
                    <p className="text-gray-600">checkteepak@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">เวลาทำการ</h3>
                    <p className="text-gray-600 mt-1">จันทร์ - ศุกร์: 9:00 - 18:00</p>
                    <p className="text-gray-600">เสาร์: 9:00 - 16:00</p>
                    <p className="text-gray-600">อาทิตย์: ปิด</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">แผนที่</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full h-64 bg-gray-200 rounded-b-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2" />
                    <p>แผนที่แสดงตำแหน่งที่ตั้ง</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mt-12 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">คำถามที่พบบ่อย</CardTitle>
            <CardDescription>คำตอบสำหรับคำถามที่ลูกค้าสอบถามบ่อยๆ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">เวลาตอบกลับเป็นอย่างไร?</h3>
                <p className="text-gray-600">เราจะตอบกลับภายใน 24 ชั่วโมงในวันทำการ</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">สามารถนัดหมายได้หรือไม่?</h3>
                <p className="text-gray-600">สามารถนัดหมายล่วงหน้าได้โดยโทรศัพท์หรืออีเมล</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">มีบริการหลังการขายหรือไม่?</h3>
                <p className="text-gray-600">เรามีทีมบริการหลังการขายพร้อมให้ความช่วยเหลือ</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">สามารถติดต่อนอกเวลาทำการได้หรือไม่?</h3>
                <p className="text-gray-600">สามารถส่งข้อความผ่านแบบฟอร์มหรืออีเมลได้ตลอดเวลา</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
