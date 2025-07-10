"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserPlus,
  Shield,
  ShieldCheck,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
} from "lucide-react"

type UserStatus = "active" | "suspended" | "pending" | "banned"
type UserRole = "admin" | "verified_member" | "member" | "guest"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  joinDate: string
  lastActive: string
  location: string
  propertiesCount: number
  rating: number
  reviewCount: number
  avatar: string
  verificationDate?: string
  suspensionReason?: string
}

export default function DashboardUsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)

  // Mock data
  const [users] = useState<User[]>([
    {
      id: "1",
      name: "คุณสมชาย ใจดี",
      email: "somchai@example.com",
      phone: "081-234-5678",
      role: "verified_member",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2024-03-15",
      location: "เชียงใหม่",
      propertiesCount: 3,
      rating: 4.8,
      reviewCount: 124,
      avatar: "/placeholder.svg?height=40&width=40",
      verificationDate: "2024-02-01",
    },
    {
      id: "2",
      name: "คุณมาลี สวยงาม",
      email: "malee@example.com",
      phone: "082-345-6789",
      role: "verified_member",
      status: "active",
      joinDate: "2024-02-10",
      lastActive: "2024-03-14",
      location: "ภูเก็ต",
      propertiesCount: 5,
      rating: 4.6,
      reviewCount: 98,
      avatar: "/placeholder.svg?height=40&width=40",
      verificationDate: "2024-02-20",
    },
    {
      id: "3",
      name: "คุณวิชัย ท่องเที่ยว",
      email: "wichai@example.com",
      phone: "083-456-7890",
      role: "member",
      status: "pending",
      joinDate: "2024-03-01",
      lastActive: "2024-03-13",
      location: "กรุงเทพฯ",
      propertiesCount: 1,
      rating: 4.2,
      reviewCount: 15,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "4",
      name: "คุณนภา พาเที่ยว",
      email: "napa@example.com",
      phone: "084-567-8901",
      role: "verified_member",
      status: "active",
      joinDate: "2023-12-05",
      lastActive: "2024-03-15",
      location: "กระบี่",
      propertiesCount: 7,
      rating: 4.9,
      reviewCount: 156,
      avatar: "/placeholder.svg?height=40&width=40",
      verificationDate: "2023-12-20",
    },
    {
      id: "5",
      name: "คุณสมศรี ดีใจ",
      email: "somsri@example.com",
      phone: "085-678-9012",
      role: "member",
      status: "suspended",
      joinDate: "2024-01-20",
      lastActive: "2024-03-10",
      location: "เชียงราย",
      propertiesCount: 2,
      rating: 3.8,
      reviewCount: 45,
      avatar: "/placeholder.svg?height=40&width=40",
      suspensionReason: "มีรายงานการให้ข้อมูลเท็จ",
    },
    {
      id: "6",
      name: "ผู้ดูแลระบบ",
      email: "admin@checkteepak.com",
      phone: "02-123-4567",
      role: "admin",
      status: "active",
      joinDate: "2023-01-01",
      lastActive: "2024-03-15",
      location: "กรุงเทพฯ",
      propertiesCount: 0,
      rating: 0,
      reviewCount: 0,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)

    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const getUserStats = () => {
    const total = users.length
    const active = users.filter((u) => u.status === "active").length
    const verified = users.filter((u) => u.role === "verified_member").length
    const pending = users.filter((u) => u.status === "pending").length
    const suspended = users.filter((u) => u.status === "suspended").length

    return { total, active, verified, pending, suspended }
  }

  const stats = getUserStats()

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">
            <Shield className="h-3 w-3 mr-1" />
            ผู้ดูแลระบบ
          </Badge>
        )
      case "verified_member":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <ShieldCheck className="h-3 w-3 mr-1" />
            สมาชิกยืนยัน
          </Badge>
        )
      case "member":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Users className="h-3 w-3 mr-1" />
            สมาชิกทั่วไป
          </Badge>
        )
      case "guest":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            ผู้เยี่ยมชม
          </Badge>
        )
    }
  }

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            ใช้งานอยู่
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            รอการอนุมัติ
          </Badge>
        )
      case "suspended":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            ถูกระงับ
          </Badge>
        )
      case "banned":
        return (
          <Badge className="bg-gray-500 hover:bg-gray-600">
            <Ban className="h-3 w-3 mr-1" />
            ถูกแบน
          </Badge>
        )
    }
  }

  const handleUserAction = (action: string, user: User) => {
    switch (action) {
      case "view":
        setSelectedUser(user)
        setIsUserDialogOpen(true)
        break
      case "edit":
        alert(`แก้ไขข้อมูลผู้ใช้: ${user.name}`)
        break
      case "suspend":
        alert(`ระงับการใช้งาน: ${user.name}`)
        break
      case "activate":
        alert(`เปิดใช้งาน: ${user.name}`)
        break
      case "delete":
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบผู้ใช้: ${user.name}?`)) {
          alert(`ลบผู้ใช้: ${user.name}`)
        }
        break
      case "verify":
        alert(`อนุมัติการยืนยัน: ${user.name}`)
        break
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">จัดการผู้ใช้</h1>
          <p className="text-gray-500">จัดการบัญชีผู้ใช้และสิทธิ์การเข้าถึง</p>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700">
          <UserPlus className="h-4 w-4 mr-2" />
          เพิ่มผู้ใช้ใหม่
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">บัญชีผู้ใช้ทั้งหมด</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ใช้งานอยู่</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">ผู้ใช้ที่ใช้งานอยู่</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">สมาชิกยืนยัน</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">สมาชิกที่ยืนยันแล้ว</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอการอนุมัติ</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">รอการตรวจสอบ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ถูกระงับ</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.suspended}</div>
            <p className="text-xs text-muted-foreground">บัญชีที่ถูกระงับ</p>
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
                    บทบาท: {selectedRole === "all" ? "ทั้งหมด" : selectedRole}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedRole("all")}>ทั้งหมด</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole("admin")}>ผู้ดูแลระบบ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole("verified_member")}>สมาชิกยืนยัน</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole("member")}>สมาชิกทั่วไป</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedRole("guest")}>ผู้เยี่ยมชม</DropdownMenuItem>
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
                  <DropdownMenuItem onClick={() => setSelectedStatus("active")}>ใช้งานอยู่</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>รอการอนุมัติ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("suspended")}>ถูกระงับ</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("banned")}>ถูกแบน</DropdownMenuItem>
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
                      {getRoleBadge(user.role)}
                      {getStatusBadge(user.status)}
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
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{user.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>เข้าร่วม: {user.joinDate}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>ใช้งานล่าสุด: {user.lastActive}</span>
                      </div>
                      {user.role !== "admin" && (
                        <>
                          <div className="flex items-center gap-1">
                            <Building className="h-3 w-3" />
                            <span>{user.propertiesCount} ที่พัก</span>
                          </div>
                          {user.reviewCount > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>
                                {user.rating} ({user.reviewCount} รีวิว)
                              </span>
                            </div>
                          )}
                        </>
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
                    <DropdownMenuItem onClick={() => handleUserAction("view", user)}>
                      <Eye className="h-4 w-4 mr-2" />
                      ดูรายละเอียด
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUserAction("edit", user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      แก้ไขข้อมูล
                    </DropdownMenuItem>
                    {user.status === "pending" && (
                      <DropdownMenuItem onClick={() => handleUserAction("verify", user)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        อนุมัติการยืนยัน
                      </DropdownMenuItem>
                    )}
                    {user.status === "active" ? (
                      <DropdownMenuItem onClick={() => handleUserAction("suspend", user)}>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        ระงับการใช้งาน
                      </DropdownMenuItem>
                    ) : user.status === "suspended" ? (
                      <DropdownMenuItem onClick={() => handleUserAction("activate", user)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        เปิดใช้งาน
                      </DropdownMenuItem>
                    ) : null}
                    {user.role !== "admin" && (
                      <DropdownMenuItem onClick={() => handleUserAction("delete", user)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        ลบบัญชี
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>รายละเอียดผู้ใช้</DialogTitle>
            <DialogDescription>ข้อมูลโดยละเอียดของผู้ใช้ในระบบ</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={selectedUser.avatar || "/placeholder.svg"}
                    alt={selectedUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getRoleBadge(selectedUser.role)}
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">ข้อมูลติดต่อ</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{selectedUser.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500">ข้อมูลการใช้งาน</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>เข้าร่วม: {selectedUser.joinDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>ใช้งานล่าสุด: {selectedUser.lastActive}</span>
                    </div>
                    {selectedUser.verificationDate && (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-gray-400" />
                        <span>ยืนยันเมื่อ: {selectedUser.verificationDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedUser.role !== "admin" && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">สถิติการใช้งาน</Label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-teal-600">{selectedUser.propertiesCount}</div>
                      <div className="text-sm text-gray-500">ที่พัก</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-amber-600">{selectedUser.rating}</div>
                      <div className="text-sm text-gray-500">คะแนน</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedUser.reviewCount}</div>
                      <div className="text-sm text-gray-500">รีวิว</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedUser.suspensionReason && (
                <div>
                  <Label className="text-sm font-medium text-red-600">เหตุผลการระงับ</Label>
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700">{selectedUser.suspensionReason}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => handleUserAction("edit", selectedUser)}>
                  <Edit className="h-4 w-4 mr-2" />
                  แก้ไขข้อมูล
                </Button>
                {selectedUser.status === "active" ? (
                  <Button
                    variant="outline"
                    onClick={() => handleUserAction("suspend", selectedUser)}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    ระงับการใช้งาน
                  </Button>
                ) : selectedUser.status === "suspended" ? (
                  <Button
                    onClick={() => handleUserAction("activate", selectedUser)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    เปิดใช้งาน
                  </Button>
                ) : null}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
