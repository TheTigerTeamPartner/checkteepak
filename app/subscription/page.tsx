"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  Star,
  Shield,
  Crown,
  CreditCard,
  Smartphone,
  Building2,
  TrendingUp,
  Bell,
  Eye,
  Share2,
  Link2,
  Verified,
  HandHeart,
  Target,
} from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  duration: number
  originalPrice: number
  price: number
  discount: number
  popular: boolean
  features: string[]
  badge?: string
}

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("3")
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card")

  const plans: SubscriptionPlan[] = [
    {
      id: "1",
      name: "รายเดือน",
      duration: 1,
      originalPrice: 199,
      price: 199,
      discount: 0,
      popular: false,
      features: ["โปรไฟล์ยืนยันความน่าเชื่อถือ", "ตราสัญลักษณ์ยืนยันแล้ว", "ลิงก์แชร์โปรไฟล์ให้ลูกค้า", "การสนับสนุนลูกค้า 24/7"],
    },
    {
      id: "3",
      name: "3 เดือน",
      duration: 3,
      originalPrice: 597,
      price: 549,
      discount: 8,
      popular: true,
      badge: "ยอดนิยม",
      features: [
        "ทุกฟีเจอร์ในแพ็คเก็จรายเดือน",
        "การแสดงผลในผลการค้นหาอันดับต้น",
        "สถิติการเข้าชมโปรไฟล์",
        "การแจ้งเตือนเมื่อลูกค้าตรวจสอบ",
      ],
    },
    {
      id: "6",
      name: "6 เดือน",
      duration: 6,
      originalPrice: 1194,
      price: 999,
      discount: 16,
      popular: false,
      badge: "คุ้มค่า",
      features: ["ทุกฟีเจอร์ในแพ็คเก็จ 3 เดือน", "การโปรโมทพิเศษในหน้าแรก", "รายงานการวิเคราะห์ลูกค้า", "การปรึกษาการตลาดออนไลน์"],
    },
    {
      id: "12",
      name: "12 เดือน",
      duration: 12,
      originalPrice: 2388,
      price: 1799,
      discount: 25,
      popular: false,
      badge: "ประหยัดสุด",
      features: [
        "ทุกฟีเจอร์ในแพ็คเก็จ 6 เดือน",
        "การวิเคราะห์แนวโน้มตลาดขั้นสูง",
        "เครื่องมือการตลาดเพิ่มเติม",
        "การสนับสนุนแบบ VIP",
        "เข้าร่วมเวิร์กช็อปการขายออนไลน์",
      ],
    },
  ]

  const membershipBenefits = [
    {
      icon: <Verified className="h-6 w-6 text-teal-600" />,
      title: "ตราสัญลักษณ์ยืนยันแล้ว",
      description: "ได้รับตราสัญลักษณ์ยืนยันความน่าเชื่อถือที่แสดงในโปรไฟล์และผลการค้นหา",
    },
    {
      icon: <Share2 className="h-6 w-6 text-blue-600" />,
      title: "ลิงก์แชร์โปรไฟล์",
      description: "ส่งลิงก์โปรไฟล์ที่ยืนยันแล้วให้ลูกค้าตรวจสอบความน่าเชื่อถือ",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-purple-600" />,
      title: "เพิ่มโอกาสการขาย",
      description: "ลูกค้ามั่นใจมากขึ้นเมื่อเห็นการยืนยันความน่าเชื่อถือ เพิ่มอัตราการจองสูงขึ้น",
    },
    {
      icon: <Eye className="h-6 w-6 text-green-600" />,
      title: "การมองเห็นที่ดีขึ้น",
      description: "โปรไฟล์ของคุณจะแสดงในผลการค้นหาอันดับต้นๆ",
    },
    {
      icon: <Bell className="h-6 w-6 text-orange-600" />,
      title: "แจ้งเตือนการตรวจสอบ",
      description: "รับการแจ้งเตือนเมื่อลูกค้าเข้ามาตรวจสอบโปรไฟล์ของคุณ",
    },
    {
      icon: <HandHeart className="h-6 w-6 text-red-600" />,
      title: "สร้างความไว้วางใจ",
      description: "การยืนยันจากระบบช่วยสร้างความไว้วางใจให้กับลูกค้าใหม่",
    },
  ]

  const paymentMethods = [
    {
      id: "credit-card",
      name: "บัตรเครดิต/เดบิต",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Visa, Mastercard, JCB",
    },
    {
      id: "mobile-banking",
      name: "Mobile Banking",
      icon: <Smartphone className="h-5 w-5" />,
      description: "ธนาคารชั้นนำทุกธนาคาร",
    },
    {
      id: "bank-transfer",
      name: "โอนเงินผ่านธนาคาร",
      icon: <Building2 className="h-5 w-5" />,
      description: "โอนเงินผ่านแอปธนาคาร",
    },
  ]

  const successStories = [
    {
      name: "คุณสมชาย ใจดี",
      role: "นายหน้าอสังหาริมทรัพย์",
      location: "เชียงใหม่",
      increase: "85%",
      story: "หลังจากได้การยืนยัน ลูกค้าเชื่อใจมากขึ้น ยอดจองเพิ่มขึ้น 85% ในเดือนแรก",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "คุณมาลี สวยงาม",
      role: "เจ้าของรีสอร์ท",
      location: "ภูเก็ต",
      increase: "120%",
      story: "การยืนยันช่วยให้ลูกค้าต่างชาติมั่นใจในการจอง ยอดขายเพิ่มขึ้นเป็นสองเท่า",
      image: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "คุณวิชัย ท่องเที่ยว",
      role: "เจ้าของโฮมสเตย์",
      location: "กรุงเทพฯ",
      increase: "65%",
      story: "ลูกค้าไม่ต้องกังวลเรื่องการโกง ทำให้การตัดสินใจจองเร็วขึ้น",
      image: "/placeholder.svg?height=60&width=60",
    },
  ]

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.id === selectedPlan)
    if (plan) {
      alert(
        `กำลังดำเนินการสมัครแพ็คเก็จ ${plan.name} ราคา ${plan.price} บาท ด้วยวิธี ${paymentMethods.find((p) => p.id === paymentMethod)?.name}`,
      )
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-2 rounded-full mb-4">
          <Crown className="h-5 w-5" />
          <span className="font-medium">การยืนยันความน่าเชื่อถือ</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          สร้างความไว้วางใจ
          <br />
          <span className="text-teal-600">เพิ่มยอดขายด้วยการยืนยัน</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
          สำหรับนายหน้าและเจ้าของที่พักที่ต้องการสร้างความน่าเชื่อถือ ให้ลูกค้ามั่นใจในการจอง และเพิ่มโอกาสในการขายด้วยความสุจริต
        </p>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>ยืนยันตัวตนจริง</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span>ตรวจสอบเอกสาร</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            <span>เพิ่มความน่าเชื่อถือ</span>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">เรื่องราวความสำเร็จ</h2>
          <p className="text-gray-600">ดูว่าการยืนยันช่วยเพิ่มยอดขายของสมาชิกได้อย่างไร</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {successStories.map((story, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-4">
                  <img
                    src={story.image || "/placeholder.svg"}
                    alt={story.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{story.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {story.role} • {story.location}
                </p>
                <div className="text-3xl font-bold text-teal-600 mb-3">+{story.increase}</div>
                <p className="text-sm text-gray-700">{story.story}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16 bg-gray-50 rounded-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">วิธีการทำงาน</h2>
          <p className="text-gray-600">ขั้นตอนง่ายๆ เพื่อได้รับการยืนยันความน่าเชื่อถือ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-teal-600">1</span>
            </div>
            <h3 className="font-bold mb-2">สมัครสมาชิก</h3>
            <p className="text-sm text-gray-600">เลือกแพ็คเก็จที่เหมาะสมและชำระเงิน</p>
          </div>

          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-bold mb-2">ส่งเอกสาร</h3>
            <p className="text-sm text-gray-600">อัปโหลดเอกสารยืนยันตัวตนและใบอนุญาต</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="font-bold mb-2">ตรวจสอบ</h3>
            <p className="text-sm text-gray-600">ทีมงานตรวจสอบเอกสารภายใน 24-48 ชั่วโมง</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">4</span>
            </div>
            <h3 className="font-bold mb-2">ได้รับการยืนยัน</h3>
            <p className="text-sm text-gray-600">รับตราสัญลักษณ์และลิงก์แชร์ให้ลูกค้า</p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">เลือกแพ็คเก็จที่เหมาะกับธุรกิจคุณ</h2>
          <p className="text-gray-600">ยิ่งสมัครนาน ยิ่งประหยัด และได้ประโยชน์มากขึ้น</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === plan.id ? "ring-2 ring-teal-500 shadow-lg" : ""
              } ${plan.popular ? "border-teal-500" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge
                    className={`${
                      plan.popular
                        ? "bg-teal-500 hover:bg-teal-600"
                        : plan.badge === "คุ้มค่า"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-purple-500 hover:bg-purple-600"
                    }`}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="space-y-2">
                  {plan.discount > 0 && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500 line-through">฿{plan.originalPrice.toLocaleString()}</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        ประหยัด {plan.discount}%
                      </Badge>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-teal-600">฿{plan.price.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">
                    {plan.duration === 1 ? "ต่อเดือน" : `สำหรับ ${plan.duration} เดือน`}
                  </div>
                  {plan.duration > 1 && (
                    <div className="text-xs text-gray-400">(฿{Math.round(plan.price / plan.duration)} ต่อเดือน)</div>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Plan Summary */}
        {selectedPlan && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  แพ็คเก็จที่เลือก: {plans.find((p) => p.id === selectedPlan)?.name}
                </h3>
                <p className="text-gray-600">
                  ราคา ฿{plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}
                  {plans.find((p) => p.id === selectedPlan)?.discount > 0 && (
                    <span className="ml-2 text-green-600 font-medium">
                      (ประหยัด {plans.find((p) => p.id === selectedPlan)?.discount}%)
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">
                  ฿{plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">รวมภาษี VAT 7%</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Payment Method */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">เลือกวิธีการชำระเงิน</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                paymentMethod === method.id ? "ring-2 ring-teal-500 shadow-md" : ""
              }`}
              onClick={() => setPaymentMethod(method.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">{method.icon}</div>
                  <div>
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-gray-500">{method.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 px-8" onClick={handleSubscribe}>
            <Crown className="h-5 w-5 mr-2" />
            สมัครการยืนยันความน่าเชื่อถือ
          </Button>
          <p className="text-sm text-gray-500 mt-2">การตรวจสอบจะเริ่มต้นทันทีหลังจากการชำระเงิน</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">ประโยชน์ที่คุณจะได้รับ</h2>
          <p className="text-gray-600">เครื่องมือและสิทธิพิเศษสำหรับสมาชิกที่ยืนยันแล้ว</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membershipBenefits.map((benefit, index) => (
            <Card key={index} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Example Profile Link */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">ตัวอย่างลิงก์ที่คุณจะได้รับ</h2>
          <p className="text-gray-600">ส่งลิงก์นี้ให้ลูกค้าเพื่อตรวจสอบความน่าเชื่อถือของคุณ</p>
        </div>

        <Card className="max-w-2xl mx-auto border-teal-200 bg-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full overflow-hidden">
                <img src="/placeholder.svg?height=64&width=64" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">คุณสมชาย ใจดี</h3>
                  <Badge className="bg-green-500 hover:bg-green-600">
                    <Verified className="h-3 w-3 mr-1" />
                    ยืนยันแล้ว
                  </Badge>
                </div>
                <p className="text-gray-600">นายหน้าอสังหาริมทรัพย์ • เชียงใหม่</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-sm font-medium">4.8 (124 รีวิว)</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="h-4 w-4 text-teal-600" />
                <span className="font-medium">ลิงก์ตรวจสอบความน่าเชื่อถือ</span>
              </div>
              <div className="bg-gray-100 rounded p-2 font-mono text-sm">
                https://checkteepak.com/agent/somchai-verified
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button size="sm" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                แชร์ลิงก์
              </Button>
              <Button size="sm" variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                ดูโปรไฟล์
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">คำถามที่พบบ่อย</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">การยืนยันใช้เวลานานแค่ไหน?</h3>
              <p className="text-gray-600">
                ทีมงานจะตรวจสอบเอกสารภายใน 24-48 ชั่วโมงหลังจากได้รับเอกสารครบถ้วน หากเอกสารไม่ครบหรือไม่ชัดเจน
                เราจะติดต่อกลับเพื่อขอเอกสารเพิ่มเติม
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">ต้องเตรียมเอกสารอะไรบ้าง?</h3>
              <p className="text-gray-600">
                สำเนาบัตรประชาชน, ใบอนุญาตประกอบธุรกิจ (ถ้ามี), เอกสารสิทธิ์ที่ดิน/โฉนด (สำหรับเจ้าของที่พัก),
                และรูปถ่ายหน้าตรงพร้อมถือบัตรประชาชน
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">สามารถยกเลิกได้หรือไม่?</h3>
              <p className="text-gray-600">
                สามารถยกเลิกได้ทุกเมื่อ แต่การยืนยันจะหมดอายุตามระยะเวลาที่ชำระไว้ ไม่มีการคืนเงินสำหรับระยะเวลาที่เหลือ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-2">ลูกค้าจะเห็นข้อมูลอะไรบ้าง?</h3>
              <p className="text-gray-600">
                ลูกค้าจะเห็นชื่อ, ตำแหน่ง, ที่อยู่, เบอร์โทร, ตราสัญลักษณ์ยืนยันแล้ว, คะแนนรีวิว, และประวัติการทำธุรกรรม
                โดยไม่เปิดเผยข้อมูลส่วนตัวที่ละเอียดอ่อน
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl overflow-hidden">
        <div className="px-6 py-12 md:py-16 md:px-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">เริ่มสร้างความไว้วางใจวันนี้</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            เข้าร่วมกับนายหน้าและเจ้าของที่พักกว่า 5,000 คนที่เลือกใช้บริการยืนยันความน่าเชื่อถือของเรา
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-white/90">
              <Target className="h-5 w-5 mr-2" />
              เริ่มต้นการยืนยัน
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
              ดูตัวอย่างโปรไฟล์
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
