"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  MoreHorizontal,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  User,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Building,
  Eye,
  MessageSquare,
  UserCheck,
  XCircle,
  ShieldAlert,
  AlertOctagon,
  Flag,
  Loader2,
} from "lucide-react"

type ReportStatus = "pending" | "investigating" | "resolved" | "rejected"
type ReportType = "fraud" | "fake" | "misleading" | "unsafe" | "poor-service" | "other"
type ReportSeverity = "high" | "medium" | "low"

interface Report {
  id: string
  title: string
  description: string
  type: ReportType
  status: ReportStatus
  severity: ReportSeverity
  createdAt: string
  updatedAt: string
  reporterName: string
  reporterEmail: string
  reporterPhone: string
  accommodationName: string
  accommodationLocation: string
  accommodationPhone?: string
  accommodationOwner?: string
  assignedTo?: string
  evidence?: string[]
  notes?: string[]
  resolution?: string
}

export default function DashboardReportsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // Mock data
  const [reports] = useState<Report[]>([
    {
      id: "RPT-1001",
      title: "ที่พักหลอกลวง โอนเงินแล้วไม่มีที่พักจริง",
      description:
        "ผมได้จองที่พักผ่านเพจ Facebook ชื่อ 'บ้านสวนริมน้ำ' และโอนเงินมัดจำไปแล้ว 5,000 บาท แต่เมื่อไปถึงที่พักตามที่อยู่ที่ให้มา กลับพบว่าไม่มีที่พักตามที่โฆษณาไว้ และไม่สามารถติดต่อเจ้าของเพจได้อีก",
      type: "fraud",
      status: "investigating",
      severity: "high",
      createdAt: "2024-03-10T09:15:00",
      updatedAt: "2024-03-12T14:30:00",
      reporterName: "คุณสมชาย ใจดี",
      reporterEmail: "somchai@example.com",
      reporterPhone: "081-234-5678",
      accommodationName: "บ้านสวนริมน้ำ",
      accommodationLocation: "อำเภอสันทราย จังหวัดเชียงใหม่",
      accommodationPhone: "062-345-6789",
      assignedTo: "คุณนภา เจ้าหน้าที่",
      evidence: ["หลักฐานการโอนเงิน.jpg", "ข้อความการจอง.jpg", "หน้าเพจ Facebook.jpg"],
      notes: [
        "12/03/2024 - ติดต่อผู้รายงานเพื่อขอข้อมูลเพิ่มเติม",
        "13/03/2024 - ตรวจสอบเพจ Facebook พบว่าเป็นเพจปลอม สร้างเมื่อไม่นานมานี้",
      ],
    },
    {
      id: "RPT-1002",
      title: "ที่พักไม่ตรงตามรูปภาพที่โฆษณา",
      description: "ที่พักที่จองไม่ตรงตามรูปภาพที่โฆษณาไว้เลย สภาพทรุดโทรมกว่ามาก ห้องน้ำสกปรก และมีกลิ่นอับชื้น ไม่คุ้มค่ากับราคาที่จ่ายไป",
      type: "misleading",
      status: "pending",
      severity: "medium",
      createdAt: "2024-03-14T16:45:00",
      updatedAt: "2024-03-14T16:45:00",
      reporterName: "คุณมาลี สวยงาม",
      reporterEmail: "malee@example.com",
      reporterPhone: "082-345-6789",
      accommodationName: "ซีบรีซ โฮเทล",
      accommodationLocation: "พัทยา จังหวัดชลบุรี",
      accommodationPhone: "038-123-456",
      accommodationOwner: "คุณวิชัย เจ้าของ",
      evidence: ["รูปห้องพักจริง.jpg", "รูปห้องน้ำ.jpg"],
    },
    {
      id: "RPT-1003",
      title: "ที่พักไม่มีอยู่จริงตามที่อยู่",
      description: "จองที่พักผ่านเว็บไซต์ที่ดูน่าเชื่อถือ แต่เมื่อเดินทางไปตามที่อยู่ กลับพบว่าเป็นที่ดินว่างเปล่า ไม่มีที่พักตามที่โฆษณา",
      type: "fake",
      status: "resolved",
      severity: "high",
      createdAt: "2024-03-05T10:20:00",
      updatedAt: "2024-03-11T15:10:00",
      reporterName: "คุณวิชัย ท่องเที่ยว",
      reporterEmail: "wichai@example.com",
      reporterPhone: "083-456-7890",
      accommodationName: "มาวิน เมาน์เทน วิลล่า",
      accommodationLocation: "อำเภอเมือง จังหวัดเชียงราย",
      evidence: ["หลักฐานการจอง.pdf", "รูปถ่ายสถานที่จริง.jpg"],
      notes: [
        "06/03/2024 - ติดต่อผู้รายงานเพื่อขอข้อมูลเพิ่มเติม",
        "08/03/2024 - ตรวจสอบที่อยู่และพบว่าไม่มีที่พักตามที่โฆษณาจริง",
        "10/03/2024 - ตรวจสอบเว็บไซต์และพบว่าเป็นเว็บไซต์หลอกลวง",
      ],
      resolution: "ได้แจ้งความกับตำรวจและปิดเว็บไซต์หลอกลวงเรียบร้อยแล้ว พร้อมทั้งเพิ่มรายชื่อเข้าบัญชีดำ",
      assignedTo: "คุณสมศักดิ์ เจ้าหน้าที่",
    },
    {
      id: "RPT-1004",
      title: "เจ้าของที่พักเก็บค่าใช้จ่ายเพิ่มเติมโดยไม่แจ้งล่วงหน้า",
      description:
        "จองที่พักและชำระเงินครบถ้วนแล้ว แต่เมื่อเช็คเอาท์ เจ้าของที่พักเรียกเก็บค่าใช้จ่ายเพิ่มเติมหลายรายการที่ไม่ได้แจ้งไว้ล่วงหน้า เช่น ค่าทำความสะอาด ค่าน้ำ ค่าไฟ",
      type: "misleading",
      status: "investigating",
      severity: "medium",
      createdAt: "2024-03-12T14:30:00",
      updatedAt: "2024-03-13T09:45:00",
      reporterName: "คุณนภา พาเที่ยว",
      reporterEmail: "napa@example.com",
      reporterPhone: "084-567-8901",
      accommodationName: "ทรอปิคอล บีช รีสอร์ท",
      accommodationLocation: "เกาะสมุย จังหวัดสุราษฎร์ธานี",
      accommodationPhone: "077-123-456",
      accommodationOwner: "คุณสมศรี เจ้าของ",
      evidence: ["ใบเสร็จค่าใช้จ่ายเพิ่มเติม.jpg", "ข้อความการจองที่ไม่ได้ระบุค่าใช้จ่ายเพิ่มเติม.jpg"],
      assignedTo: "คุณวิภา เจ้าหน้าที่",
      notes: ["13/03/2024 - ติดต่อเจ้าของที่พักเพื่อขอคำชี้แจง"],
    },
    {
      id: "RPT-1005",
      title: "ที่พักไม่ปลอดภัย มีปัญหาระบบไฟฟ้า",
      description: "ที่พักมีปัญหาระบบไฟฟ้า มีไฟช็อตที่ปลั๊กไฟในห้องน้ำ และเมื่อแจ้งเจ้าของที่พัก ก็ไม่ได้รับการแก้ไขอย่างเร่งด่วน ทำให้รู้สึกไม่ปลอดภัย",
      type: "unsafe",
      status: "pending",
      severity: "high",
      createdAt: "2024-03-15T08:20:00",
      updatedAt: "2024-03-15T08:20:00",
      reporterName: "คุณสมศรี ดีใจ",
      reporterEmail: "somsri@example.com",
      reporterPhone: "085-678-9012",
      accommodationName: "สบาย รีสอร์ท",
      accommodationLocation: "หัวหิน จังหวัดประจวบคีรีขันธ์",
      accommodationPhone: "032-123-456",
      evidence: ["รูปปลั๊กไฟที่มีปัญหา.jpg"],
    },
    {
      id: "RPT-1006",
      title: "พนักงานที่พักไม่สุภาพ พูดจาไม่ดี",
      description: "พนักงานต้อนรับที่พักพูดจาไม่สุภาพ ไม่เต็มใจให้บริการ และเมื่อมีปัญหาเกี่ยวกับห้องพัก ก็ไม่ได้รับการแก้ไขอย่างเหมาะสม",
      type: "poor-service",
      status: "rejected",
      severity: "low",
      createdAt: "2024-03-08T18:15:00",
      updatedAt: "2024-03-09T10:30:00",
      reporterName: "คุณมานะ สุขสันต์",
      reporterEmail: "mana@example.com",
      reporterPhone: "086-789-0123",
      accommodationName: "ซิตี้ โฮเทล",
      accommodationLocation: "กรุงเทพมหานคร",
      accommodationOwner: "บริษัท ซิตี้ โฮเทล จำกัด",
      notes: ["09/03/2024 - ติดต่อผู้รายงานเพื่อขอข้อมูลเพิ่มเติม แต่ไม่ได้รับการตอบกลับ"],
      resolution: "ไม่มีหลักฐานเพียงพอ และไม่สามารถติดต่อผู้รายงานเพื่อขอข้อมูลเพิ่มเติมได้",
    },
    {
      id: "RPT-1007",
      title: "นายหน้าอสังหาริมทรัพย์หลอกลวง",
      description: "นายหน้าอ้างว่ามีที่พักให้เช่าในราคาถูก และขอเงินมัดจำล่วงหน้า แต่หลังจากโอนเงินไปแล้ว ก็หายตัวไป ไม่สามารถติดต่อได้อีก",
      type: "fraud",
      status: "investigating",
      severity: "high",
      createdAt: "2024-03-13T11:40:00",
      updatedAt: "2024-03-14T13:20:00",
      reporterName: "คุณวิภา สวัสดี",
      reporterEmail: "wipa@example.com",
      reporterPhone: "087-890-1234",
      accommodationName: "ไม่ระบุ (นายหน้าชื่อ นายสมหมาย)",
      accommodationLocation: "กรุงเทพมหานคร",
      accommodationPhone: "088-123-4567",
      evidence: ["หลักฐานการโอนเงิน.jpg", "ข้อความการติดต่อ.jpg"],
      assignedTo: "คุณนภา เจ้าหน้าที่",
      notes: ["14/03/2024 - ตรวจสอบข้อมูลนายหน้าและพบว่ามีประวัติการหลอกลวงมาก่อน"],
    },
  ])

  const getReportStats = () => {
    const total = reports.length
    const pending = reports.filter((r) => r.status === "pending").length
    const investigating = reports.filter((r) => r.status === "investigating").length
    const resolved = reports.filter((r) => r.status === "resolved").length
    const rejected = reports.filter((r) => r.status === "rejected").length
    const highSeverity = reports.filter((r) => r.severity === "high").length

    return { total, pending, investigating, resolved, rejected, highSeverity }
  }

  const stats = getReportStats()

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.accommodationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === "all" || report.type === selectedType
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    const matchesSeverity = selectedSeverity === "all" || report.severity === selectedSeverity

    return matchesSearch && matchesType && matchesStatus && matchesSeverity
  })

  const getReportTypeBadge = (type: ReportType) => {
    switch (type) {
      case "fraud":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <ShieldAlert className="h-3 w-3 mr-1" />
            หลอกลวง/โกงเงิน
          </Badge>
        )
      case "fake":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <AlertOctagon className="h-3 w-3 mr-1" />
            ที่พักปลอม
          </Badge>
        )
      case "misleading":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            ข้อมูลเท็จ
          </Badge>
        )
      case "unsafe":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            ไม่ปลอดภัย
          </Badge>
        )
      case "poor-service":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Flag className="h-3 w-3 mr-1" />
            บริการแย่
          </Badge>
        )
      case "other":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <Flag className="h-3 w-3 mr-1" />
            อื่นๆ
          </Badge>
        )
    }
  }

  const getReportStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            รอดำเนินการ
          </Badge>
        )
      case "investigating":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            กำลังตรวจสอบ
          </Badge>
        )
      case "resolved":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            เสร็จสิ้น
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <XCircle className="h-3 w-3 mr-1" />
            ปฏิเสธ
          </Badge>
        )
    }
  }

  const getReportSeverityBadge = (severity: ReportSeverity) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-500 hover:bg-red-600">ความเร่งด่วนสูง</Badge>
      case "medium":
        return <Badge className="bg-amber-500 hover:bg-amber-600">ความเร่งด่วนปานกลาง</Badge>
      case "low":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            ความเร่งด่วนต่ำ
          </Badge>
        )
    }
  }

  const handleReportAction = (action: string, report: Report) => {
    switch (action) {
      case "view":
        setSelectedReport(report)
        setIsReportDialogOpen(true)
        break
      case "assign":
        alert(`มอบหมายรายงาน ${report.id} ให้เจ้าหน้าที่`)
        break
      case "investigate":
        alert(`เริ่มการตรวจสอบรายงาน ${report.id}`)
        break
      case "resolve":
        alert(`ทำเครื่องหมายว่าเสร็จสิ้นรายงาน ${report.id}`)
        break
      case "reject":
        alert(`ปฏิเสธรายงาน ${report.id}`)
        break
      case "delete":
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบรายงาน ${report.id}?`)) {
          alert(`ลบรายงาน ${report.id}`)
        }
        break
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("th-TH", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">รายงานปัญหา</h1>
          <p className="text-gray-500">จัดการรายงานปัญหาที่พักและนายหน้าที่ถูกรายงานโดยผู้ใช้</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายงานทั้งหมด</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">รายงานในระบบ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอดำเนินการ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">รายงานที่รอดำเนินการ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กำลังตรวจสอบ</CardTitle>
            <Loader2 className="h-4 w-4 text-muted-foreground animate-spin" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.investigating}</div>
            <p className="text-xs text-muted-foreground">รายงานที่กำลังตรวจสอบ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เสร็จสิ้น</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">รายงานที่เสร็จสิ้น</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ปฏิเสธ</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">รายงานที่ถูกปฏิเสธ</p>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">ความเร่งด่วนสูง</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">{stats.highSeverity}</div>
            <p className="text-xs text-red-600">ต้องการการตรวจสอบด่วน</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>ค้นหาและกรองข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ค้นหาด้วย ID, หัวข้อ, ชื่อที่พัก, หรือชื่อผู้รายงาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    ประเภท: {selectedType === "all" ? "ทั้งหมด" : selectedType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedType("all")}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("fraud")}>หลอกลวง/โกงเงิน</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("fake")}>ที่พักปลอม</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("misleading")}>ข้อมูลเท็จ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("unsafe")}>ไม่ปลอดภัย</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("poor-service")}>บริการแย่</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("other")}>อื่นๆ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    สถานะ: {selectedStatus === "all" ? "ทั้งหมด" : selectedStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>รอดำเนินการ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("investigating")}>กำลังตรวจสอบ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("resolved")}>เสร็จสิ้น</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("rejected")}>ปฏิเสธ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    ความเร่งด่วน: {selectedSeverity === "all" ? "ทั้งหมด" : selectedSeverity}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedSeverity("all")}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedSeverity("high")}>สูง</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedSeverity("medium")}>ปานกลาง</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedSeverity("low")}>ต่ำ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>รายการรายงานปัญหา ({filteredReports.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full mt-1 ${
                      report.severity === "high"
                        ? "bg-red-100"
                        : report.severity === "medium"
                          ? "bg-amber-100"
                          : "bg-blue-100"
                    }`}
                  >
                    {report.type === "fraud" || report.type === "fake" ? (
                      <ShieldAlert
                        className={`h-5 w-5 ${
                          report.severity === "high"
                            ? "text-red-600"
                            : report.severity === "medium"
                              ? "text-amber-600"
                              : "text-blue-600"
                        }`}
                      />
                    ) : report.type === "misleading" || report.type === "unsafe" ? (
                      <AlertTriangle
                        className={`h-5 w-5 ${
                          report.severity === "high"
                            ? "text-red-600"
                            : report.severity === "medium"
                              ? "text-amber-600"
                              : "text-blue-600"
                        }`}
                      />
                    ) : (
                      <Flag
                        className={`h-5 w-5 ${
                          report.severity === "high"
                            ? "text-red-600"
                            : report.severity === "medium"
                              ? "text-amber-600"
                              : "text-blue-600"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{report.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {report.id}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {getReportTypeBadge(report.type)}
                      {getReportStatusBadge(report.status)}
                      {getReportSeverityBadge(report.severity)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Building className="h-3 w-3" />
                        <span>{report.accommodationName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{report.reporterName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(report.createdAt)}</span>
                      </div>
                      {report.assignedTo && (
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          <span>{report.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleReportAction("view", report)}>
                      <Eye className="h-4 w-4 mr-2" />
                      ดูรายละเอียด
                    </DropdownMenuItem>
                    {report.status === "pending" && (
                      <>
                        <DropdownMenuItem onClick={() => handleReportAction("assign", report)}>
                          <UserCheck className="h-4 w-4 mr-2" />
                          มอบหมาย
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportAction("investigate", report)}>
                          <Loader2 className="h-4 w-4 mr-2" />
                          เริ่มตรวจสอบ
                        </DropdownMenuItem>
                      </>
                    )}
                    {report.status === "investigating" && (
                      <>
                        <DropdownMenuItem onClick={() => handleReportAction("resolve", report)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          ทำเครื่องหมายว่าเสร็จสิ้น
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleReportAction("reject", report)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          ปฏิเสธรายงาน
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem onClick={() => handleReportAction("delete", report)} className="text-red-600">
                      <AlertOctagon className="h-4 w-4 mr-2" />
                      ลบรายงาน
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบรายงานปัญหา</h3>
              <p className="text-gray-500">ลองเปลี่ยนเงื่อนไขการค้นหาหรือกรองข้อมูล</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Detail Dialog */}
      <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดรายงานปัญหา</DialogTitle>
            <DialogDescription>ข้อมูลโดยละเอียดของรายงานปัญหา</DialogDescription>
          </DialogHeader>

          {selectedReport && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{selectedReport.title}</h2>
                  <Badge variant="outline" className="text-xs">
                    {selectedReport.id}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  {getReportTypeBadge(selectedReport.type)}
                  {getReportStatusBadge(selectedReport.status)}
                  {getReportSeverityBadge(selectedReport.severity)}
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">รายละเอียด</TabsTrigger>
                  <TabsTrigger value="reporter">ผู้รายงาน</TabsTrigger>
                  <TabsTrigger value="accommodation">ที่พัก</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">คำอธิบายปัญหา</Label>
                    <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 whitespace-pre-line">{selectedReport.description}</p>
                    </div>
                  </div>

                  {selectedReport.evidence && selectedReport.evidence.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">หลักฐาน</Label>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                        {selectedReport.evidence.map((evidence, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{evidence}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReport.notes && selectedReport.notes.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">บันทึกการตรวจสอบ</Label>
                      <div className="mt-2 space-y-2">
                        {selectedReport.notes.map((note, index) => (
                          <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm text-blue-700">{note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedReport.resolution && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">การแก้ไขปัญหา</Label>
                      <div className="mt-2 p-4 bg-green-50 rounded-lg border border-green-100">
                        <p className="text-green-700">{selectedReport.resolution}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">วันที่รายงาน</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(selectedReport.createdAt)}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">อัปเดตล่าสุด</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{formatDate(selectedReport.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedReport.assignedTo && (
                    <div>
                      <Label className="text-sm font-medium text-gray-500">มอบหมายให้</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-gray-400" />
                        <span>{selectedReport.assignedTo}</span>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Label className="text-sm font-medium text-gray-500">เพิ่มบันทึกการตรวจสอบ</Label>
                    <div className="mt-2">
                      <Textarea placeholder="เพิ่มบันทึกหรือความคืบหน้าในการตรวจสอบ..." className="min-h-[100px]" />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <Button size="sm">บันทึก</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="reporter" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">ชื่อผู้รายงาน</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{selectedReport.reporterName}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">อีเมล</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{selectedReport.reporterEmail}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedReport.reporterPhone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      ติดต่อผู้รายงาน
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="accommodation" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">ชื่อที่พัก</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Building className="h-4 w-4 text-gray-400" />
                        <span>{selectedReport.accommodationName}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">ที่อยู่</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{selectedReport.accommodationLocation}</span>
                      </div>
                    </div>
                    {selectedReport.accommodationPhone && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</Label>
                        <div className="mt-1 flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{selectedReport.accommodationPhone}</span>
                        </div>
                      </div>
                    )}
                    {selectedReport.accommodationOwner && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">เจ้าของที่พัก</Label>
                        <div className="mt-1 flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span>{selectedReport.accommodationOwner}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        ดูข้อมูลที่พัก
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                        <ShieldAlert className="h-4 w-4 mr-2" />
                        ทำเครื่องหมายเป็นที่พักอันตราย
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2 pt-4 border-t">
                {selectedReport.status === "pending" && (
                  <>
                    <Button onClick={() => handleReportAction("investigate", selectedReport)}>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      เริ่มตรวจสอบ
                    </Button>
                    <Button variant="outline" onClick={() => handleReportAction("assign", selectedReport)}>
                      <UserCheck className="h-4 w-4 mr-2" />
                      มอบหมาย
                    </Button>
                  </>
                )}
                {selectedReport.status === "investigating" && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleReportAction("resolve", selectedReport)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      ทำเครื่องหมายว่าเสร็จสิ้น
                    </Button>
                    <Button variant="outline" onClick={() => handleReportAction("reject", selectedReport)}>
                      <XCircle className="h-4 w-4 mr-2" />
                      ปฏิเสธรายงาน
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50 ml-auto"
                  onClick={() => handleReportAction("delete", selectedReport)}
                >
                  <AlertOctagon className="h-4 w-4 mr-2" />
                  ลบรายงาน
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
