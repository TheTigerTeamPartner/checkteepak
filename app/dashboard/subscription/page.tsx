"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, CreditCard, CheckCircle, AlertTriangle, Gift, TrendingUp, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function DashboardSubscriptionPage() {
  const [currentPlan] = useState({
    name: "แพ็คเก็จ 3 เดือน",
    price: 549,
    startDate: "2024-01-15",
    endDate: "2024-04-15",
    daysLeft: 45,
    totalDays: 90,
    status: "active",
    autoRenew: true,
  })

  const [usageStats] = useState({
    searches: 1247,
    searchLimit: 999999, // unlimited
    reports: 23,
    reportLimit: 999999,
    notifications: 156,
    notificationLimit: 999999,
  })

  const availableUpgrades = [
    {
      name: "แพ็คเก็จ 6 เดือน",
      price: 999,
      originalPrice: 1194,
      discount: 16,
      features: ["API สำหรับนักพัฒนา", "รายงานแนวโน้มตลาด", "การปรึกษาจากผู้เชี่ยวชาญ"],
    },
    {
      name: "แพ็คเก็จ 12 เดือน",
      price: 1799,
      originalPrice: 2388,
      discount: 25,
      features: ["การวิเคราะห์ขั้นสูง", "ข้อมูลเชิงลึกของตลาด", "การสนับสนุนแบบ VIP", "เข้าร่วมเวิร์กช็อปพิเศษ"],
    },
  ]

  const paymentHistory = [
    {
      date: "2024-01-15",
      amount: 549,
      plan: "แพ็คเก็จ 3 เดือน",
      status: "สำเร็จ",
      method: "บัตรเครดิต",
    },
    {
      date: "2023-10-15",
      amount: 199,
      plan: "แพ็คเก็จรายเดือน",
      status: "สำเร็จ",
      method: "Mobile Banking",
    },
    {
      date: "2023-09-15",
      amount: 199,
      plan: "แพ็คเก็จรายเดือน",
      status: "สำเร็จ",
      method: "Mobile Banking",
    },
  ]

  const progressPercentage = ((currentPlan.totalDays - currentPlan.daysLeft) / currentPlan.totalDays) * 100

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">การสมัครสมาชิก</h1>
          <p className="text-gray-500">จัดการแพ็คเก็จสมาชิกและการชำระเงินของคุณ</p>
        </div>
        <Link href="/select-package">
          <Button className="bg-teal-600 hover:bg-teal-700">
            <Crown className="h-4 w-4 mr-2" />
            อัปเกรดแพ็คเก็จ
          </Button>
        </Link>
      </div>

      {/* Current Plan Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-teal-200 bg-teal-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-teal-600" />
                แพ็คเก็จปัจจุบัน
              </CardTitle>
              <Badge className="bg-teal-500 hover:bg-teal-600">
                {currentPlan.status === "active" ? "ใช้งานอยู่" : "หมดอายุ"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-teal-800">{currentPlan.name}</h3>
                <p className="text-teal-600">฿{currentPlan.price.toLocaleString()} / 3 เดือน</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>ระยะเวลาการใช้งาน</span>
                  <span>{currentPlan.daysLeft} วันที่เหลือ</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{currentPlan.startDate}</span>
                  <span>{currentPlan.endDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">ต่ออายุอัตโนมัติ</span>
                </div>
                <Button variant="outline" size="sm">
                  จัดการ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              สถิติการใช้งาน
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-teal-600" />
                  <span className="text-sm">การค้นหา</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{usageStats.searches.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">ไม่จำกัด</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">รายงานปัญหา</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{usageStats.reports}</div>
                  <div className="text-xs text-gray-500">ไม่จำกัด</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">การแจ้งเตือน</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{usageStats.notifications}</div>
                  <div className="text-xs text-gray-500">ไม่จำกัด</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Upgrades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-600" />
            แพ็คเก็จที่แนะนำ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {availableUpgrades.map((upgrade, index) => (
              <Card key={index} className="border-purple-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{upgrade.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-purple-600">฿{upgrade.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 line-through">
                          ฿{upgrade.originalPrice.toLocaleString()}
                        </span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          ประหยัด {upgrade.discount}%
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      อัปเกรด
                    </Button>
                  </div>

                  <ul className="space-y-1">
                    {upgrade.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            ประวัติการชำระเงิน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentHistory.map((payment, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-100 rounded-full">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium">{payment.plan}</h4>
                    <p className="text-sm text-gray-500">
                      {payment.method} • {payment.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">฿{payment.amount.toLocaleString()}</div>
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">{payment.status}</Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Button variant="outline">ดูประวัติทั้งหมด</Button>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            ข้อมูลการเรียกเก็บเงิน
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium mb-2">ข้อมูลการชำระเงิน</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>วิธีการชำระเงิน:</span>
                  <span>บัตรเครดิต •••• 1234</span>
                </div>
                <div className="flex justify-between">
                  <span>วันที่ต่ออายุถัดไป:</span>
                  <span>{currentPlan.endDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>จำนวนเงิน:</span>
                  <span>฿{currentPlan.price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">ข้อมูลใบเสร็จ</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>ชื่อ:</span>
                  <span>คุณสมชาย ใจดี</span>
                </div>
                <div className="flex justify-between">
                  <span>อีเมล:</span>
                  <span>somchai@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span>ที่อยู่:</span>
                  <span>เชียงใหม่, ประเทศไทย</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm">
              แก้ไขข้อมูลการชำระเงิน
            </Button>
            <Button variant="outline" size="sm">
              แก้ไขข้อมูลใบเสร็จ
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">ยกเลิกการสมัครสมาชิก</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            หากคุณยกเลิกการสมัครสมาชิก คุณจะยังคงสามารถใช้งานฟีเจอร์พรีเมียมได้จนถึงวันที่ {currentPlan.endDate}
          </p>
          <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
            ยกเลิกการสมัครสมาชิก
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
