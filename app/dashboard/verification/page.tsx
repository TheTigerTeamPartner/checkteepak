"use client"

import type React from "react"

import { useState } from "react"
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  FileText,
  User,
  Home,
  CreditCard,
  Phone,
  Mail,
  Camera,
  Building,
  Shield,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// สถานะการยืนยัน
type VerificationStatus = "pending" | "submitted" | "verified" | "rejected"

// ข้อมูลการยืนยัน
interface VerificationItem {
  id: string
  title: string
  description: string
  status: VerificationStatus
  icon: React.ReactNode
  lastUpdated: string
  requiredFor: "basic" | "advanced" | "business"
  rejectionReason?: string
  helpText: string
}

export default function VerificationPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedItem, setSelectedItem] = useState<VerificationItem | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  // ข้อมูลการยืนยันทั้งหมด
  const verificationItems: VerificationItem[] = [
    {
      id: "personal_info",
      title: "ข้อมูลส่วนตัว",
      description: "ชื่อ-นามสกุล วันเกิด",
      status: "verified",
      icon: <User className="h-5 w-5" />,
      lastUpdated: "12 พ.ค. 2566",
      requiredFor: "basic",
      helpText: "ข้อมูลส่วนตัวจะถูกใช้เพื่อยืนยันตัวตนของคุณ",
    },
    {
      id: "id_card",
      title: "บัตรประชาชน/พาสปอร์ต",
      description: "เอกสารยืนยันตัวตน",
      status: "verified",
      icon: <FileText className="h-5 w-5" />,
      lastUpdated: "15 พ.ค. 2566",
      requiredFor: "basic",
      helpText: "อัพโหลดภาพถ่ายบัตรประชาชนหรือพาสปอร์ตที่ยังไม่หมดอายุ",
    },
    {
      id: "address",
      title: "ที่อยู่",
      description: "ที่อยู่ตามทะเบียนบ้าน",
      status: "verified",
      icon: <Home className="h-5 w-5" />,
      lastUpdated: "18 พ.ค. 2566",
      requiredFor: "basic",
      helpText: "ที่อยู่ต้องตรงกับเอกสารยืนยันตัวตนของคุณ",
    },
    {
      id: "bank_account",
      title: "บัญชีธนาคาร",
      description: "บัญชีสำหรับรับเงิน",
      status: "verified",
      icon: <CreditCard className="h-5 w-5" />,
      lastUpdated: "20 พ.ค. 2566",
      requiredFor: "basic",
      helpText: "บัญชีธนาคารต้องเป็นชื่อเดียวกับเอกสารยืนยันตัวตน",
    },
    {
      id: "phone",
      title: "เบอร์โทรศัพท์",
      description: "ยืนยันด้วย SMS OTP",
      status: "verified",
      icon: <Phone className="h-5 w-5" />,
      lastUpdated: "10 พ.ค. 2566",
      requiredFor: "basic",
      helpText: "เบอร์โทรศัพท์จะใช้สำหรับการติดต่อและยืนยันตัวตน",
    },
    {
      id: "email",
      title: "อีเมล",
      description: "ยืนยันด้วยลิงก์",
      status: "verified",
      icon: <Mail className="h-5 w-5" />,
      lastUpdated: "9 พ.ค. 2566",
      requiredFor: "basic",
      helpText: "อีเมลจะใช้สำหรับการติดต่อและแจ้งเตือนต่างๆ",
    },
    {
      id: "selfie",
      title: "รูปถ่ายยืนยันตัวตน",
      description: "รูปถ่ายพร้อมบัตรประชาชน",
      status: "submitted",
      icon: <Camera className="h-5 w-5" />,
      lastUpdated: "22 พ.ค. 2566",
      requiredFor: "advanced",
      helpText: "ถ่ายรูปตัวเองพร้อมถือบัตรประชาชนให้เห็นข้อมูลชัดเจน",
    },
    {
      id: "business_doc",
      title: "เอกสารธุรกิจ",
      description: "ใบจดทะเบียนพาณิชย์",
      status: "rejected",
      icon: <Building className="h-5 w-5" />,
      lastUpdated: "25 พ.ค. 2566",
      requiredFor: "business",
      rejectionReason: "เอกสารไม่ชัดเจน กรุณาอัพโหลดใหม่",
      helpText: "อัพโหลดเอกสารจดทะเบียนธุรกิจที่ออกโดยหน่วยงานราชการ",
    },
    {
      id: "video_verification",
      title: "วิดีโอยืนยันตัวตน",
      description: "วิดีโอสั้นๆ แสดงตัวตน",
      status: "pending",
      icon: <Camera className="h-5 w-5" />,
      lastUpdated: "-",
      requiredFor: "advanced",
      helpText: "บันทึกวิดีโอสั้นๆ พูดชื่อ-นามสกุล และวันที่ปัจจุบัน",
    },
  ]

  // คำนวณความคืบหน้าการยืนยัน
  const totalItems = verificationItems.length
  const verifiedItems = verificationItems.filter((item) => item.status === "verified").length
  const submittedItems = verificationItems.filter((item) => item.status === "submitted").length
  const verificationProgress = Math.round((verifiedItems / totalItems) * 100)

  // กรองรายการตามสถานะ
  const pendingItems = verificationItems.filter((item) => item.status === "pending")
  const submittedItemsList = verificationItems.filter((item) => item.status === "submitted")
  const verifiedItemsList = verificationItems.filter((item) => item.status === "verified")
  const rejectedItemsList = verificationItems.filter((item) => item.status === "rejected")

  // ฟังก์ชันแสดงสถานะ
  const renderStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-500 hover:bg-green-600">ยืนยันแล้ว</Badge>
      case "submitted":
        return <Badge className="bg-blue-500 hover:bg-blue-600">รอการตรวจสอบ</Badge>
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600">ไม่ผ่านการยืนยัน</Badge>
      default:
        return <Badge variant="outline">รอการส่งข้อมูล</Badge>
    }
  }

  // ฟังก์ชันแสดงไอคอนสถานะ
  const renderStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "submitted":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "rejected":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Upload className="h-5 w-5 text-gray-400" />
    }
  }

  // ฟังก์ชันเปิด dialog อัพโหลด
  const handleUpload = (item: VerificationItem) => {
    setSelectedItem(item)
    setUploadDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">สถานะการยืนยัน</h1>
        <p className="text-muted-foreground">ตรวจสอบสถานะการยืนยันข้อมูลต่างๆ ของคุณ</p>
      </div>

      {/* การ์ดแสดงความคืบหน้า */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>ความคืบหน้าการยืนยัน</CardTitle>
          <CardDescription>ยืนยันข้อมูลครบถ้วนเพื่อเพิ่มความน่าเชื่อถือให้กับบัญชีของคุณ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {verifiedItems} จาก {totalItems} รายการ
              </span>
              <span className="text-sm font-medium">{verificationProgress}%</span>
            </div>
            <Progress value={verificationProgress} className="h-2" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
                <span className="text-sm font-medium">{verifiedItems}</span>
                <span className="text-xs text-muted-foreground">ยืนยันแล้ว</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500 mb-1" />
                <span className="text-sm font-medium">{submittedItems}</span>
                <span className="text-xs text-muted-foreground">รอตรวจสอบ</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-500 mb-1" />
                <span className="text-sm font-medium">{rejectedItemsList.length}</span>
                <span className="text-xs text-muted-foreground">ไม่ผ่าน</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                <Upload className="h-6 w-6 text-gray-400 mb-1" />
                <span className="text-sm font-medium">{pendingItems.length}</span>
                <span className="text-xs text-muted-foreground">รอส่งข้อมูล</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mr-1" />
            <span>ข้อมูลของคุณได้รับการปกป้องตามนโยบายความเป็นส่วนตัว</span>
          </div>
        </CardFooter>
      </Card>

      {/* แท็บแสดงรายการยืนยัน */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 md:w-[600px]">
          <TabsTrigger value="overview">ทั้งหมด</TabsTrigger>
          <TabsTrigger value="pending">รอส่งข้อมูล ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="submitted">รอตรวจสอบ ({submittedItemsList.length})</TabsTrigger>
          <TabsTrigger value="verified">ยืนยันแล้ว ({verifiedItemsList.length})</TabsTrigger>
          <TabsTrigger value="rejected">ไม่ผ่าน ({rejectedItemsList.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>ข้อมูลสำคัญ</AlertTitle>
            <AlertDescription>
              การยืนยันข้อมูลพื้นฐานครบถ้วนจะช่วยเพิ่มความน่าเชื่อถือให้กับบัญชีของคุณ และเพิ่มโอกาสในการได้รับการติดต่อจากลูกค้า
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">การยืนยันพื้นฐาน</h3>
            <div className="grid gap-4">
              {verificationItems
                .filter((item) => item.requiredFor === "basic")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${item.status === "verified" ? "bg-green-500" : item.status === "submitted" ? "bg-blue-500" : item.status === "rejected" ? "bg-red-500" : "bg-gray-200"}`}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-full">{item.icon}</div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStatusBadge(item.status)}
                          {item.status !== "verified" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpload(item)}
                              disabled={item.status === "submitted"}
                            >
                              {item.status === "rejected" ? "ส่งใหม่" : "ส่งข้อมูล"}
                            </Button>
                          )}
                        </div>
                      </div>
                      {item.status === "rejected" && (
                        <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-md">
                          <p className="font-medium">เหตุผลที่ไม่ผ่าน:</p>
                          <p>{item.rejectionReason}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>

            <h3 className="text-lg font-medium mt-6">การยืนยันขั้นสูง</h3>
            <div className="grid gap-4">
              {verificationItems
                .filter((item) => item.requiredFor === "advanced")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${item.status === "verified" ? "bg-green-500" : item.status === "submitted" ? "bg-blue-500" : item.status === "rejected" ? "bg-red-500" : "bg-gray-200"}`}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-full">{item.icon}</div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStatusBadge(item.status)}
                          {item.status !== "verified" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpload(item)}
                              disabled={item.status === "submitted"}
                            >
                              {item.status === "rejected" ? "ส่งใหม่" : "ส่งข้อมูล"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <h3 className="text-lg font-medium mt-6">การยืนยันสำหรับธุรกิจ</h3>
            <div className="grid gap-4">
              {verificationItems
                .filter((item) => item.requiredFor === "business")
                .map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <div
                      className={`h-1 ${item.status === "verified" ? "bg-green-500" : item.status === "submitted" ? "bg-blue-500" : item.status === "rejected" ? "bg-red-500" : "bg-gray-200"}`}
                    />
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-100 p-2 rounded-full">{item.icon}</div>
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStatusBadge(item.status)}
                          {item.status !== "verified" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleUpload(item)}
                              disabled={item.status === "submitted"}
                            >
                              {item.status === "rejected" ? "ส่งใหม่" : "ส่งข้อมูล"}
                            </Button>
                          )}
                        </div>
                      </div>
                      {item.status === "rejected" && (
                        <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-md">
                          <p className="font-medium">เหตุผลที่ไม่ผ่าน:</p>
                          <p>{item.rejectionReason}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {pendingItems.length > 0 ? (
            <div className="grid gap-4">
              {pendingItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-100 p-2 rounded-full">{item.icon}</div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <Button onClick={() => handleUpload(item)}>ส่งข้อมูล</Button>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      <p>{item.helpText}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium">ไม่มีรายการที่รอส่งข้อมูล</h3>
              <p className="text-muted-foreground">คุณได้ส่งข้อมูลครบทุกรายการแล้ว</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4 mt-4">
          {submittedItemsList.length > 0 ? (
            <div className="grid gap-4">
              {submittedItemsList.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      {renderStatusBadge(item.status)}
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-blue-600">ส่งเมื่อ: {item.lastUpdated}</p>
                      <p className="text-muted-foreground mt-1">ทีมงานกำลังตรวจสอบข้อมูลของคุณ โดยปกติจะใช้เวลา 1-3 วันทำการ</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium">ไม่มีรายการที่รอการตรวจสอบ</h3>
              <p className="text-muted-foreground">ไม่มีรายการที่อยู่ระหว่างการตรวจสอบ</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verified" className="space-y-4 mt-4">
          {verifiedItemsList.length > 0 ? (
            <div className="grid gap-4">
              {verifiedItemsList.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      {renderStatusBadge(item.status)}
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-green-600">ยืนยันเมื่อ: {item.lastUpdated}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium">ยังไม่มีรายการที่ยืนยันแล้ว</h3>
              <p className="text-muted-foreground">กรุณาส่งข้อมูลเพื่อยืนยันตัวตน</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {rejectedItemsList.length > 0 ? (
            <div className="grid gap-4">
              {rejectedItemsList.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderStatusBadge(item.status)}
                        <Button variant="outline" size="sm" onClick={() => handleUpload(item)}>
                          ส่งใหม่
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-md">
                      <p className="font-medium">เหตุผลที่ไม่ผ่าน:</p>
                      <p>{item.rejectionReason}</p>
                    </div>
                    <div className="mt-3 text-sm">
                      <p className="text-red-600">ตรวจสอบเมื่อ: {item.lastUpdated}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium">ไม่มีรายการที่ไม่ผ่านการยืนยัน</h3>
              <p className="text-muted-foreground">ทุกรายการที่ส่งผ่านการตรวจสอบแล้ว</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog อัพโหลดเอกสาร */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>อัพโหลดข้อมูลยืนยัน: {selectedItem?.title}</DialogTitle>
            <DialogDescription>{selectedItem?.helpText}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium">อัพโหลดไฟล์</h3>
              <p className="text-sm text-muted-foreground mb-4">ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์</p>
              <Button>เลือกไฟล์</Button>
              <p className="text-xs text-muted-foreground mt-2">รองรับไฟล์ JPG, PNG หรือ PDF ขนาดไม่เกิน 5MB</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              ยกเลิก
            </Button>
            <Button onClick={() => setUploadDialogOpen(false)}>ส่งข้อมูล</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
