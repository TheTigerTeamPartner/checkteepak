"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Eye, CreditCard, Phone, MessageSquare, ExternalLink, BarChart3 } from "lucide-react"
import Link from "next/link"

interface FraudTactic {
  id: string
  title: string
  description: string
  warning: string
  prevention: string[]
  severity: "high" | "medium" | "low"
  icon: React.ReactNode
  examples: string[]
}

export function FraudAwareness() {
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null)

  const fraudTactics: FraudTactic[] = [
    {
      id: "fake-listing",
      title: "ที่พักปลอม",
      description: "มิจฉาชีพสร้างประกาศที่พักปลอมด้วยรูปภาพสวยงามที่ขโมยมาจากที่อื่น",
      warning: "ระวัง! ที่พักที่ดูดีเกินจริงในราคาถูกผิดปกติ",
      prevention: [
        "ตรวจสอบรูปภาพด้วย Google Image Search",
        "ขอดูเอกสารกรรมสิทธิ์ที่พัก",
        "ติดต่อไปดูที่พักจริงก่อนโอนเงิน",
        "ตรวจสอบใน Google Maps ว่ามีที่พักจริง",
      ],
      severity: "high",
      icon: <Shield className="h-6 w-6" />,
      examples: ["วิลล่าหรูริมทะเลราคา 500 บาท/คืน", "คอนโดใหม่ใจกลางเมืองราคาถูกผิดปกติ"],
    },
    {
      id: "advance-payment",
      title: "เรียกเงินล่วงหน้าทั้งหมด",
      description: "ขอเงินมัดจำหรือค่าที่พักทั้งหมดล่วงหน้าก่อนเข้าพัก",
      warning: "ระวัง! การขอเงินทั้งหมดล่วงหน้าโดยไม่มีหลักประกัน",
      prevention: [
        "จ่ายเงินมัดจำเพียงส่วนเล็กน้อย",
        "ขอใบเสร็จและสัญญาเช่าที่ชัดเจน",
        "ใช้บริการโอนเงินที่มีการคุ้มครอง",
        "ตรวจสอบเลขบัญชีกับชื่อเจ้าของที่พัก",
      ],
      severity: "high",
      icon: <CreditCard className="h-6 w-6" />,
      examples: ["ขอเงินค่าที่พัก 1 เดือนล่วงหน้า", "อ้างว่าต้องจ่ายเต็มจำนวนเพื่อจองคิว"],
    },
    {
      id: "fake-contact",
      title: "ข้อมูลติดต่อปลอม",
      description: "ใช้เบอร์โทรศัพท์และข้อมูลติดต่อที่ไม่ใช่ของจริง",
      warning: "ระวัง! เบอร์โทรที่ไม่รับสาย หรือปิดเครื่องบ่อย",
      prevention: [
        "โทรทดสอบเบอร์หลายครั้งในเวลาต่างกัน",
        "ขอพบหน้าก่อนโอนเงิน",
        "ตรวจสอบข้อมูลในทะเบียนบ้าน",
        "ขอดูบัตรประชาชนของเจ้าของ",
      ],
      severity: "medium",
      icon: <Phone className="h-6 w-6" />,
      examples: ["เบอร์โทรที่ใช้แอพ VoIP", "ไม่ยอมให้โทรวิดีโอคอล"],
    },
    {
      id: "urgent-pressure",
      title: "สร้างความเร่งด่วน",
      description: "อ้างว่ามีคนจองแล้ว หรือโปรโมชั่นหมดเร็ว เพื่อให้ตัดสินใจเร็ว",
      warning: "ระวัง! การกดดันให้ตัดสินใจโอนเงินทันที",
      prevention: ["ใช้เวลาคิดและตรวจสอบข้อมูล", "ปรึกษาคนใกล้ชิดก่อนตัดสินใจ", "ไม่หลงกลเทคนิคการขาย", "ขอเวลาอย่างน้อย 24 ชั่วโมง"],
      severity: "medium",
      icon: <AlertTriangle className="h-6 w-6" />,
      examples: ["มีคนจองแล้ว ต้องโอนเงินวันนี้", "ราคาพิเศษเหลือวันเดียว"],
    },
    {
      id: "social-media-scam",
      title: "หลอกผ่านโซเชียลมีเดีย",
      description: "ใช้เพจปลอมหรือโปรไฟล์ปลอมในโซเชียลมีเดียเพื่อหลอกลวง",
      warning: "ระวัง! เพจที่สร้างใหม่ หรือมีผู้ติดตามน้อย",
      prevention: [
        "ตรวจสอบอายุของเพจ/โปรไฟล์",
        "ดูรีวิวและความคิดเห็นจากลูกค้าจริง",
        "ตรวจสอบว่ามีที่อยู่จริงหรือไม่",
        "ระวังเพจที่ไม่มีข้อมูลติดต่อชัดเจน",
      ],
      severity: "medium",
      icon: <MessageSquare className="h-6 w-6" />,
      examples: ["เพจ Facebook ที่สร้างใหม่", "Instagram ที่มีรูปน้อยและผู้ติดตามน้อย"],
    },
    {
      id: "document-forgery",
      title: "เอกสารปลอม",
      description: "ใช้เอกสารปลอมหรือแก้ไขเอกสารจริงเพื่อสร้างความน่าเชื่อถือ",
      warning: "ระวัง! เอกสารที่ดูไม่ชัดเจนหรือมีรอยแก้ไข",
      prevention: ["ขอดูเอกสารต้นฉบับ", "ตรวจสอบกับหน่วยงานที่ออกเอกสาร", "ใช้แอพตรวจสอบความถูกต้อง", "ขอเอกสารหลายชนิดเพื่อยืนยัน"],
      severity: "high",
      icon: <Eye className="h-6 w-6" />,
      examples: ["ใบอนุญาตประกอบธุรกิจปลอม", "โฉนดที่ดินที่แก้ไข"],
    },
  ]

  const getSeverityBadge = (severity: "high" | "medium" | "low") => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">ความเสี่ยงสูง</Badge>
      case "medium":
        return <Badge className="bg-amber-500 hover:bg-amber-600">ความเสี่ยงปานกลาง</Badge>
      case "low":
        return <Badge className="bg-green-500 hover:bg-green-600">ความเสี่ยงต่ำ</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <AlertTriangle className="h-8 w-8 text-red-600 mt-1 mr-4" />
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-2">คำเตือนสำคัญ</h3>
            <p className="text-red-700 mb-4">
              มิจฉาชีพมีวิธีการหลอกลวงที่หลากหลายและซับซ้อนขึ้นเรื่อยๆ การรู้ทันกลโกงเหล่านี้จะช่วยปกป้องคุณจากการสูญเสียเงินและเวลา
            </p>
            <div className="flex flex-wrap gap-2">
              <Button size="sm" className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/report">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  แจ้งเหตุโกง
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fraud Tactics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fraudTactics.map((tactic) => (
          <Card
            key={tactic.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTactic === tactic.id ? "ring-2 ring-red-500 shadow-lg" : ""
            }`}
            onClick={() => setSelectedTactic(selectedTactic === tactic.id ? null : tactic.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg text-red-600">{tactic.icon}</div>
                  <div>
                    <CardTitle className="text-lg">{tactic.title}</CardTitle>
                  </div>
                </div>
                {getSeverityBadge(tactic.severity)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-3">{tactic.description}</p>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-3">
                <p className="text-amber-800 text-sm font-medium">{tactic.warning}</p>
              </div>

              {selectedTactic === tactic.id && (
                <div className="space-y-4 mt-4 pt-4 border-t">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">วิธีป้องกัน:</h4>
                    <ul className="space-y-1">
                      {tactic.prevention.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">ตัวอย่างที่พบบ่อย:</h4>
                    <ul className="space-y-1">
                      {tactic.examples.map((example, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <span className="text-red-500 mr-2">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      
    </div>
  )
}
