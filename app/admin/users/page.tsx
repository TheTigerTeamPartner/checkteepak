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
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Briefcase,
  Package,
  CreditCard,
  Send,
} from "lucide-react"

type UserType = "agent" | "owner" | "user"
type VerificationStatus = "pending" | "approved" | "rejected" | "incomplete"

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  type: UserType
  verificationStatus: VerificationStatus
  joinDate: string
  lastActive: string
  location: string
  avatar: string
  documents: {
    idCard: { status: VerificationStatus; url?: string; uploadDate: string }
    selfie: { status: VerificationStatus; url?: string; uploadDate: string }
    businessLicense?: { status: VerificationStatus; url?: string; uploadDate: string }
    bankAccount: { status: VerificationStatus; url?: string; uploadDate: string }
  }
  rejectionReason?: string
  propertiesCount?: number
  rating?: number
  reviewCount?: number
  paymentStatus: "pending" | "completed" | "failed" | "none"
  paymentDate?: string
  paymentAmount?: number
  packageName?: string
  packageDuration?: string
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("all")

  // Mock data
  const [users] = useState<UserData[]>([
    {
      id: "1",
      name: "คุณสมชาย ใจดี",
      email: "somchai@example.com",
      phone: "081-234-5678",
      type: "agent",
      verificationStatus: "pending",
      joinDate: "2024-03-10",
      lastActive: "2024-03-15",
      location: "เชียงใหม่",
      avatar: "/placeholder.svg?height=40&width=40",
      documents: {
        idCard: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-03-10" },
        selfie: { status: "pending", url: "/placeholder.svg", uploadDate: "2024-03-12" },
        businessLicense: { status: "pending", url: "/placeholder.svg", uploadDate: "2024-03-12" },
        bankAccount: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-03-11" },
      },
      propertiesCount: 0,
      rating: 0,
      reviewCount: 0,
      paymentStatus: "pending",
      paymentAmount: 1500,
      packageName: "แพ็คเกจมาตรฐาน",
      packageDuration: "1 เดือน",
    },
    {
      id: "2",
      name: "คุณมาลี สวยงาม",
      email: "malee@example.com",
      phone: "082-345-6789",
      type: "owner",
      verificationStatus: "approved",
      joinDate: "2024-02-15",
      lastActive: "2024-03-14",
      location: "ภูเก็ต",
      avatar: "/placeholder.svg?height=40&width=40",
      documents: {
        idCard: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-02-15" },
        selfie: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-02-16" },
        bankAccount: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-02-16" },
      },
      propertiesCount: 3,
      rating: 4.8,
      reviewCount: 24,
      paymentStatus: "completed",
      paymentDate: "2024-02-16",
      paymentAmount: 3500,
      packageName: "แพ็คเกจพรีเมียม",
      packageDuration: "3 เดือน",
    },
    {
      id: "3",
      name: "คุณวิชัย ท่องเที่ยว",
      email: "wichai@example.com",
      phone: "083-456-7890",
      type: "agent",
      verificationStatus: "rejected",
      joinDate: "2024-03-01",
      lastActive: "2024-03-13",
      location: "กรุงเทพฯ",
      avatar: "/placeholder.svg?height=40&width=40",
      documents: {
        idCard: { status: "rejected", url: "/placeholder.svg", uploadDate: "2024-03-01" },
        selfie: { status: "rejected", url: "/placeholder.svg", uploadDate: "2024-03-02" },
        businessLicense: { status: "rejected", url: "/placeholder.svg", uploadDate: "2024-03-02" },
        bankAccount: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-03-01" },
      },
      rejectionReason: "เอกสารไม่ชัดเจน กรุณาถ่ายรูปใหม่ให้เห็นข้อมูลชัดเจน",
      propertiesCount: 0,
      rating: 0,
      reviewCount: 0,
      paymentStatus: "failed",
      paymentAmount: 1500,
      packageName: "แพ็คเกจมาตรฐาน",
      packageDuration: "1 เดือน",
    },
    {
      id: "4",
      name: "คุณนภา พาเที่ยว",
      email: "napa@example.com",
      phone: "084-567-8901",
      type: "owner",
      verificationStatus: "incomplete",
      joinDate: "2024-03-05",
      lastActive: "2024-03-15",
      location: "กระบี่",
      avatar: "/placeholder.svg?height=40&width=40",
      documents: {
        idCard: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-03-05" },
        selfie: { status: "pending", uploadDate: "" },
        bankAccount: { status: "pending", uploadDate: "" },
      },
      propertiesCount: 1,
      rating: 4.2,
      reviewCount: 5,
      paymentStatus: "none",
      packageName: "ทดลองใช้งาน",
      packageDuration: "7 วัน",
    },
    {
      id: "5",
      name: "คุณสมศรี ดีใจ",
      email: "somsri@example.com",
      phone: "085-678-9012",
      type: "user",
      verificationStatus: "approved",
      joinDate: "2024-01-20",
      lastActive: "2024-03-10",
      location: "เชียงราย",
      avatar: "/placeholder.svg?height=40&width=40",
      documents: {
        idCard: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-01-20" },
        selfie: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-01-21" },
        bankAccount: { status: "approved", url: "/placeholder.svg", uploadDate: "2024-01-21" },
      },
      propertiesCount: 0,
      rating: 0,
      reviewCount: 0,
      paymentStatus: "completed",
      paymentDate: "2024-01-21",
      paymentAmount: 990,
      packageName: "แพ็คเกจพื้นฐาน",
      packageDuration: "1 เดือน",
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    const matchesType = selectedType === "all" || user.type === selectedType
    const matchesStatus = selectedStatus === "all" || user.verificationStatus === selectedStatus
    const matchesPaymentStatus = selectedPaymentStatus === "all" || user.paymentStatus === selectedPaymentStatus

    return matchesSearch && matchesType && matchesStatus && matchesPaymentStatus
  })

  const getUserStats = () => {
    const total = users.length
    const pending = users.filter((u) => u.verificationStatus === "pending").length
    const approved = users.filter((u) => u.verificationStatus === "approved").length
    const rejected = users.filter((u) => u.verificationStatus === "rejected").length
    const incomplete = users.filter((u) => u.verificationStatus === "incomplete").length

    const pendingPayment = users.filter((u) => u.paymentStatus === "pending").length
    const completedPayment = users.filter((u) => u.paymentStatus === "completed").length
    const failedPayment = users.filter((u) => u.paymentStatus === "failed").length

    return { total, pending, approved, rejected, incomplete, pendingPayment, completedPayment, failedPayment }
  }

  const stats = getUserStats()

  const getTypeBadge = (type: UserType) => {
    switch (type) {
      case "agent":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Briefcase className="h-3 w-3 mr-1" />
            นายหน้า
          </Badge>
        )
      case "owner":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <Home className="h-3 w-3 mr-1" />
            เจ้าของบ้าน
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <User className="h-3 w-3 mr-1" />
            ผู้ใช้ทั่วไป
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: VerificationStatus) => {
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
            ปฏิเสธ
          </Badge>
        )
      case "incomplete":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            เอกสารไม่ครบ
          </Badge>
        )
    }
  }

  const getDocumentStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600 text-xs">อนุมัติ</Badge>
      case "pending":
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">รอตรวจสอบ</Badge>
      case "rejected":
        return <Badge className="bg-red-500 hover:bg-red-600 text-xs">ปฏิเสธ</Badge>
      default:
        return (
          <Badge variant="outline" className="text-xs">
            ยังไม่ส่ง
          </Badge>
        )
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            ชำระเงินแล้ว
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            รอชำระเงิน
          </Badge>
        )
      case "failed":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            ชำระเงินไม่สำเร็จ
          </Badge>
        )
      case "none":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            ไม่มีการชำระเงิน
          </Badge>
        )
    }
  }

  const handleUserAction = (action: string, user: UserData) => {
    switch (action) {
      case "view":
        setSelectedUser(user)
        setIsUserDialogOpen(true)
        break
      case "approve":
        alert(`อนุมัติสมาชิก: ${user.name}`)
        break
      case "reject":
        setSelectedUser(user)
        setRejectionReason("")
        // Open rejection dialog
        break
      case "verifyPayment":
        alert(`ยืนยันการชำระเงินของ: ${user.name}`)
        break
      case "sendReminder":
        alert(`ส่งแจ้งเตือนการชำระเงินไปยัง: ${user.name}`)
        break
    }
  }

  const handleApproveUser = () => {
    if (selectedUser) {
      alert(`อนุมัติการยืนยันตัวตน: ${selectedUser.name}`)
      setIsUserDialogOpen(false)
    }
  }

  const handleRejectUser = () => {
    if (selectedUser && rejectionReason.trim()) {
      alert(`ปฏิเสธการยืนยันตัวตน: ${selectedUser.name}\nเหตุผล: ${rejectionReason}`)
      setIsUserDialogOpen(false)
      setRejectionReason("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">อนุมัติสมาชิกใหม่และตรวจสอบการชำระเงิน</h1>
          <p className="text-gray-500">ตรวจสอบและอนุมัติสมาชิกใหม่ พร้อมยืนยันสถานะการชำระเงิน</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สมาชิกทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">บัญชีผู้ใช้ทั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สมาชิกใหม่</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">รอการอนุมัติ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอชำระเงิน</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pendingPayment}</div>
            <p className="text-xs text-muted-foreground">ยังไม่ชำระเงิน</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ชำระเงินแล้ว</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completedPayment}</div>
            <p className="text-xs text-muted-foreground">ชำระเงินเรียบร้อย</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มีปัญหา</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failedPayment}</div>
            <p className="text-xs text-muted-foreground">ชำระเงินไม่สำเร็จ</p>
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
                  placeholder="ค้นหาด้วยชื่อ, อีเมล, หรือเบอร์โทร..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    ประเภท: {selectedType === "all" ? "ทั้งหมด" : selectedType}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedType("all")}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("agent")}>นายหน้า</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("owner")}>เจ้าของบ้าน</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedType("user")}>ผู้ใช้ทั่วไป</DropdownMenuItem>
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
                  <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>รอการตรวจสอบ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("approved")}>อนุมัติแล้ว</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("rejected")}>ปฏิเสธ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("incomplete")}>เอกสารไม่ครบ</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    สถานะการชำระเงิน: {selectedPaymentStatus === "all" ? "ทั้งหมด" : selectedPaymentStatus}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedPaymentStatus("all")}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPaymentStatus("pending")}>รอชำระเงิน</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPaymentStatus("completed")}>ชำระเงินแล้ว</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPaymentStatus("failed")}>ชำระเงินไม่สำเร็จ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedPaymentStatus("none")}>ไม่มีการชำระเงิน</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>รายชื่อผู้ใช้ ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={user.avatar || "/placeholder.svg"}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      {getTypeBadge(user.type)}
                      {getStatusBadge(user.verificationStatus)}
                      {getPaymentStatusBadge(user.paymentStatus)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{user.phone}</span>
                      </div>
                      {user.packageName && (
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          <span>
                            {user.packageName} ({user.packageDuration})
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>สมัครเมื่อ: {user.joinDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>ใช้งานล่าสุด: {user.lastActive}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {user.verificationStatus === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleUserAction("approve", user)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      อนุมัติ
                    </Button>
                  )}
                  {user.paymentStatus === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleUserAction("verifyPayment", user)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CreditCard className="h-4 w-4 mr-1" />
                      ยืนยันชำระเงิน
                    </Button>
                  )}
                  {user.paymentStatus === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUserAction("sendReminder", user)}
                      className="text-amber-600 border-amber-300 hover:bg-amber-50"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      ส่งแจ้งเตือน
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUserAction("view", user)}>
                        <Eye className="h-4 w-4 mr-2" />
                        ดูรายละเอียด
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบผู้ใช้</h3>
              <p className="text-gray-500">ลองเปลี่ยนเงื่อนไขการค้นหาหรือกรองข้อมูล</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดผู้ใช้และเอกสารยืนยันตัวตน</DialogTitle>
            <DialogDescription>ตรวจสอบข้อมูลและเอกสารยืนยันตัวตนของผู้ใช้</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeBadge(selectedUser.type)}
                    {getStatusBadge(selectedUser.verificationStatus)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span>{selectedUser.email}</span>
                    <span>{selectedUser.phone}</span>
                    <span>{selectedUser.location}</span>
                  </div>
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedUser.verificationStatus === "rejected" && selectedUser.rejectionReason && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">เหตุผลการปฏิเสธ:</h4>
                  <p className="text-red-700">{selectedUser.rejectionReason}</p>
                </div>
              )}

              {/* Documents */}
              <Tabs defaultValue="documents" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="documents">เอกสารยืนยันตัวตน</TabsTrigger>
                  <TabsTrigger value="payment">ข้อมูลการชำระเงิน</TabsTrigger>
                  <TabsTrigger value="info">ข้อมูลเพิ่มเติม</TabsTrigger>
                </TabsList>

                <TabsContent value="documents" className="space-y-4">
                  <div className="grid gap-4">
                    {/* ID Card */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          <h4 className="font-medium">บัตรประชาชน/พาสปอร์ต</h4>
                        </div>
                        {getDocumentStatusBadge(selectedUser.documents.idCard.status)}
                      </div>
                      {selectedUser.documents.idCard.url && (
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedUser.documents.idCard.url || "/placeholder.svg"}
                            alt="ID Card"
                            className="w-32 h-20 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              อัพโหลดเมื่อ: {selectedUser.documents.idCard.uploadDate}
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Download className="h-4 w-4 mr-1" />
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Selfie */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          <h4 className="font-medium">รูปถ่ายยืนยันตัวตน</h4>
                        </div>
                        {getDocumentStatusBadge(selectedUser.documents.selfie.status)}
                      </div>
                      {selectedUser.documents.selfie.url && (
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedUser.documents.selfie.url || "/placeholder.svg"}
                            alt="Selfie"
                            className="w-32 h-20 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              อัพโหลดเมื่อ: {selectedUser.documents.selfie.uploadDate}
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Download className="h-4 w-4 mr-1" />
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Business License (for agents) */}
                    {selectedUser.type === "agent" && selectedUser.documents.businessLicense && (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            <h4 className="font-medium">ใบอนุญาตประกอบธุรกิจ</h4>
                          </div>
                          {getDocumentStatusBadge(selectedUser.documents.businessLicense.status)}
                        </div>
                        {selectedUser.documents.businessLicense.url && (
                          <div className="flex items-center gap-2">
                            <img
                              src={selectedUser.documents.businessLicense.url || "/placeholder.svg"}
                              alt="Business License"
                              className="w-32 h-20 object-cover rounded border"
                            />
                            <div className="flex-1">
                              <p className="text-sm text-gray-600">
                                อัพโหลดเมื่อ: {selectedUser.documents.businessLicense.uploadDate}
                              </p>
                              <Button variant="outline" size="sm" className="mt-2">
                                <Download className="h-4 w-4 mr-1" />
                                ดาวน์โหลด
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bank Account */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5" />
                          <h4 className="font-medium">หลักฐานบัญชีธนาคาร</h4>
                        </div>
                        {getDocumentStatusBadge(selectedUser.documents.bankAccount.status)}
                      </div>
                      {selectedUser.documents.bankAccount.url && (
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedUser.documents.bankAccount.url || "/placeholder.svg"}
                            alt="Bank Account"
                            className="w-32 h-20 object-cover rounded border"
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">
                              อัพโหลดเมื่อ: {selectedUser.documents.bankAccount.uploadDate}
                            </p>
                            <Button variant="outline" size="sm" className="mt-2">
                              <Download className="h-4 w-4 mr-1" />
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="payment" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <h4 className="font-medium">สถานะการชำระเงิน</h4>
                      </div>
                      {selectedUser && getPaymentStatusBadge(selectedUser.paymentStatus)}
                    </div>

                    {selectedUser && selectedUser.paymentStatus !== "none" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">แพ็คเกจ</p>
                            <p className="font-medium">{selectedUser.packageName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">ระยะเวลา</p>
                            <p className="font-medium">{selectedUser.packageDuration}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">จำนวนเงิน</p>
                            <p className="font-medium">{selectedUser.paymentAmount?.toLocaleString()} บาท</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">วันที่ชำระเงิน</p>
                            <p className="font-medium">{selectedUser.paymentDate || "-"}</p>
                          </div>
                        </div>

                        {selectedUser.paymentStatus === "pending" && (
                          <div className="pt-4 border-t">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <CreditCard className="h-4 w-4 mr-2" />
                              ยืนยันการชำระเงิน
                            </Button>
                            <Button variant="outline" className="ml-2">
                              <Send className="h-4 w-4 mr-2" />
                              ส่งแจ้งเตือนชำระเงิน
                            </Button>
                          </div>
                        )}

                        {selectedUser.paymentStatus === "failed" && (
                          <div className="pt-4 border-t">
                            <Button className="bg-blue-600 hover:bg-blue-700">
                              <CreditCard className="h-4 w-4 mr-2" />
                              บันทึกการชำระเงินใหม่
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedUser && selectedUser.paymentStatus === "none" && (
                      <div className="text-center py-4">
                        <p className="text-gray-500">ไม่มีข้อมูลการชำระเงิน</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">ข้อมูลการสมัคร</Label>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>สมัครเมื่อ: {selectedUser.joinDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span>ใช้งานล่าสุด: {selectedUser.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    {selectedUser.type !== "user" && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">สถิติการใช้งาน</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-teal-600">{selectedUser.propertiesCount || 0}</div>
                            <div className="text-sm text-gray-500">ที่พัก</div>
                          </div>
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-amber-600">{selectedUser.rating || 0}</div>
                            <div className="text-sm text-gray-500">คะแนน</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              {selectedUser.verificationStatus === "pending" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rejection-reason">เหตุผลการปฏิเสธ (ถ้ามี)</Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="ระบุเหตุผลหากต้องการปฏิเสธการยืนยัน..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-2 pt-4 border-t">
                    <Button onClick={handleApproveUser} className="bg-green-600 hover:bg-green-700">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      อนุมัติการยืนยันตัวตน
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleRejectUser}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      disabled={!rejectionReason.trim()}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      ปฏิเสธการยืนยัน
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
