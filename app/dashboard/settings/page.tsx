"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Camera, CreditCard, Eye, EyeOff, Save, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MemberSettingsPage() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [profileImage, setProfileImage] = useState("/placeholder.svg?height=100&width=100&text=สช")

  const handleSave = () => {
    toast({
      title: "บันทึกสำเร็จ",
      description: "การตั้งค่าของคุณได้รับการบันทึกแล้ว",
    })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">ตั้งค่าบัญชี</h1>
        <p className="text-gray-500">จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">ข้อมูลส่วนตัว</TabsTrigger>
          <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
          <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
          <TabsTrigger value="payment">การชำระเงิน</TabsTrigger>
          <TabsTrigger value="privacy">ความเป็นส่วนตัว</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
              <CardDescription>อัพเดตข้อมูลส่วนตัวและรูปโปรไฟล์ของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Image */}
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                  <AvatarFallback>สช</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="profile-image" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                      <Camera className="h-4 w-4" />
                      เปลี่ยนรูปโปรไฟล์
                    </div>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </Label>
                  <p className="text-xs text-gray-500">JPG, PNG หรือ GIF (ขนาดสูงสุด 2MB)</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">ชื่อ</Label>
                  <Input id="firstName" defaultValue="สมชาย" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">นามสกุล</Label>
                  <Input id="lastName" defaultValue="ใจดี" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input id="email" type="email" defaultValue="somchai@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input id="phone" defaultValue="081-234-5678" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">ที่อยู่</Label>
                <Textarea id="address" defaultValue="123 หมู่ 1 ตำบลสันผีเสื้อ อำเภอเมือง จังหวัดเชียงใหม่ 50200" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">เกี่ยวกับคุณ</Label>
                <Textarea
                  id="bio"
                  placeholder="เล่าเกี่ยวกับตัวคุณ ประสบการณ์ในการให้บริการที่พัก..."
                  defaultValue="เป็นเจ้าของที่พักมาเป็นเวลา 5 ปี มีประสบการณ์ในการให้บริการแขกต่างชาติและคนไทย ใส่ใจในรายละเอียดและความสะอาด"
                />
              </div>

              <Button onClick={handleSave} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                บันทึกการเปลี่ยนแปลง
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ความปลอดภัยบัญชี</CardTitle>
              <CardDescription>จัดการรหัสผ่านและการตั้งค่าความปลอดภัย</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">รหัสผ่านปัจจุบัน</Label>
                <div className="relative">
                  <Input id="currentPassword" type={showPassword ? "text" : "password"} placeholder="กรอกรหัสผ่านปัจจุบัน" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">รหัสผ่านใหม่</Label>
                <Input id="newPassword" type="password" placeholder="กรอกรหัสผ่านใหม่" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่านใหม่</Label>
                <Input id="confirmPassword" type="password" placeholder="กรอกรหัสผ่านใหม่อีกครั้ง" />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">การยืนยันตัวตนแบบสองขั้นตอน (2FA)</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">เปิดใช้งาน 2FA</p>
                    <p className="text-sm text-gray-500">เพิ่มความปลอดภัยให้กับบัญชีของคุณ</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">อุปกรณ์ที่เข้าสู่ระบบ</h3>
                <div className="space-y-3">
                  {[
                    { device: "Chrome บน Windows", location: "เชียงใหม่, ประเทศไทย", time: "ขณะนี้", current: true },
                    { device: "Safari บน iPhone", location: "เชียงใหม่, ประเทศไทย", time: "2 ชั่วโมงที่แล้ว", current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-gray-500">
                          {session.location} • {session.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.current && <Badge variant="secondary">ปัจจุบัน</Badge>}
                        {!session.current && (
                          <Button variant="outline" size="sm">
                            ออกจากระบบ
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                บันทึกการเปลี่ยนแปลง
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>การแจ้งเตือน</CardTitle>
              <CardDescription>จัดการการแจ้งเตือนที่คุณต้องการรับ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">การแจ้งเตือนทางอีเมล</h3>
                <div className="space-y-3">
                  {[
                    { title: "การจองใหม่", description: "เมื่อมีผู้จองที่พักของคุณ", enabled: true },
                    { title: "ข้อความใหม่", description: "เมื่อมีข้อความจากลูกค้า", enabled: true },
                    { title: "รีวิวใหม่", description: "เมื่อมีรีวิวใหม่สำหรับที่พักของคุณ", enabled: true },
                    { title: "การอัพเดตระบบ", description: "ข่าวสารและการอัพเดตจากระบบ", enabled: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">การแจ้งเตือนทาง SMS</h3>
                <div className="space-y-3">
                  {[
                    { title: "การจองเร่งด่วน", description: "การจองที่ต้องการการตอบกลับด่วน", enabled: true },
                    { title: "การยกเลิกการจอง", description: "เมื่อมีการยกเลิกการจอง", enabled: true },
                    { title: "รายงานปัญหา", description: "เมื่อมีรายงานปัญหาเกี่ยวกับที่พักของคุณ", enabled: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">การแจ้งเตือนในแอป</h3>
                <div className="space-y-3">
                  {[
                    { title: "การแจ้งเตือนทั้งหมด", description: "รับการแจ้งเตือนในแอปพลิเคชัน", enabled: true },
                    { title: "เสียงแจ้งเตือน", description: "เปิดเสียงเมื่อมีการแจ้งเตือน", enabled: false },
                    { title: "การสั่นเตือน", description: "เปิดการสั่นเมื่อมีการแจ้งเตือน", enabled: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                      <Switch defaultChecked={item.enabled} />
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={handleSave} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                บันทึกการเปลี่ยนแปลง
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>วิธีการชำระเงิน</CardTitle>
              <CardDescription>จัดการบัตรเครดิต/เดบิตและวิธีการชำระเงิน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">บัตรที่บันทึกไว้</h3>
                <div className="space-y-3">
                  {[
                    { type: "Visa", last4: "4242", expiry: "12/25", default: true },
                    { type: "Mastercard", last4: "8888", expiry: "08/26", default: false },
                  ].map((card, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {card.type} •••• {card.last4}
                          </p>
                          <p className="text-sm text-gray-500">หมดอายุ {card.expiry}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {card.default && <Badge>ค่าเริ่มต้น</Badge>}
                        <Button variant="outline" size="sm">
                          แก้ไข
                        </Button>
                        <Button variant="outline" size="sm">
                          ลบ
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  เพิ่มบัตรใหม่
                </Button>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">ประวัติการชำระเงิน</h3>
                <div className="space-y-3">
                  {[
                    { date: "15 มิ.ย. 2567", amount: "฿299", description: "แพ็คเก็จพรีเมียม - 1 เดือน", status: "สำเร็จ" },
                    { date: "15 พ.ค. 2567", amount: "฿299", description: "แพ็คเก็จพรีเมียม - 1 เดือน", status: "สำเร็จ" },
                    { date: "15 เม.ย. 2567", amount: "฿299", description: "แพ็คเก็จพรีเมียม - 1 เดือน", status: "สำเร็จ" },
                  ].map((payment, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{payment.amount}</p>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ความเป็นส่วนตัว</CardTitle>
              <CardDescription>จัดการการมองเห็นข้อมูลและความเป็นส่วนตัวของคุณ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">การมองเห็นโปรไฟล์</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">แสดงโปรไฟล์ในผลการค้นหา</p>
                      <p className="text-sm text-gray-500">อนุญาตให้ผู้อื่นค้นหาและเห็นโปรไฟล์ของคุณ</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">แสดงเบอร์โทรศัพท์</p>
                      <p className="text-sm text-gray-500">แสดงเบอร์โทรศัพท์ในโปรไฟล์สาธารณะ</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">แสดงอีเมล</p>
                      <p className="text-sm text-gray-500">แสดงอีเมลในโปรไฟล์สาธารณะ</p>
                    </div>
                    <Switch defaultChecked={false} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">การติดตามและการวิเคราะห์</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">อนุญาตการติดตามการใช้งาน</p>
                      <p className="text-sm text-gray-500">ช่วยปรับปรุงบริการและแสดงเนื้อหาที่เกี่ยวข้อง</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">รับข้อเสนอส่วนบุคคล</p>
                      <p className="text-sm text-gray-500">รับข้อเสนอและโปรโมชั่นที่เหมาะกับคุณ</p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">การจัดการข้อมูล</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Upload className="h-4 w-4 mr-2" />
                    ดาวน์โหลดข้อมูลของคุณ
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <User className="h-4 w-4 mr-2" />
                    ลบบัญชีผู้ใช้
                  </Button>
                </div>
              </div>

              <Button onClick={handleSave} className="w-full md:w-auto">
                <Save className="h-4 w-4 mr-2" />
                บันทึกการเปลี่ยนแปลง
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
