"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Globe,
  CreditCard,
  Building,
  Calendar,
  MapPin,
} from "lucide-react"

interface MemberData {
  id: string
  name: string
  email: string
  phone: string
  type: "agent" | "owner" | "user"
  submitDate: string
  status: "pending" | "approved" | "rejected" | "incomplete"
  avatar: string
  location: string
  pendingItems: string[]
  contactInfo: {
    phones: { value: string; verified: boolean }[]
    emails: { value: string; verified: boolean }[]
    lineIds: { value: string; verified: boolean }[]
  }
  socialMedia: {
    facebook: string
    instagram: string
    lineOA: string
    website: string
  }
  businessInfo: {
    businessLicense: { status: string; url?: string }
    bankAccount: { status: string; bankName: string; accountNumber: string }
  }
}

export default function DocumentsPage() {
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")

  // Mock data
  const members: MemberData[] = [
    {
      id: "1",
      name: "คุณสมชาย ใจดี",
      email: "somchai@example.com",
      phone: "081-234-5678",
      type: "agent",
      submitDate: "2024-03-15",
      status: "pending",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "เชียงใหม่",
      pendingItems: ["ข้อมูลติดต่อ", "Social Media", "เอกสารทางกฎหมาย"],
      contactInfo: {
        phones: [
          { value: "081-234-5678", verified: true },
          { value: "082-345-6789", verified: false },
        ],
        emails: [{ value: "somchai@example.com", verified: true }],
        lineIds: [{ value: "somchai_agent", verified: false }],
      },
      socialMedia: {
        facebook: "https://facebook.com/somchai.agent",
        instagram: "https://instagram.com/somchai_agent",
        lineOA: "@somchai_agent",
        website: "https://somchai-agent.com",
      },
      businessInfo: {
        businessLicense: { status: "pending", url: "/placeholder.svg" },
        bankAccount: { status: "approved", bankName: "ธนาคารกสิกรไทย", accountNumber: "123-4-56789-0" },
      },
    },
    {
      id: "2",
      name: "คุณมาลี สวยงาม",
      email: "malee@example.com",
      phone: "082-345-6789",
      type: "owner",
      submitDate: "2024-03-14",
      status: "approved",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "ภูเก็ต",
      pendingItems: [],
      contactInfo: {
        phones: [{ value: "082-345-6789", verified: true }],
        emails: [{ value: "malee@example.com", verified: true }],
        lineIds: [{ value: "malee_owner", verified: true }],
      },
      socialMedia: {
        facebook: "https://facebook.com/malee.owner",
        instagram: "https://instagram.com/malee_owner",
        lineOA: "@malee_owner",
        website: "",
      },
      businessInfo: {
        businessLicense: { status: "approved", url: "/placeholder.svg" },
        bankAccount: { status: "approved", bankName: "ธนาคารกรุงเทพ", accountNumber: "456-7-89012-3" },
      },
    },
    {
      id: "3",
      name: "คุณวิชัย ท่องเที่ยว",
      email: "wichai@example.com",
      phone: "083-456-7890",
      type: "agent",
      submitDate: "2024-03-13",
      status: "rejected",
      avatar: "/placeholder.svg?height=40&width=40",
      location: "กรุงเทพฯ",
      pendingItems: ["ข้อมูลติดต่อ", "เอกสารทางกฎหมาย"],
      contactInfo: {
        phones: [{ value: "083-456-7890", verified: false }],
        emails: [{ value: "wichai@example.com", verified: true }],
        lineIds: [{ value: "wichai_agent", verified: false }],
      },
      socialMedia: {
        facebook: "",
        instagram: "",
        lineOA: "",
        website: "",
      },
      businessInfo: {
        businessLicense: { status: "rejected", url: "/placeholder.svg" },
        bankAccount: { status: "pending", bankName: "ธนาคารไทยพาณิชย์", accountNumber: "789-0-12345-6" },
      },
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            อนุมัติแล้ว
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            รอการตรวจสอบ
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            ไม่อนุมัติ
          </Badge>
        )
      case "incomplete":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            ข้อมูลไม่ครบ
          </Badge>
        )
      default:
        return null
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "agent":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            นายหน้า
          </Badge>
        )
      case "owner":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700">
            เจ้าของบ้าน
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700">
            ผู้ใช้ทั่วไป
          </Badge>
        )
      default:
        return null
    }
  }

  const handleViewDetails = (member: MemberData) => {
    setSelectedMember(member)
    setIsDetailDialogOpen(true)
  }

  const handleCallMember = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ตรวจสอบข้อมูลสมาชิก</h2>
          <p className="text-muted-foreground">ตรวจสอบและอนุมัติข้อมูลองค์ประกอบต่างๆ ของสมาชิกที่ส่งเข้ามา</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            ประวัติการตรวจสอบ
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            ส่งออกรายงาน
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอการตรวจสอบ</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+3 สมาชิกใหม่วันนี้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อนุมัติแล้ว</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12 สมาชิกในสัปดาห์นี้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ไม่อนุมัติ</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">-1 จากสัปดาห์ที่แล้ว</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ข้อมูลไม่ครบ</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">รอการส่งข้อมูลเพิ่มเติม</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Content */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList>
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="contact-info">ข้อมูลติดต่อ</TabsTrigger>
            <TabsTrigger value="social-media">Social Media</TabsTrigger>
            <TabsTrigger value="marketing">ช่องทางการตลาด</TabsTrigger>
            <TabsTrigger value="legal-docs">เอกสารทางกฎหมาย</TabsTrigger>
            <TabsTrigger value="payment">ช่องทางการชำระเงิน</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="ค้นหาสมาชิก..." className="w-full md:w-[200px] pl-8" />
            </div>
            <Select defaultValue="pending">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="pending">รอการตรวจสอบ</SelectItem>
                <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                <SelectItem value="rejected">ไม่อนุมัติ</SelectItem>
                <SelectItem value="incomplete">ข้อมูลไม่ครบ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>รายชื่อสมาชิกที่ส่งข้อมูลเข้ามา</CardTitle>
              <CardDescription>สมาชิกที่ส่งข้อมูลเพื่อขอการตรวจสอบและอนุมัติ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={member.avatar || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          {getTypeBadge(member.type)}
                          {getStatusBadge(member.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{member.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{member.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{member.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>ส่งเมื่อ: {member.submitDate}</span>
                          </div>
                          {member.pendingItems.length > 0 && (
                            <div className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              <span>รอตรวจสอบ: {member.pendingItems.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(member)}>
                        <Eye className="h-4 w-4 mr-1" />
                        ดูรายละเอียด
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCallMember(member.phone)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        โทร
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs content */}
        <TabsContent value="contact-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลติดต่อ</CardTitle>
              <CardDescription>เบอร์โทรศัพท์ อีเมล และ Line ID ของสมาชิก</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">แสดงเฉพาะสมาชิกที่มีข้อมูลติดต่อรอการตรวจสอบ</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social-media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Facebook, Instagram, Line OA และช่องทางโซเชียลมีเดียอื่นๆ</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">แสดงเฉพาะสมาชิกที่มี Social Media รอการตรวจสอบ</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ช่องทางการตลาด</CardTitle>
              <CardDescription>เว็บไซต์ และช่องทางการตลาดออนไลน์อื่นๆ</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">แสดงเฉพาะสมาชิกที่มีช่องทางการตลาดรอการตรวจสอบ</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal-docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>เอกสารทางกฎหมาย</CardTitle>
              <CardDescription>ใบอนุญาตประกอบธุรกิจ และเอกสารทางกฎหมายอื่นๆ</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">แสดงเฉพาะสมาชิกที่มีเอกสารทางกฎหมายรอการตรวจสอบ</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ช่องทางการชำระเงิน</CardTitle>
              <CardDescription>บัญชีธนาคาร และช่องทางการรับชำระเงินอื่นๆ</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">แสดงเฉพาะสมาชิกที่มีข้อมูลการชำระเงินรอการตรวจสอบ</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Member Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดข้อมูลสมาชิก</DialogTitle>
            <DialogDescription>ตรวจสอบและอนุมัติข้อมูลองค์ประกอบต่างๆ ของสมาชิก</DialogDescription>
          </DialogHeader>

          {selectedMember && (
            <div className="space-y-6">
              {/* Member Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={selectedMember.avatar || "/placeholder.svg"}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeBadge(selectedMember.type)}
                    {getStatusBadge(selectedMember.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span>{selectedMember.email}</span>
                    <span>{selectedMember.phone}</span>
                    <span>{selectedMember.location}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCallMember(selectedMember.phone)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    โทรติดต่อ
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="contact">ข้อมูลติดต่อ</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="marketing">การตลาด</TabsTrigger>
                  <TabsTrigger value="legal">เอกสารกฎหมาย</TabsTrigger>
                  <TabsTrigger value="payment">การชำระเงิน</TabsTrigger>
                </TabsList>

                <TabsContent value="contact" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">เบอร์โทรศัพท์</h4>
                      {selectedMember.contactInfo.phones.map((phone, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{phone.value}</span>
                          <div className="flex items-center gap-2">
                            {phone.verified ? (
                              <Badge className="bg-green-500">ยืนยันแล้ว</Badge>
                            ) : (
                              <Badge variant="outline">รอยืนยัน</Badge>
                            )}
                            <Button size="sm" variant="outline">
                              {phone.verified ? "อนุมัติ" : "ยืนยัน"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">อีเมล</h4>
                      {selectedMember.contactInfo.emails.map((email, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{email.value}</span>
                          <div className="flex items-center gap-2">
                            {email.verified ? (
                              <Badge className="bg-green-500">ยืนยันแล้ว</Badge>
                            ) : (
                              <Badge variant="outline">รอยืนยัน</Badge>
                            )}
                            <Button size="sm" variant="outline">
                              {email.verified ? "อนุมัติ" : "ยืนยัน"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Line ID</h4>
                      {selectedMember.contactInfo.lineIds.map((lineId, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <span>{lineId.value}</span>
                          <div className="flex items-center gap-2">
                            {lineId.verified ? (
                              <Badge className="bg-green-500">ยืนยันแล้ว</Badge>
                            ) : (
                              <Badge variant="outline">รอยืนยัน</Badge>
                            )}
                            <Button size="sm" variant="outline">
                              {lineId.verified ? "อนุมัติ" : "ยืนยัน"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="space-y-4">
                    {Object.entries(selectedMember.socialMedia).map(([platform, url]) => (
                      <div key={platform} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {platform === "facebook" && <Facebook className="h-4 w-4" />}
                          {platform === "instagram" && <Instagram className="h-4 w-4" />}
                          {platform === "lineOA" && <MessageCircle className="h-4 w-4" />}
                          {platform === "website" && <Globe className="h-4 w-4" />}
                          <span className="capitalize">{platform}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{url || "ไม่ได้ระบุ"}</span>
                          {url && (
                            <Button size="sm" variant="outline">
                              อนุมัติ
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="marketing" className="space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">ช่องทางการตลาดออนไลน์</h4>
                      <p className="text-sm text-gray-600">ข้อมูลช่องทางการตลาดของสมาชิกจะแสดงที่นี่</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="legal" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        <div>
                          <h4 className="font-medium">ใบอนุญาตประกอบธุรกิจ</h4>
                          <p className="text-sm text-gray-600">
                            สถานะ: {selectedMember.businessInfo.businessLicense.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedMember.businessInfo.businessLicense.url && (
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            ดูเอกสาร
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          อนุมัติ
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <div>
                          <h4 className="font-medium">บัญชีธนาคาร</h4>
                          <p className="text-sm text-gray-600">
                            {selectedMember.businessInfo.bankAccount.bankName} -{" "}
                            {selectedMember.businessInfo.bankAccount.accountNumber}
                          </p>
                          <p className="text-sm text-gray-600">
                            สถานะ: {selectedMember.businessInfo.bankAccount.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          อนุมัติ
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason">หมายเหตุ/เหตุผลการไม่อนุมัติ (ถ้ามี)</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="ระบุหมายเหตุหรือเหตุผลหากไม่อนุมัติ..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    อนุมัติทั้งหมด
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
                    <XCircle className="h-4 w-4 mr-2" />
                    ไม่อนุมัติ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCallMember(selectedMember.phone)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    โทรติดต่อสมาชิก
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
