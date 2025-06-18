"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Bell,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  Pin,
  Users,
  FileText,
  AlertTriangle,
  Shield,
  Settings,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react"

interface Notification {
  id: string
  type: "new_user" | "document_pending" | "complaint" | "fraudster" | "security" | "system"
  title: string
  message: string
  timestamp: string
  isRead: boolean
  priority: "normal" | "important" | "urgent"
  isPinned: boolean
  relatedUser?: string
  relatedLink?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "new_user",
    title: "ผู้ใช้ใหม่สมัครสมาชิก",
    message: "คุณสมชาย ใจดี ได้สมัครสมาชิกใหม่และรอการยืนยันตัวตน",
    timestamp: "2024-01-15 14:30:00",
    isRead: false,
    priority: "normal",
    isPinned: false,
    relatedUser: "สมชาย ใจดี",
    relatedLink: "/admin/users",
  },
  {
    id: "2",
    type: "document_pending",
    title: "เอกสารรอการตรวจสอบ",
    message: "คุณวิไล รักบ้าน ส่งเอกสารยืนยันตัวตนรอการอนุมัติ",
    timestamp: "2024-01-15 13:45:00",
    isRead: false,
    priority: "important",
    isPinned: true,
    relatedUser: "วิไล รักบ้าน",
    relatedLink: "/admin/documents",
  },
  {
    id: "3",
    type: "complaint",
    title: "เรื่องร้องเรียนใหม่",
    message: "คุณมาลี ดีใจ ร้องเรียนเรื่องถูกหลอกลวงจากนายหน้าปลอม",
    timestamp: "2024-01-15 12:20:00",
    isRead: false,
    priority: "urgent",
    isPinned: false,
    relatedUser: "มาลี ดีใจ",
    relatedLink: "/admin/reports",
  },
  {
    id: "4",
    type: "fraudster",
    title: "มิจฉาชีพใหม่",
    message: 'พบมิจฉาชีพใหม่ "ดำรง โกงเงิน" ถูกรายงานจากหลายแหล่ง',
    timestamp: "2024-01-15 11:15:00",
    isRead: true,
    priority: "urgent",
    isPinned: true,
    relatedUser: "ดำรง โกงเงิน",
    relatedLink: "/admin/fraudsters",
  },
  {
    id: "5",
    type: "security",
    title: "การเข้าสู่ระบบผิดปกติ",
    message: "ตรวจพบการเข้าสู่ระบบผิดปกติจาก IP 192.168.1.100",
    timestamp: "2024-01-15 10:30:00",
    isRead: false,
    priority: "important",
    isPinned: false,
    relatedLink: "/admin/security",
  },
  {
    id: "6",
    type: "system",
    title: "การบำรุงรักษาระบบ",
    message: "ระบบจะมีการบำรุงรักษาในวันที่ 20 มกราคม 2024 เวลา 02:00-04:00 น.",
    timestamp: "2024-01-15 09:00:00",
    isRead: true,
    priority: "normal",
    isPinned: false,
    relatedLink: "/admin/settings",
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "new_user":
      return <Users className="h-4 w-4" />
    case "document_pending":
      return <FileText className="h-4 w-4" />
    case "complaint":
      return <MessageSquare className="h-4 w-4" />
    case "fraudster":
      return <Shield className="h-4 w-4" />
    case "security":
      return <AlertTriangle className="h-4 w-4" />
    case "system":
      return <Settings className="h-4 w-4" />
    default:
      return <Bell className="h-4 w-4" />
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "new_user":
      return "ผู้ใช้ใหม่"
    case "document_pending":
      return "เอกสารรอตรวจ"
    case "complaint":
      return "เรื่องร้องเรียน"
    case "fraudster":
      return "มิจฉาชีพใหม่"
    case "security":
      return "ความปลอดภัย"
    case "system":
      return "ระบบ"
    default:
      return "อื่นๆ"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "destructive"
    case "important":
      return "default"
    case "normal":
      return "secondary"
    default:
      return "secondary"
  }
}

