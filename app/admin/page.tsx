"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  Building,
  TrendingUp,
  TrendingDown,
  Eye,
  Clock,
  Search,
  Filter,
  Bell,
  BarChart3,
  Shield,
  ClipboardCheck,
  Menu,
  Calendar,
  User,
  Phone,
  MapPin,
  CreditCard,
} from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export default function AdminDashboardPage() {
  const quickActions = [
    { icon: Users, label: "ผู้ใช้", href: "/admin/users", color: "bg-blue-50 text-blue-600" },
    { icon: ClipboardCheck, label: "เอกสาร", href: "/admin/documents", color: "bg-green-50 text-green-600" },
    { icon: FileText, label: "รายงาน", href: "/admin/reports", color: "bg-orange-50 text-orange-600" },
    { icon: Shield, label: "มิจฉาชีพ", href: "/admin/fraudsters", color: "bg-red-50 text-red-600" },
    { icon: BarChart3, label: "สถิติ", href: "/admin/statistics", color: "bg-purple-50 text-purple-600" },
    { icon: Bell, label: "แจ้งเตือน", href: "/admin/notifications", color: "bg-yellow-50 text-yellow-600" },
  ]

  const getReportDetails = (i: number) => {
    const isHighPriority = i % 3 === 0
    return {
      id: `RPT-${1000 + i}`,
      title: isHighPriority ? "รายงานโปรไฟล์หลอกลวง" : "รายงานข้อมูลไม่ตรงกับความจริง",
      description: isHighPriority
        ? "ผู้ใช้รายงานว่าถูกหลอกลวงให้โอนเงินมัดจำ แต่ไม่มีบุคคลจริง"
        : "ผู้ใช้รายงานว่าข้อมูลโปรไฟล์ไม่ตรงกับความจริง",
      priority: isHighPriority ? "ความเร่งด่วนสูง" : "ความเร่งด่วนปานกลาง",
      timeAgo: `${i} ชั่วโมงที่แล้ว`,
      reporter: {
        name: `คุณ${isHighPriority ? "สมชาย" : "สมหญิง"} ใจดี`,
        phone: `08${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        email: `user${i}@example.com`,
      },
      reported: {
        name: `${isHighPriority ? "นายหน้าปลอม" : "เจ้าของที่พัก"} ${i}`,
        phone: `09${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}-${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}-${Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0")}`,
        location: `${isHighPriority ? "กรุงเทพฯ" : "เชียงใหม่"}`,
      },
      incident: {
        date: `${25 + i}/12/2567`,
        amount: `${(Math.random() * 50000 + 10000).toLocaleString()} บาท`,
        method: isHighPriority ? "โอนเงินผ่านธนาคาร" : "เงินสด",
      },
    }
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mobile Header */}
      <div className="flex flex-col space-y-3 md:hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">แดชบอร์ดผู้ดูแลระบบ</h1>
            <p className="text-sm text-gray-500">ภาพรวมของระบบ Check Teepak</p>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>เมนูด่วน</SheetTitle>
                <SheetDescription>เข้าถึงฟังก์ชันต่างๆ ได้อย่างรวดเร็ว</SheetDescription>
              </SheetHeader>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {quickActions.map((action, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div
                        className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-2`}
                      >
                        <action.icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm font-medium">{action.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Search */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="ค้นหา..." className="pl-10" />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Header */}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+573 จากเดือนที่แล้ว</p>
            <div className="mt-3 md:hidden">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <Eye className="h-3 w-3 mr-1" />
                ดูรายละเอียด
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายงานปัญหา</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">237</div>
            <p className="text-xs text-muted-foreground">+42 รายงานใหม่ที่ยังไม่ได้ตรวจสอบ</p>
            <div className="mt-3 md:hidden">
              <Button variant="destructive" size="sm" className="w-full text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                ตรวจสอบด่วน
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">โปรไฟล์ที่ยืนยันแล้ว</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">5,783</div>
            <p className="text-xs text-muted-foreground">+89 จากเดือนที่แล้ว</p>
            <div className="mt-3 md:hidden">
              <Button variant="outline" size="sm" className="w-full text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                จัดการ
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">โปรไฟล์ที่ถูกรายงาน</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">432</div>
            <p className="text-xs text-muted-foreground">+18 จากเดือนที่แล้ว</p>
            <div className="mt-3 md:hidden">
              <Button variant="destructive" size="sm" className="w-full text-xs">
                <Shield className="h-3 w-3 mr-1" />
                ดำเนินการ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="reports" className="text-xs md:text-sm py-2">
            รายงานล่าสุด
          </TabsTrigger>
          <TabsTrigger value="verifications" className="text-xs md:text-sm py-2">
            คำขอยืนยันตัวตน
          </TabsTrigger>
          <TabsTrigger value="statistics" className="text-xs md:text-sm py-2">
            สถิติการใช้งาน
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle className="text-base md:text-lg">รายงานปัญหาล่าสุด</CardTitle>
                  <CardDescription className="text-sm">รายงานปัญหาที่ได้รับในช่วง 7 วันที่ผ่านมา</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => {
                  const reportDetails = getReportDetails(i)
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`p-2 rounded-full flex-shrink-0 ${i % 3 === 0 ? "bg-red-100" : "bg-amber-100"}`}
                        >
                          <AlertTriangle
                            className={`h-4 w-4 md:h-5 md:w-5 ${i % 3 === 0 ? "text-red-600" : "text-amber-600"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm md:text-base">{reportDetails.title}</h4>
                          <p className="text-xs md:text-sm text-gray-500 mt-1">{reportDetails.description}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              ID: {reportDetails.id}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs ${i % 3 === 0 ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                            >
                              {reportDetails.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between md:flex-col md:items-end gap-2">
                        <span className="text-xs md:text-sm text-gray-500">{reportDetails.timeAgo}</span>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                              ตรวจสอบ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <AlertTriangle
                                  className={`h-5 w-5 ${i % 3 === 0 ? "text-red-600" : "text-amber-600"}`}
                                />
                                รายละเอียดรายงาน {reportDetails.id}
                              </DialogTitle>
                              <DialogDescription>ข้อมูลรายละเอียดของรายงานปัญหาที่ได้รับ</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6">
                              {/* ข้อมูลรายงาน */}
                              <div>
                                <h3 className="font-semibold text-lg mb-3">ข้อมูลรายงาน</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">ประเภท:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.title}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <AlertTriangle className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">ระดับความเร่งด่วน:</span>
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`ml-6 ${i % 3 === 0 ? "bg-red-50 text-red-700 border-red-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                                    >
                                      {reportDetails.priority}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="mt-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FileText className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">รายละเอียด:</span>
                                  </div>
                                  <p className="text-sm text-gray-600 ml-6">{reportDetails.description}</p>
                                </div>
                              </div>

                              <Separator />

                              {/* ข้อมูลผู้แจ้ง */}
                              <div>
                                <h3 className="font-semibold text-lg mb-3">ข้อมูลผู้แจ้ง</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">ชื่อ:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.reporter.name}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">เบอร์โทร:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.reporter.phone}</p>
                                  </div>
                                  <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">อีเมล:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.reporter.email}</p>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              {/* ข้อมูลผู้ถูกรายงาน */}
                              <div>
                                <h3 className="font-semibold text-lg mb-3">ข้อมูลผู้ถูกรายงาน</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">ชื่อ:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.reported.name}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">เบอร์โทร:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.reported.phone}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">พื้นที่:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.reported.location}</p>
                                  </div>
                                </div>
                              </div>

                              <Separator />

                              {/* ข้อมูลเหตุการณ์ */}
                              <div>
                                <h3 className="font-semibold text-lg mb-3">ข้อมูลเหตุการณ์</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">วันที่เกิดเหตุ:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.incident.date}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">จำนวนเงิน:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.incident.amount}</p>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <CreditCard className="h-4 w-4 text-gray-500" />
                                      <span className="text-sm font-medium">วิธีการชำระ:</span>
                                    </div>
                                    <p className="text-sm text-gray-600 ml-6">{reportDetails.incident.method}</p>
                                  </div>
                                </div>
                              </div>

                              {/* ปุ่มดำเนินการ */}
                              <div className="flex gap-2 pt-4">
                                <Button className="flex-1" variant="default">
                                  อนุมัติรายงาน
                                </Button>
                                <Button className="flex-1" variant="destructive">
                                  ปฏิเสธรายงาน
                                </Button>
                                <Button variant="outline">ขอข้อมูลเพิ่มเติม</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
                <div>
                  <CardTitle className="text-base md:text-lg">คำขอยืนยันตัวตนล่าสุด</CardTitle>
                  <CardDescription className="text-sm">คำขอยืนยันตัวตนที่รอการตรวจสอบ</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  ดูทั้งหมด
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-full bg-blue-100 flex-shrink-0">
                        <Building className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-medium text-sm md:text-base">
                          {i % 2 === 0 ? "คำขอยืนยันตัวตนเจ้าของธุรกิจ" : "คำขอยืนยันตัวตนนายหน้า"}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                          {i % 2 === 0 ? "คุณสมหมาย ใจดี - ธุรกิจให้เช่าที่พัก" : "คุณมานี สวยงาม - นายหน้าอสังหาริมทรัพย์"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            ID: VRF-{2000 + i}
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            รอการตรวจสอบ
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-row items-center justify-between md:flex-col md:items-end gap-2">
                      <span className="text-xs md:text-sm text-gray-500">{i + 2} วันที่แล้ว</span>
                      <Button size="sm" variant="outline">
                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        ตรวจสอบ
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistics" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">สถิติการใช้งานรายวัน</CardTitle>
                <CardDescription className="text-sm">จำนวนผู้เข้าชมเว็บไซต์ในช่วง 7 วันที่ผ่านมา</CardDescription>
              </CardHeader>
              <CardContent className="h-[200px] md:h-[300px] flex items-center justify-center">
                <div className="text-center text-gray-500 text-sm">[กราฟแสดงสถิติการใช้งานรายวัน]</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base md:text-lg">การค้นหายอดนิยม</CardTitle>
                <CardDescription className="text-sm">คำค้นหาที่ได้รับความนิยมในช่วง 30 วันที่ผ่านมา</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["เลขบัญชีธนาคาร", "เบอร์โทรศัพท์", "ชื่อบุคคล", "ชื่อนายหน้า", "เลขบัตรประชาชน"].map((term, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-100 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-medium">{i + 1}</span>
                        </div>
                        <span className="text-sm md:text-base">{term}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-xs md:text-sm text-gray-500">{5000 - i * 800} ครั้ง</span>
                        <span
                          className={`text-xs flex items-center ${i < 2 ? "text-green-600" : i === 2 ? "text-gray-500" : "text-red-600"}`}
                        >
                          {i < 2 ? (
                            <>
                              <TrendingUp className="h-3 w-3 mr-1" />
                              {12 - i * 3}%
                            </>
                          ) : i === 2 ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              0%
                            </>
                          ) : (
                            <>
                              <TrendingDown className="h-3 w-3 mr-1" />
                              {(i - 2) * 4}%
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
