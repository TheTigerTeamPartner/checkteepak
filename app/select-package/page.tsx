"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Crown, Gift, ArrowRight, Verified, TrendingUp, Share2 } from "lucide-react"

interface PackagePlan {
  id: string
  name: string
  duration: number
  originalPrice: number
  price: number
  discount: number
  popular: boolean
  recommended: boolean
  free: boolean
  features: string[]
  badge?: string
  description: string
}

export default function SelectPackagePage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("trial")
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    // ดึงข้อมูลการสมัครสมาชิกจาก localStorage
    const registrationData = localStorage.getItem("registrationData")
    if (registrationData) {
      setUserData(JSON.parse(registrationData))
    }
  }, [])

  const plans: PackagePlan[] = [
    {
      id: "trial",
      name: "ทดลองใช้งาน",
      duration: 30,
      originalPrice: 0,
      price: 0,
      discount: 0,
      popular: false,
      recommended: false,
      free: true,
      badge: "ฟรี",
      description: "เริ่มต้นใช้งานฟรี 30 วัน",
      features: ["โปรไฟล์พื้นฐาน", "การแสดงผลในผลการค้นหา", "ลิงก์แชร์โปรไฟล์", "การสนับสนุนลูกค้าพื้นฐาน", "จำกัด 3 ที่พัก"],
    },
    {
      id: "3",
      name: "3 เดือน",
      duration: 90,
      originalPrice: 597,
      price: 549,
      discount: 8,
      popular: true,
      recommended: false,
      free: false,
      badge: "ยอดนิยม",
      description: "เหมาะสำหรับการทดลองธุรกิจ",
      features: [
        "ทุกฟีเจอร์ในแพ็คเก็จทดลองใช้",
        "ตราสัญลักษณ์ยืนยันแล้ว",
        "การแสดงผลในผลการค้นหาอันดับต้น",
        "สถิติการเข้าชมโปรไฟล์",
        "การแจ้งเตือนเมื่อลูกค้าตรวจสอบ",
        "ที่พักไม่จำกัด",
      ],
    },
    {
      id: "6",
      name: "6 เดือน",
      duration: 180,
      originalPrice: 1194,
      price: 999,
      discount: 16,
      popular: false,
      recommended: false,
      free: false,
      badge: "คุ้มค่า",
      description: "เหมาะสำหรับธุรกิจขนาดกลาง",
      features: [
        "ทุกฟีเจอร์ในแพ็คเก็จ 3 เดือน",
        "การโปรโมทพิเศษในหน้าแรก",
        "รายงานการวิเคราะห์ลูกค้า",
        "การปรึกษาการตลาดออนไลน์",
        "เครื่องมือการตลาดเพิ่มเติม",
      ],
    },
    {
      id: "12",
      name: "1 ปี",
      duration: 365,
      originalPrice: 2388,
      price: 1799,
      discount: 25,
      popular: false,
      recommended: true,
      free: false,
      badge: "แนะนำ",
      description: "เหมาะสำหรับธุรกิจที่จริงจัง",
      features: [
        "ทุกฟีเจอร์ในแพ็คเก็จ 6 เดือน",
        "การวิเคราะห์แนวโน้มตลาดขั้นสูง",
        "เครื่องมือการตลาดครบชุด",
        "การสนับสนุนแบบ VIP",
        "เข้าร่วมเวิร์กช็อปการขายออนไลน์",
        "ที่ปรึกษาธุรกิจส่วนตัว",
      ],
    },
  ]

  const handleSelectPackage = () => {
    const plan = plans.find((p) => p.id === selectedPlan)
    if (plan) {
      if (plan.free) {
        // สำหรับแพ็คเก็จทดลองใช้ - ไปแดชบอร์ดเลย
        localStorage.setItem("userType", "member")
        localStorage.setItem("packageType", "trial")
        localStorage.setItem("trialStartDate", new Date().toISOString())
        window.location.href = "/dashboard"
      } else {
        // สำหรับแพ็คเก็จที่ต้องชำระเงิน - ไปหน้าชำระเงิน
        localStorage.setItem("selectedPackage", JSON.stringify(plan))
        window.location.href = "/payment"
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-4 py-2 rounded-full mb-4">
          <Crown className="h-5 w-5" />
          <span className="font-medium">เลือกแพ็คเก็จของคุณ</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          ยินดีต้อนรับ
          {userData && (
            <span className="text-teal-600">
              <br />
              คุณ{userData.firstName} {userData.lastName}
            </span>
          )}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          เลือกแพ็คเก็จที่เหมาะสมกับธุรกิจของคุณ เริ่มต้นด้วยการทดลองใช้ฟรี หรือเลือกแพ็คเก็จที่ให้ประโยชน์เต็มรูปแบบ
        </p>
      </div>

      {/* Package Selection */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all hover:shadow-lg ${
                selectedPlan === plan.id ? "ring-2 ring-teal-500 shadow-lg" : ""
              } ${plan.recommended ? "border-amber-500 border-2" : plan.popular ? "border-teal-500" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge
                    className={`${
                      plan.free
                        ? "bg-green-500 hover:bg-green-600"
                        : plan.recommended
                          ? "bg-amber-500 hover:bg-amber-600"
                          : plan.popular
                            ? "bg-teal-500 hover:bg-teal-600"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="mb-2">
                  {plan.free ? (
                    <Gift className="h-8 w-8 text-green-500 mx-auto" />
                  ) : plan.recommended ? (
                    <Star className="h-8 w-8 text-amber-500 mx-auto" />
                  ) : (
                    <Crown className="h-8 w-8 text-teal-500 mx-auto" />
                  )}
                </div>
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <p className="text-sm text-gray-600 mb-3">{plan.description}</p>

                <div className="space-y-2">
                  {plan.discount > 0 && !plan.free && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm text-gray-500 line-through">฿{plan.originalPrice.toLocaleString()}</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        ประหยัด {plan.discount}%
                      </Badge>
                    </div>
                  )}
                  <div className="text-3xl font-bold text-teal-600">
                    {plan.free ? "ฟรี" : `฿${plan.price.toLocaleString()}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {plan.free
                      ? "30 วันแรก"
                      : `สำหรับ ${plan.duration > 30 ? Math.round(plan.duration / 30) : plan.duration} ${plan.duration > 30 ? "เดือน" : "วัน"}`}
                  </div>
                  {!plan.free && plan.duration > 30 && (
                    <div className="text-xs text-gray-400">
                      (฿{Math.round(plan.price / (plan.duration / 30))} ต่อเดือน)
                    </div>
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

        {/* Selected Package Summary */}
        {selectedPlan && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  แพ็คเก็จที่เลือก: {plans.find((p) => p.id === selectedPlan)?.name}
                </h3>
                <p className="text-gray-600">{plans.find((p) => p.id === selectedPlan)?.description}</p>
                {plans.find((p) => p.id === selectedPlan)?.free ? (
                  <p className="text-green-600 font-medium mt-1">เริ่มใช้งานได้ทันที - ฟรี 30 วัน</p>
                ) : (
                  <p className="text-gray-600">
                    ราคา ฿{plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}
                    {plans.find((p) => p.id === selectedPlan)?.discount > 0 && (
                      <span className="ml-2 text-green-600 font-medium">
                        (ประหยัด {plans.find((p) => p.id === selectedPlan)?.discount}%)
                      </span>
                    )}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-teal-600">
                  {plans.find((p) => p.id === selectedPlan)?.free
                    ? "ฟรี"
                    : `฿${plans.find((p) => p.id === selectedPlan)?.price.toLocaleString()}`}
                </div>
                {!plans.find((p) => p.id === selectedPlan)?.free && (
                  <div className="text-sm text-gray-500">รวมภาษี VAT 7%</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="text-center">
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700 px-8" onClick={handleSelectPackage}>
            {plans.find((p) => p.id === selectedPlan)?.free ? (
              <>
                <Gift className="h-5 w-5 mr-2" />
                เริ่มทดลองใช้งานฟรี
              </>
            ) : (
              <>
                <ArrowRight className="h-5 w-5 mr-2" />
                ดำเนินการชำระเงิน
              </>
            )}
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            {plans.find((p) => p.id === selectedPlan)?.free
              ? "ไม่ต้องใช้บัตรเครดิต - เริ่มใช้งานได้ทันที"
              : "ชำระเงินปลอดภัยผ่านระบบโอนเงิน"}
          </p>
        </div>
      </div>

      {/* Benefits Preview */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">สิ่งที่คุณจะได้รับ</h2>
          <p className="text-gray-600">ประโยชน์ที่คุณจะได้รับจากการเป็นสมาชิก Check Teepak</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <Verified className="h-12 w-12 text-teal-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">ตราสัญลักษณ์ยืนยัน</h3>
              <p className="text-gray-600">สร้างความน่าเชื่อถือให้กับลูกค้า</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">เพิ่มยอดขาย</h3>
              <p className="text-gray-600">ลูกค้ามั่นใจมากขึ้น เพิ่มโอกาสการจอง</p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <Share2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">ลิงก์แชร์โปรไฟล์</h3>
              <p className="text-gray-600">แชร์ความน่าเชื่อถือให้ลูกค้าตรวจสอบ</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
