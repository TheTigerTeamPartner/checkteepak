"use client"

import { supabase } from "@/lib/supabase"
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

type ReportStatus = "pending" | "investigating" | "recorded" | "forwarded" | "closed"
interface Report {
  id: number ////
  title: string ////
  phone: string ////
  suspectInfo: string
  incidentLocation: string
  suspectContact: string
  report_type: ReportType ////
  description: string ////
  status: ReportStatus ////
  created_at: string ////
  updated_at: string ////
  accommodation_name: string ////
  incident_date: string ////
  bank_account: string ////
  bank_name: string ////
  account_holder: string ////
  reporter_name: string ////
  reporter_phone: string ////
  reporter_email: string ////
  facebook_profile: string ////
  instagram_profile: string ////
  line_id: string ////
  tiktok_profile: string ////
  website_url: string ////
  other_social_media: string ////
  evidence_urls?: string[] ////
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

  useEffect(() => {
    const fetchReports = async () => {
      const { data, error } = await supabase
        .from<Report>("reports")  // ชื่อตารางจริงในฐานข้อมูล
        .select("*")
        .order("created_at", { ascending: false })
  
      if (error) {
        console.error("Error fetching reports:", error)
        // แสดง toast หรือแจ้งเตือน error
        toast({
          title: "เกิดข้อผิดพลาดในการดึงข้อมูล",
          description: error.message,
          variant: "destructive",
        })
      } else if (data) {
        setReports(data)
      }
    }
  
    fetchReports()
  }, [])

  // Calculate total number of reports for statistics cards
  const totalReports = reports.length
  const pendingReports = reports.filter((report) => report.status === "pending").length
  const investigatingReports = reports.filter((report) => report.status === "investigating").length
  const recordedReports = reports.filter((report) => report.status === "recorded").length
  const forwardedReports = reports.filter((report) => report.status === "forwarded").length

  // Filter reports based on search term and status
  const filteredReports = reports.filter((report) => {
    const searchTermLower = searchTerm.toLowerCase();
    const suspectInfoLower = report.suspectInfo?.toLowerCase() ?? "";
    const incidentLocationLower = report.incidentLocation?.toLowerCase() ?? "";

    const searchCondition =
      suspectInfoLower.includes(searchTermLower) ||
      incidentLocationLower.includes(searchTermLower) ||
      report.suspectContact.includes(searchTermLower) ||
      report.description.toLowerCase().includes(searchTermLower)

    const statusCondition = statusFilter === "all" || report.status === statusFilter

    const typeCondition = typeFilter === "all" || report.report_type === typeFilter

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
      pending: "รับเรื่อง",
      investigating: "กำลังตรวจสอบ",
      recorded: "บันทึกข้อมูลแล้ว",
      forwarded: "ส่งต่อหน่วยงาน",
      closed: "ปิดเรื่อง",
    }
    return statusMap[status]
  }

  const getStatusBadge = (status: ReportStatus) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, icon: AlertTriangle },
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
     "fraud":"หลอกลวง/โกงเงิน",
      "fake":"ที่พักปลอม/ไม่มีจริง",
      "misleading":"ข้อมูลเท็จ/ทำให้เข้าใจผิด",
      "unsafe":"ไม่ปลอดภัย",
      "poor-service":"บริการไม่ดี",
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
            <div className="text-2xl font-bold">{pendingReports}</div>
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
                <SelectItem value="pending">รับเรื่อง</SelectItem>
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
                <SelectItem value="fraud">หลอกลวง/โกงเงิน</SelectItem>
                <SelectItem value="fake">ที่พักปลอม/ไม่มีจริง</SelectItem>
                <SelectItem value="misleading">ข้อมูลเท็จ/ทำให้เข้าใจผิด</SelectItem>
                <SelectItem value="unsafe">ไม่ปลอดภัย</SelectItem>
                <SelectItem value="poor-service">บริการแย่</SelectItem>
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
                <TableHead>ชื่อผู้ต้องสงสัย</TableHead>
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
                  <TableCell className="font-medium">{report.cheater_name}</TableCell>
                  <TableCell>{report.accommodation_name}</TableCell>
                  <TableCell>{report.phone}</TableCell>
                  <TableCell>{getTypeText(report.report_type)}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>{report.created_at}</TableCell>
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
                                  {report.accommodation_name|| "ไม่ระบุ"}
                                </p>
                              </div>
                              <div>
                                <Label>เบอร์โทรศัพท์ที่พัก</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.phone}</p>
                              </div>
                              <div>
                                <Label>ประเภทปัญหา</Label>
                                <p className="text-sm text-muted-foreground mt-1">{getTypeText(report.report_type)}</p>
                              </div>
                              <div>
                                <Label>วันที่เกิดเหตุ</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.incident_date || "ไม่ระบุ"}</p>
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
                                  {report.facebook_profile || "ไม่ระบุ"}
                                </p>
                              </div>
                              <div>
                                <Label>Instagram Profile/Page</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {report.instagram_profile || "ไม่ระบุ"}
                                </p>
                              </div>
                              <div>
                                <Label>Line ID</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.line_id || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>TikTok Profile</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.tiktok_profile || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>เว็บไซต์</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.website_url || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>Social Media อื่นๆ</Label>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {report.other_social_media || "ไม่ระบุ"}
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
                                <p className="text-sm text-muted-foreground mt-1">{report.bank_name || "ไม่ระบุ"}</p>
                              </div>
                              <div>
                                <Label>เลขบัญชี</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.bank_account || "ไม่ระบุ"}</p>
                              </div>
                              <div className="col-span-2">
                                <Label>ชื่อเจ้าของบัญชี</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.account_holder || "ไม่ระบุ"}</p>
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
                                  <p className="text-sm text-muted-foreground mt-1">{report.reporter_name || "ไม่ระบุ"}</p>
                                </div>
                                <div>
                                  <Label>เบอร์โทรศัพท์</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{report.reporter_phone || "ไม่ระบุ"}</p>
                                </div>
                                <div className="col-span-2">
                                  <Label>อีเมล</Label>
                                  <p className="text-sm text-muted-foreground mt-1">{report.reporter_email || "ไม่ระบุ"}</p>
                                </div>
                              </div>
                            </div>

                          {/* สถานะและการดำเนินการ */}
                          <div className="border rounded-lg p-4">
                            <h3 className="font-semibold text-lg mb-3">การดำเนินการ</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>วันที่รับเรื่อง</Label>
                                <p className="text-sm text-muted-foreground mt-1">{report.created_at}</p>
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