"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Eye,
  MessageSquare,
  ArrowUpRight,
  CheckCircle,
  AlertTriangle,
  Bell,
  Calendar,
  FileText,
  Clock,
  XCircle,
} from "lucide-react"
import { useState, useEffect } from "react"

export default function MemberDashboardPage() {
  const [trialInfo, setTrialInfo] = useState<{ daysLeft: number; isTrialUser: boolean } | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "rejected" | "not_submitted">(
    "not_submitted",
  )

  useEffect(() => {
    const packageType = localStorage.getItem("packageType")
    const trialStartDate = localStorage.getItem("trialStartDate")

    if (packageType === "trial" && trialStartDate) {
      const startDate = new Date(trialStartDate)
      const currentDate = new Date()
      const daysPassed = Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      const daysLeft = Math.max(0, 30 - daysPassed)

      setTrialInfo({
        daysLeft,
        isTrialUser: true,
      })
    }

    // จำลองสถานะการยืนยันตัวตน
    const storedVerificationStatus = localStorage.getItem("verificationStatus") as typeof verificationStatus
    if (storedVerificationStatus) {
      setVerificationStatus(storedVerificationStatus)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">แดชบอร์ดสมาชิก</h1>
          <p className="text-gray-500">ยินดีต้อนรับ, คุณสมชาย ใจดี! จัดการโปรไฟล์และสร้างความน่าเชื่อถือของคุณ</p>
        </div>
      </div>

      {/* Trial Warning */}
      {trialInfo?.isTrialUser && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-amber-900">คุณกำลังใช้งานแพ็คเก็จทดลองใช้</h3>
              <p className="text-sm text-amber-700">
                เหลือเวลาอีก <span className="font-bold">{trialInfo.daysLeft} วัน</span>
                {trialInfo.daysLeft <= 7 && " - เกือบหมดเวลาแล้ว!"}
              </p>
            </div>
            <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
              อัพเกรดแพ็คเก็จ
            </Button>
          </div>
        </div>
      )}

      {/* Verification Status Warning */}
      {verificationStatus === "not_submitted" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-blue-900">ยืนยันตัวตนเพื่อเพิ่มความน่าเชื่อถือ</h3>
              <p className="text-sm text-blue-700">โปรไฟล์ของคุณจะไม่ปรากฏในการค้นหาจนกว่าจะผ่านการยืนยันตัวตน</p>
            </div>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              ยืนยันตัวตนตอนนี้
            </Button>
          </div>
        </div>
      )}

      {verificationStatus === "pending" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-yellow-900">เอกสารยืนยันตัวตนอยู่ระหว่างการตรวจสอบ</h3>
              <p className="text-sm text-yellow-700">ทีมงานกำลังตรวจสอบเอกสารของคุณ โดยใช้เวลาประมาณ 1-3 วันทำการ</p>
            </div>
          </div>
        </div>
      )}

      {verificationStatus === "rejected" && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-red-900">เอกสารยืนยันตัวตนไม่ผ่านการตรวจสอบ</h3>
              <p className="text-sm text-red-700">กรุณาตรวจสอบเอกสารและส่งใหม่อีกครั้ง</p>
            </div>
            <Button size="sm" variant="destructive">
              ส่งเอกสารใหม่
            </Button>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สถานะการยืนยัน</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {verificationStatus === "verified"
                ? "✓"
                : verificationStatus === "pending"
                  ? "⏳"
                  : verificationStatus === "rejected"
                    ? "✗"
                    : "○"}
            </div>
            <p className="text-xs text-muted-foreground">
              {verificationStatus === "verified"
                ? "ยืนยันแล้ว"
                : verificationStatus === "pending"
                  ? "รอตรวจสอบ"
                  : verificationStatus === "rejected"
                    ? "ไม่ผ่าน"
                    : "ยังไม่ส่ง"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้เข้าชมโปรไฟล์</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verificationStatus === "verified" ? "1,283" : "0"}</div>
            <p className="text-xs text-muted-foreground">
              {verificationStatus === "verified" ? "+257 จากเดือนที่แล้ว" : "ยืนยันตัวตนก่อน"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ข้อความใหม่</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verificationStatus === "verified" ? "5" : "0"}</div>
            <p className="text-xs text-muted-foreground">
              {verificationStatus === "verified" ? "ข้อความที่ยังไม่ได้อ่าน" : "ยืนยันตัวตนก่อน"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">โปรไฟล์</TabsTrigger>
          <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลโปรไฟล์</CardTitle>
              <CardDescription>จัดการข้อมูลส่วนตัวและสร้างความน่าเชื่อถือ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                      <img
                        src="/placeholder.svg?height=64&width=64&text=Profile"
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">คุณสมชาย ใจดี</h4>
                      <p className="text-sm text-gray-500">สมาชิกตั้งแต่ มิถุนายน 2567</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          className={`text-xs ${
                            verificationStatus === "verified"
                              ? "bg-green-500 hover:bg-green-600"
                              : verificationStatus === "pending"
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : verificationStatus === "rejected"
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-gray-500 hover:bg-gray-600"
                          }`}
                        >
                          {verificationStatus === "verified" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              ยืนยันตัวตนแล้ว
                            </>
                          ) : verificationStatus === "pending" ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              รอตรวจสอบ
                            </>
                          ) : verificationStatus === "rejected" ? (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              ไม่ผ่านการตรวจสอบ
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              ยังไม่ยืนยันตัวตน
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Button size="sm" variant="outline">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      แก้ไขโปรไฟล์
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h5 className="font-medium">ข้อมูลติดต่อ</h5>
                    <p className="text-sm text-gray-600">อีเมล: somchai.jaidee@example.com</p>
                    <p className="text-sm text-gray-600">โทรศัพท์: 081-234-5678</p>
                    <p className="text-sm text-gray-600">ที่อยู่: เชียงใหม่, ประเทศไทย</p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-medium">สถิติการใช้งาน</h5>
                    <p className="text-sm text-gray-600">
                      การติดต่อทั้งหมด: {verificationStatus === "verified" ? "47 ครั้ง" : "0 ครั้ง"}
                    </p>
                    <p className="text-sm text-gray-600">
                      อัตราการตอบกลับ: {verificationStatus === "verified" ? "95%" : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      เวลาตอบกลับเฉลี่ย: {verificationStatus === "verified" ? "2 ชั่วโมง" : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>การแจ้งเตือน</CardTitle>
              <CardDescription>การแจ้งเตือนและข่าวสารสำคัญ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                    <div
                      className={`p-2 rounded-full ${
                        i % 4 === 0
                          ? "bg-blue-100"
                          : i % 4 === 1
                            ? "bg-amber-100"
                            : i % 4 === 2
                              ? "bg-green-100"
                              : "bg-purple-100"
                      }`}
                    >
                      {i % 4 === 0 ? (
                        <FileText className="h-5 w-5 text-blue-600" />
                      ) : i % 4 === 1 ? (
                        <Bell className="h-5 w-5 text-amber-600" />
                      ) : i % 4 === 2 ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">
                        {i % 4 === 0
                          ? "กรุณาส่งเอกสารยืนยันตัวตน"
                          : i % 4 === 1
                            ? "แพ็คเก็จทดลองใช้เหลือ 7 วัน"
                            : i % 4 === 2
                              ? "โปรไฟล์ของคุณได้รับการอนุมัติแล้ว"
                              : "มีผู้ใช้ส่งข้อความถึงคุณ"}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {i % 4 === 0
                          ? "เพื่อให้โปรไฟล์ของคุณปรากฏในการค้นหา กรุณาส่งเอกสารยืนยันตัวตนภายใน 7 วัน"
                          : i % 4 === 1
                            ? "แพ็คเก็จทดลองใช้ของคุณจะหมดอายุในอีก 7 วัน กรุณาอัพเกรดแพ็คเก็จ"
                            : i % 4 === 2
                              ? "ยินดีด้วย! โปรไฟล์ของคุณผ่านการตรวจสอบแล้ว ตอนนี้ปรากฏในการค้นหาแล้ว"
                              : "คุณมีข้อความใหม่จากผู้ใช้ที่สนใจติดต่อคุณ"}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">{i * 2} ชั่วโมงที่แล้ว</span>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4 mr-1" />
                          ดูรายละเอียด
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline">ดูการแจ้งเตือนทั้งหมด</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
