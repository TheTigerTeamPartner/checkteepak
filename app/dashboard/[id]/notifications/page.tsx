"use client"

import { useState } from "react"
import { Bell, CheckCheck, Clock, CreditCard, FileCheck, MessageSquare, Shield, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Mock data for notifications
const mockNotifications = [
  {
    id: 1,
    type: "system",
    title: "ประกาศปิดปรับปรุงระบบ",
    message: "ระบบจะปิดปรับปรุงชั่วคราว วันที่ 15 มกราคม 2567 เวลา 02:00-06:00 น.",
    timestamp: "2024-01-10T10:30:00Z",
    isRead: false,
    priority: "high",
    icon: Bell,
  },
  {
    id: 2,
    type: "verification",
    title: "เอกสารได้รับการอนุมัติ",
    message: "เอกสารบัตรประชาชนของคุณได้รับการอนุมัติเรียบร้อยแล้ว",
    timestamp: "2024-01-10T09:15:00Z",
    isRead: false,
    priority: "normal",
    icon: FileCheck,
  },
  {
    id: 3,
    type: "review",
    title: "รีวิวใหม่ได้รับการอนุมัติ",
    message: "รีวิวจากคุณสมหญิง ศรีสุข ได้รับการอนุมัติและแสดงในโปรไฟล์แล้ว",
    timestamp: "2024-01-10T08:45:00Z",
    isRead: true,
    priority: "normal",
    icon: MessageSquare,
  },
  {
    id: 4,
    type: "payment",
    title: "ใบเสร็จการชำระเงิน",
    message: "ใบเสร็จการชำระเงินแพ็คเกจ Premium ประจำเดือนมกราคม 2567",
    timestamp: "2024-01-09T16:20:00Z",
    isRead: true,
    priority: "normal",
    icon: CreditCard,
  },
  {
    id: 5,
    type: "security",
    title: "การเข้าสู่ระบบจากอุปกรณ์ใหม่",
    message: "มีการเข้าสู่ระบบจากอุปกรณ์ใหม่ IP: 192.168.1.100",
    timestamp: "2024-01-09T14:10:00Z",
    isRead: false,
    priority: "high",
    icon: Shield,
  },
  {
    id: 6,
    type: "verification",
    title: "เอกสารไม่ผ่านการตรวจสอบ",
    message: "เอกสารที่อยู่ไม่ผ่านการตรวจสอบ กรุณาอัพโหลดเอกสารใหม่",
    timestamp: "2024-01-08T11:30:00Z",
    isRead: true,
    priority: "urgent",
    icon: FileCheck,
  },
  {
    id: 7,
    type: "payment",
    title: "การต่ออายุสมาชิกใกล้หมดอายุ",
    message: "แพ็คเกจสมาชิกของคุณจะหมดอายุในวันที่ 20 มกราคม 2567",
    timestamp: "2024-01-08T09:00:00Z",
    isRead: false,
    priority: "high",
    icon: CreditCard,
  },
  {
    id: 8,
    type: "system",
    title: "ฟีเจอร์ใหม่: ระบบแชทสด",
    message: "เพิ่มฟีเจอร์ระบบแชทสดสำหรับติดต่อกับลูกค้าแล้ว",
    timestamp: "2024-01-07T15:45:00Z",
    isRead: true,
    priority: "normal",
    icon: Bell,
  },
]

const notificationTypes = [
  { value: "all", label: "ทั้งหมด", count: mockNotifications.length },
  { value: "system", label: "ระบบ", count: mockNotifications.filter((n) => n.type === "system").length },
  { value: "verification", label: "การยืนยัน", count: mockNotifications.filter((n) => n.type === "verification").length },
  { value: "review", label: "รีวิว", count: mockNotifications.filter((n) => n.type === "review").length },
  { value: "payment", label: "การชำระเงิน", count: mockNotifications.filter((n) => n.type === "payment").length },
  { value: "security", label: "ความปลอดภัย", count: mockNotifications.filter((n) => n.type === "security").length },
]

const priorityColors = {
  normal: "bg-blue-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
}

const typeColors = {
  system: "text-blue-600 bg-blue-50",
  verification: "text-green-600 bg-green-50",
  review: "text-purple-600 bg-purple-50",
  payment: "text-orange-600 bg-orange-50",
  security: "text-red-600 bg-red-50",
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [filter, setFilter] = useState("all")

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const todayCount = notifications.filter((n) => {
    const today = new Date().toDateString()
    const notificationDate = new Date(n.timestamp).toDateString()
    return today === notificationDate
  }).length
  const importantCount = notifications.filter((n) => n.priority === "high" || n.priority === "urgent").length

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab !== "all" && notification.type !== activeTab) return false
    if (filter === "unread" && notification.isRead) return false
    if (filter === "important" && notification.priority === "normal") return false
    return true
  })

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const deleteReadNotifications = () => {
    setNotifications((prev) => prev.filter((notification) => !notification.isRead))
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "เมื่อสักครู่"
    if (diffInHours < 24) return `${diffInHours} ชั่วโมงที่แล้ว`
    if (diffInHours < 48) return "เมื่อวาน"
    return date.toLocaleDateString("th-TH")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">การแจ้งเตือน</h1>
          <p className="text-gray-600">ติดตามการแจ้งเตือนและข้อความสำคัญ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4 mr-2" />
            อ่านทั้งหมด
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={deleteReadNotifications}
            disabled={notifications.filter((n) => n.isRead).length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            ลบที่อ่านแล้ว
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ยังไม่อ่าน</p>
                <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">วันนี้</p>
                <p className="text-2xl font-bold text-blue-600">{todayCount}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">สำคัญ</p>
                <p className="text-2xl font-bold text-orange-600">{importantCount}</p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="กรองการแจ้งเตือน" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="unread">ยังไม่อ่าน</SelectItem>
            <SelectItem value="important">สำคัญ</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notifications Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {notificationTypes.map((type) => (
            <TabsTrigger key={type.value} value={type.value} className="text-xs">
              {type.label}
              {type.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {type.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {notificationTypes.map((type) => (
          <TabsContent key={type.value} value={type.value} className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่มีการแจ้งเตือน</h3>
                  <p className="text-gray-600">
                    {filter === "unread"
                      ? "ไม่มีการแจ้งเตือนที่ยังไม่ได้อ่าน"
                      : filter === "important"
                        ? "ไม่มีการแจ้งเตือนสำคัญ"
                        : "ไม่มีการแจ้งเตือนในหมวดหมู่นี้"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const IconComponent = notification.icon
                  return (
                    <Card
                      key={notification.id}
                      className={cn(
                        "cursor-pointer transition-all hover:shadow-md",
                        !notification.isRead && "bg-blue-50 border-blue-200",
                      )}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Priority Indicator */}
                          <div
                            className={cn("w-1 h-16 rounded-full flex-shrink-0", priorityColors[notification.priority])}
                          />

                          {/* Icon */}
                          <div className={cn("p-2 rounded-lg flex-shrink-0", typeColors[notification.type])}>
                            <IconComponent className="h-5 w-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3
                                  className={cn(
                                    "font-medium text-gray-900 mb-1",
                                    !notification.isRead && "font-semibold",
                                  )}
                                >
                                  {notification.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                                  {notification.priority === "urgent" && (
                                    <Badge variant="destructive" className="text-xs">
                                      เร่งด่วน
                                    </Badge>
                                  )}
                                  {notification.priority === "high" && (
                                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                      สำคัญ
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-2">
                                {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