const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "เร่งด่วน"
    case "important":
      return "สำคัญ"
    case "normal":
      return "ปกติ"
    default:
      return "ปกติ"
  }
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const { toast } = useToast()

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && !notification.isRead) ||
      (statusFilter === "read" && notification.isRead)
    const matchesPriority = priorityFilter === "all" || notification.priority === priorityFilter

    return matchesSearch && matchesType && matchesStatus && matchesPriority
  })

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const urgentCount = notifications.filter((n) => n.priority === "urgent").length
  const securityCount = notifications.filter((n) => n.type === "security").length
  const todayCount = notifications.filter((n) => {
    const today = new Date().toISOString().split("T")[0]
    return n.timestamp.startsWith(today.replace(/-/g, "-"))
  }).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
    toast({
      title: "ทำเครื่องหมายอ่านแล้ว",
      description: "การแจ้งเตือนถูกทำเครื่องหมายว่าอ่านแล้ว",
    })
  }

  const togglePin = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)))
    toast({
      title: "อัพเดตการปักหมุด",
      description: "สถานะการปักหมุดถูกเปลี่ยนแปลงแล้ว",
    })
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    toast({
      title: "ลบการแจ้งเตือน",
      description: "การแจ้งเตือนถูกลบเรียบร้อยแล้ว",
    })
  }

  const refreshNotifications = () => {
    toast({
      title: "รีเฟรชข้อมูล",
      description: "ข้อมูลการแจ้งเตือนได้รับการอัพเดตแล้ว",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">การแจ้งเตือน</h1>
          <p className="text-muted-foreground">จัดการการแจ้งเตือนของระบบ</p>
        </div>
        <Button onClick={refreshNotifications} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          รีเฟรช
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ทั้งหมด</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notifications.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยังไม่อ่าน</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{unreadCount}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">เร่งด่วน</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentCount}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ความปลอดภัย</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{securityCount}</div>
            <p className="text-xs text-muted-foreground">รายการ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">วันนี้</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{todayCount}</div>
            <p className="text-xs text-muted-foreground">รายการใหม่</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            ตัวกรองและค้นหา
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ค้นหา</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาการแจ้งเตือน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ประเภท</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภท" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="new_user">ผู้ใช้ใหม่</SelectItem>
                  <SelectItem value="document_pending">เอกสารรอตรวจ</SelectItem>
                  <SelectItem value="complaint">เรื่องร้องเรียน</SelectItem>
                  <SelectItem value="fraudster">มิจฉาชีพใหม่</SelectItem>
                  <SelectItem value="security">ความปลอดภัย</SelectItem>
                  <SelectItem value="system">ระบบ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">สถานะ</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="unread">ยังไม่อ่าน</SelectItem>
                  <SelectItem value="read">อ่านแล้ว</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">ความสำคัญ</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกความสำคัญ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทั้งหมด</SelectItem>
                  <SelectItem value="normal">ปกติ</SelectItem>
                  <SelectItem value="important">สำคัญ</SelectItem>
                  <SelectItem value="urgent">เร่งด่วน</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>รายการการแจ้งเตือน ({filteredNotifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border rounded-lg transition-colors ${
                  !notification.isRead ? "bg-blue-50 border-blue-200" : "bg-white"
                } ${notification.priority === "urgent" ? "border-red-300 bg-red-50" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div
                      className={`p-2 rounded-full ${
                        notification.priority === "urgent"
                          ? "bg-red-100 text-red-600"
                          : notification.priority === "important"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        {notification.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                        <Badge variant={getPriorityColor(notification.priority)}>
                          {getPriorityLabel(notification.priority)}
                        </Badge>
                        <Badge variant="outline">{getTypeLabel(notification.type)}</Badge>
                        {!notification.isRead && <Badge variant="destructive">ใหม่</Badge>}
                      </div>

                      <p className="text-gray-600 mb-2">{notification.message}</p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(notification.timestamp).toLocaleString("th-TH")}
                        </span>
                        {notification.relatedUser && <span>ผู้เกี่ยวข้อง: {notification.relatedUser}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedNotification(notification)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            {getTypeIcon(notification.type)}
                            {notification.title}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Badge variant={getPriorityColor(notification.priority)}>
                              {getPriorityLabel(notification.priority)}
                            </Badge>
                            <Badge variant="outline">{getTypeLabel(notification.type)}</Badge>
                            {notification.isPinned && <Badge variant="secondary">ปักหมุด</Badge>}
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">รายละเอียด</h4>
                            <p className="text-gray-600">{notification.message}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">วันที่และเวลา:</span>
                              <p>{new Date(notification.timestamp).toLocaleString("th-TH")}</p>
                            </div>
                            {notification.relatedUser && (
                              <div>
                                <span className="font-medium">ผู้เกี่ยวข้อง:</span>
                                <p>{notification.relatedUser}</p>
                              </div>
                            )}
                          </div>

                          {notification.relatedLink && (
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <ExternalLink className="mr-2 h-4 w-4" />
                                ไปยังหน้าที่เกี่ยวข้อง
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {!notification.isRead && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}

                    <Button variant="outline" size="sm" onClick={() => togglePin(notification.id)}>
                      <Pin className={`h-4 w-4 ${notification.isPinned ? "text-yellow-500" : ""}`} />
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => deleteNotification(notification.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredNotifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>ไม่พบการแจ้งเตือนที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
