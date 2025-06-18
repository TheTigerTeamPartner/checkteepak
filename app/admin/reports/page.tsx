"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Users,
  Clock,
  FileCheck,
  Send,
  CheckCircle,
} from "lucide-react"

// Define types for Report and ReportStatus
type ReportType = "booking-fraud" | "fake-agent" | "fake-website" | "money-transfer-fraud" | "fake-payment" | "other"

type ReportStatus = "received" | "investigating" | "recorded" | "forwarded" | "closed"

interface Report {
  id: number
  suspectInfo: string
  incidentLocation: string
  suspectContact: string
  reportType: ReportType
  description: string
  status: ReportStatus
  createdAt: string
  // เพิ่มฟิลด์ใหม่จากฟอร์ม /report
  accommodationName?: string
  incidentDate?: string
  bankAccount?: string
  bankName?: string
  accountHolder?: string
  reporterName?: string
  reporterPhone?: string
  reporterEmail?: string
  facebookProfile?: string
  instagramProfile?: string
  lineId?: string
  tiktokProfile?: string
  websiteUrl?: string
  otherSocialMedia?: string
}

const AdminReportsPage = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [reportsPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "all">("all")
  const [typeFilter, setTypeFilter] = useState<ReportType | "all">("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const { toast } = useToast()

  // Mock data for reports
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: 1,
        suspectInfo: "นายสมชาย ใจดี",
        incidentLocation: "กรุงเทพมหานคร",
        suspectContact: "0812345678",
        reportType: "booking-fraud",
        description: "ถูกหลอกให้โอนเงินค่าจองที่พัก แต่ไม่ได้รับที่พักจริง มีการส่งหลักฐานการโอนเงินจำนวน 5,000 บาท และสกรีนช็อตการสนทนา",
        status: "received",
        createdAt: "2024-01-01",
        accommodationName: "รีสอร์ทสวยงาม",
        incidentDate: "2024-01-01",
        bankAccount: "1234567890",
        bankName: "ธนาคารกรุงเทพ",
        accountHolder: "นายสมชาย ใจดี",
        reporterName: "นางสาวสมใจ ดีใจ",
        reporterPhone: "0898765432",
        reporterEmail: "somjai@email.com",
        facebookProfile: "facebook.com/fake-resort",
        lineId: "@fake-resort",
      },
      {
        id: 2,
        suspectInfo: "นางสาวสมหญิง จริงใจ",
        incidentLocation: "เชียงใหม่",
        suspectContact: "0823456789",
        reportType: "fake-agent",
        description: "ถูกหลอกโดยอ้างว่าเป็นนายหน้าอสังหาริมทรัพย์ที่มีใบอนุญาต แต่เมื่อตรวจสอบแล้วไม่มีตัวตนจริง",
        status: "investigating",
        createdAt: "2024-01-05",
      },
      {
        id: 3,
        suspectInfo: "บริษัท มิจฉาชีพ จำกัด",
        incidentLocation: "ภูเก็ต",
        suspectContact: "0834567890",
        reportType: "fake-website",
        description: "เว็บไซต์ปลอมที่เลียนแบบเว็บไซต์จองที่พักชื่อดัง หลอกให้กรอกข้อมูลบัตรเครดิตและข้อมูลส่วนตัว",
        status: "recorded",
        createdAt: "2024-01-10",
      },
      {
        id: 4,
        suspectInfo: "นายมีชัย ให้โชค",
        incidentLocation: "ชลบุรี",
        suspectContact: "0845678901",
        reportType: "money-transfer-fraud",
        description: "ถูกหลอกให้โอนเงินโดยอ้างว่าจะให้ผลตอบแทนสูงจากการลงทุนที่พัก แต่หลังโอนเงินแล้วติดต่อไม่ได้",
        status: "forwarded",
        createdAt: "2024-01-15",
      },
      {
        id: 5,
        suspectInfo: "นางสาวใจดี มีสุข",
        incidentLocation: "ขอนแก่น",
        suspectContact: "0856789012",
        reportType: "fake-payment",
        description: "ถูกหลอกให้ชำระเงินผ่านช่องทางปลอม โดยส่งลิงก์ปลอมให้กรอกข้อมูลบัตรเครดิต",
        status: "closed",
        createdAt: "2024-01-20",
      },
      {
        id: 6,
        suspectInfo: "นายสมหวัง ตั้งใจ",
        incidentLocation: "สงขลา",
        suspectContact: "0867890123",
        reportType: "other",
        description: "การหลอกลวงรูปแบบอื่นๆ ที่เกี่ยวข้องกับการจองที่พักและอสังหาริมทรัพย์",
        status: "received",
        createdAt: "2024-01-25",
      },
      {
        id: 7,
        suspectInfo: "นางสาวสำเร็จ สมบูรณ์",
        incidentLocation: "นครราชสีมา",
        suspectContact: "0878901234",
        reportType: "booking-fraud",
        description: "ถูกหลอกให้โอนเงินค่าจองที่พักล่วงหน้า แต่เมื่อไปถึงไม่มีที่พักดังกล่าว",
        status: "investigating",
        createdAt: "2024-01-30",
      },
      {
        id: 8,
        suspectInfo: "บริษัท ซื่อสัตย์ จำกัด",
        incidentLocation: "ระยอง",
        suspectContact: "0889012345",
        reportType: "fake-agent",
        description: "ถูกหลอกโดยอ้างว่าเป็นนายหน้าที่มีประสบการณ์ แต่ไม่มีใบอนุญาตและไม่มีตัวตนจริง",
        status: "recorded",
        createdAt: "2024-02-01",
      },
    ]
    setReports(mockReports)
  }, [])

  // Calculate total number of reports for statistics cards
  const totalReports = reports.length
  const receivedReports = reports.filter((report) => report.status === "received").length
  const investigatingReports = reports.filter((report) => report.status === "investigating").length
  const recordedReports = reports.filter((report) => report.status === "recorded").length
  const forwardedReports = reports.filter((report) => report.status === "forwarded").length

  // Filter reports based on search term and status
  const filteredReports = reports.filter((report) => {
    const searchTermLower = searchTerm.toLowerCase()
    const suspectInfoLower = report.suspectInfo.toLowerCase()
    const incidentLocationLower = report.incidentLocation.toLowerCase()

    const searchCondition =
      suspectInfoLower.includes(searchTermLower) ||
      incidentLocationLower.includes(searchTermLower) ||
      report.suspectContact.includes(searchTermLower) ||
      report.description.toLowerCase().includes(searchTermLower)

    const statusCondition = statusFilter === "all" || report.status === statusFilter

    const typeCondition = typeFilter === "all" || report.reportType === typeFilter

    return searchCondition && statusCondition && typeCondition
  })

  // Calculate pagination
  const indexOfLastReport = currentPage * reportsPerPage
  const indexOfFirstReport = indexOfLastReport - reportsPerPage
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport)
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage)

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  const handleStatusUpdate = (reportId: number, newStatus: ReportStatus) => {
    setReports((prevReports) =>
      prevReports.map((report) => (report.id === reportId ? { ...report, status: newStatus } : report)),
    )
    toast({
      title: "อัพเดตสถานะสำเร็จ",
      description: `เรื่องร้องเรียน #${reportId} ได้รับการอัพเดตสถานะเป็น ${getStatusText(newStatus)}`,
    })
  }

  const getStatusText = (status: ReportStatus) => {
    const statusMap = {
      received: "รับเรื่อง",
      investigating: "กำลังตรวจสอบ",
      recorded: "บันทึกข้อมูลแล้ว",
      forwarded: "ส่งต่อหน่วยงาน",
      closed: "ปิดเรื่อง",
    }
    return statusMap[status]
  }

  const getStatusBadge = (status: ReportStatus) => {
    const statusConfig = {
      received: { variant: "secondary" as const, icon: AlertTriangle },
      investigating: { variant: "default" as const, icon: Clock },
      recorded: { variant: "outline" as const, icon: FileCheck },
      forwarded: { variant: "destructive" as const, icon: Send },
      closed: { variant: "default" as const, icon: CheckCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {getStatusText(status)}
      </Badge>
    )
  }

  const getTypeText = (type: ReportType) => {
    const typeMap = {
      "booking-fraud": "หลอกลวงการจองที่พัก",
      "fake-agent": "นายหน้าปลอม",
      "fake-website": "เว็บไซต์หลอกลวง",
      "money-transfer-fraud": "การโอนเงินหลอกลวง",
      "fake-payment": "การชำระเงินปลอม",
      other: "อื่นๆ",
    }
    return typeMap[type]
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">รับเรื่องร้องเรียน</h1>
        <p className="text-muted-foreground">รับและจัดการเรื่องร้องเรียนการถูกโกงจากมิจฉาชีพ เพื่อเก็บข้อมูลและบันทึกเข้าสู่ระบบ</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เรื่องร้องเรียนทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รับเรื่องแล้ว</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receivedReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังตรวจสอบ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{investigatingReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">บันทึกข้อมูลแล้ว</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recordedReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ส่งต่อหน่วยงาน</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forwardedReports}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="ค้นหาจากข้อมูลผู้ต้องสงสัย, สถานที่เกิดเหตุ, ช่องทางติดต่อ, หรือรายละเอียด"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ReportStatus | "all")}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="สถานะทั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">สถานะทั้งหมด</SelectItem>
                <SelectItem value="received">รับเรื่อง</SelectItem>
                <SelectItem value="investigating">กำลังตรวจสอบ</SelectItem>
                <SelectItem value="recorded">บันทึกข้อมูลแล้ว</SelectItem>
                <SelectItem value="forwarded">ส่งต่อหน่วยงาน</SelectItem>
                <SelectItem value="closed">ปิดเรื่อง</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as ReportType | "all")}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="ประเภททั้งหมด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ประเภททั้งหมด</SelectItem>
                <SelectItem value="booking-fraud">หลอกลวงการจองที่พัก</SelectItem>
                <SelectItem value="fake-agent">นายหน้าปลอม</SelectItem>
                <SelectItem value="fake-website">เว็บไซต์หลอกลวง</SelectItem>
                <SelectItem value="money-transfer-fraud">การโอนเงินหลอกลวง</SelectItem>
                <SelectItem value="fake-payment">การชำระเงินปลอม</SelectItem>
                <SelectItem value="other">อื่นๆ</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setTypeFilter("all")
                }}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายการเรื่องร้องเรียน</CardTitle>
          <CardDescription>แสดงรายการเรื่องร้องเรียนทั้งหมด {filteredReports.length} รายการ</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ข้อมูลผู้ต้องสงสัย</TableHead>
                <TableHead>สถานที่เกิดเหตุ</TableHead>
                <TableHead>ช่องทางติดต่อ</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>วันที่รับเรื่อง</TableHead>
                <TableHead>การดำเนินการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.suspectInfo}</TableCell>
                  <TableCell>{report.incidentLocation}</TableCell>
                  <TableCell>{report.suspectContact}</TableCell>
                  <TableCell>{getTypeText(report.reportType)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.createdAt}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedReport(report)}>
                          ดูรายละเอียด
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>รายละเอียดเรื่องร้องเรียน #{report.id}</DialogTitle>
                          <DialogDescription>ข้อมูลเรื่องร้องเรียนและการดำเนินการ</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* ข้อมูลที่พัก */}
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">ข้อมูลที่พัก</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>ชื่อที่พัก</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {report.accommodationName || "ไม่ระบุ"}
                                </p>
                              </div>
                              <div>
                                <Label>เบอร์โทรศัพท์ที่พัก</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.suspectContact}</p>
                              </div>
                              <div>
                                <Label>ประเภทปัญหา</Label>
                                <p className="text-sm text-muted-foreground mt-1">{getTypeText(report.reportType)}</p>
                              </div>
                              <div>
                                <Label>วันที่เกิดเหตุ</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.incidentDate || "ไม่ระบุ"}</p>
                              </div>
                            </div>
                          </div>

                          {/* ข้อมูล Social Media */}
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">ข้อมูล Social Media</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Facebook Profile/Page</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {report.facebookProfile || "ไม่ระบุ"}
                                </p>
                              </div>
                              <div>
                                <Label>Instagram Profile</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {report.instagramProfile || "ไม่ระบุ"}
                                </p>
                              </div>
                              <div>
                                <Label>Line ID</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.lineId || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>TikTok Profile</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.tiktokProfile || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>เว็บไซต์</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.websiteUrl || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>Social Media อื่นๆ</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {report.otherSocialMedia || "ไม่ระบุ"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* ข้อมูลการชำระเงิน */}
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">ข้อมูลการชำระเงิน</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>ธนาคาร</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.bankName || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>เลขบัญชี</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.bankAccount || "ไม่ระบุ"}</p>
                              </div>
                              <div className="col-span-2">
                                <Label>ชื่อเจ้าของบัญชี</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.accountHolder || "ไม่ระบุ"}</p>
                              </div>
                            </div>
                          </div>

                          {/* รายละเอียดเหตุการณ์ */}
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">รายละเอียดเหตุการณ์</h3>
                            <div>
                              <Label>รายละเอียดเหตุการณ์</Label>
                              <Textarea value={report.description} readOnly className="mt-1 min-h-[100px]" />
                            </div>
                          </div>

                          {/* ข้อมูลผู้แจ้ง */}
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">ข้อมูลผู้แจ้ง</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>ชื่อ-นามสกุล</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.reporterName || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>เบอร์โทรศัพท์</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.reporterPhone || "ไม่ระบุ"}</p>
                              </div>
                              <div className="col-span-2">
                                <Label>อีเมล</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.reporterEmail || "ไม่ระบุ"}</p>
                              </div>
                            </div>
                          </div>

                          {/* สถานะและการดำเนินการ */}
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">การดำเนินการ</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>วันที่รับเรื่อง</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.createdAt}</p>
                              </div>
                              <div>
                                <Label>สถานะ</Label>
                                <Select
                                  value={report.status}
                                  onValueChange={(value) => handleStatusUpdate(report.id, value as ReportStatus)}
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="received">รับเรื่อง</SelectItem>
                                    <SelectItem value="investigating">กำลังตรวจสอบ</SelectItem>
                                    <SelectItem value="recorded">บันทึกข้อมูลแล้ว</SelectItem>
                                    <SelectItem value="forwarded">ส่งต่อหน่วยงาน</SelectItem>
                                    <SelectItem value="closed">ปิดเรื่อง</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          แสดง {indexOfFirstReport + 1} ถึง {Math.min(indexOfLastReport, filteredReports.length)} จาก{" "}
          {filteredReports.length} รายการ
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
            <ChevronLeft className="h-4 w-4" />
            ย้อนกลับ
          </Button>

          <div className="text-sm">
            หน้า {currentPage} จาก {totalPages}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ถัดไป
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminReportsPage
