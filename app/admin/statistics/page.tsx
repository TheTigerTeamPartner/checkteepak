"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Search,
  Shield,
  AlertTriangle,
  Smartphone,
  TrendingUp,
  Eye,
  Star,
  Download,
  Globe,
  BarChart3,
  Activity,
} from "lucide-react"

// Mock data สำหรับสถิติ
const overviewStats = {
  totalUsers: 15247,
  todaySearches: 2456,
  totalFraudsters: 1247,
  warningAlerts: 89,
  onlineUsers: 1234,
}

// สมาชิกยอดนิยมที่ถูกค้นหา
const popularMembers = [
  { id: 1, name: "คุณสมชาย ใจดี", type: "นายหน้า", searches: 1245, rating: 4.8, verified: true },
  { id: 2, name: "คุณวิไล รักบ้าน", type: "เจ้าของบ้าน", searches: 987, rating: 4.7, verified: true },
  { id: 3, name: "คุณดำรง ซื่อสัตย์", type: "นายหน้า", searches: 876, rating: 4.9, verified: true },
  { id: 4, name: "คุณมาลี ดีใจ", type: "เจ้าของบ้าน", searches: 654, rating: 4.6, verified: true },
  { id: 5, name: "คุณสมศรี น่าเชื่อถือ", type: "นายหน้า", searches: 543, rating: 4.8, verified: true },
  { id: 6, name: "คุณประยุทธ์ มั่นคง", type: "เจ้าของบ้าน", searches: 432, rating: 4.5, verified: true },
  { id: 7, name: "คุณสุดา ใสใจ", type: "นายหน้า", searches: 398, rating: 4.7, verified: true },
  { id: 8, name: "คุณวิชัย เก่งกาจ", type: "เจ้าของบ้าน", searches: 321, rating: 4.4, verified: true },
  { id: 9, name: "คุณนิรันดร์ ดีเด่น", type: "นายหน้า", searches: 287, rating: 4.6, verified: true },
  { id: 10, name: "คุณสมหวัง รุ่งเรือง", type: "เจ้าของบ้าน", searches: 234, rating: 4.3, verified: true },
]

// มิจฉาชีพยอดนิยมที่ถูกค้นหา
const popularFraudsters = [
  { id: 1, name: "สมชาย หลอกลวง", searches: 2345, riskLevel: "สูง", cases: 12, },
  { id: 2, name: "วิไล โกงเงิน", searches: 1876, riskLevel: "สูง", cases: 8, },
  { id: 3, name: "ดำรง ปลอมแปลง", searches: 1543, riskLevel: "กลาง", cases: 5, },
  { id: 4, name: "มาลี หลอกขาย", searches: 1234, riskLevel: "สูง", cases: 9, },
  { id: 5, name: "สมศรี ฉ้อโกง", searches: 987, riskLevel: "กลาง", cases: 4, },
  { id: 6, name: "ประยุทธ์ หลอกลวง", searches: 876, riskLevel: "สูง", cases: 7, },
  { id: 7, name: "สุดา โกงเงิน", searches: 765, riskLevel: "กลาง", cases: 3, },
  { id: 8, name: "วิชัย ปลอมแปลง", searches: 654, riskLevel: "ต่ำ", cases: 2 },
  { id: 9, name: "นิรันดร์ หลอกขาย", searches: 543, riskLevel: "กลาง", cases: 4, },
  { id: 10, name: "สมหวัง ฉ้อโกง", searches: 432, riskLevel: "ต่ำ", cases: 1, },
]

// สถิติช่องทาง
const channelStats = [
  { channel: "เว็บไซต์", count: 11234, percentage: 45, icon: Globe },
  { channel: "แอปมือถือ", count: 8765, percentage: 35, icon: Smartphone },
  { channel: "Facebook", count: 3012, percentage: 12, icon: Users },
  { channel: "Instagram", count: 1256, percentage: 5, icon: Users },
  { channel: "Line", count: 789, percentage: 3, icon: Users },
]

// สถิติประเภทการค้นหา
const searchTypeStats = [
  { type: "ค้นหาสมาชิก", count: 8456, percentage: 34 },
  { type: "ตรวจสอบมิจฉาชีพ", count: 6789, percentage: 27 },
  { type: "ค้นหาที่พัก", count: 4567, percentage: 18 },
  { type: "ตรวจสอบเบอร์โทร", count: 3234, percentage: 13 },
  { type: "ตรวจสอบบัญชีธนาคาร", count: 2012, percentage: 8 },
]

const getRiskLevelColor = (level: string) => {
  switch (level) {
    case "สูง":
      return "bg-red-100 text-red-800"
    case "กลาง":
      return "bg-yellow-100 text-yellow-800"
    case "ต่ำ":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat("th-TH").format(num)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
  }).format(amount)
}

export default function StatisticsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [timeRange, setTimeRange] = useState("7days")

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">สถิติและรายงาน</h1>
          <p className="text-muted-foreground">ภาพรวมการใช้งานระบบและข้อมูลสถิติ</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 วันที่ผ่านมา</SelectItem>
              <SelectItem value="30days">30 วันที่ผ่านมา</SelectItem>
              <SelectItem value="90days">90 วันที่ผ่านมา</SelectItem>
              <SelectItem value="1year">1 ปีที่ผ่านมา</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            ส่งออกรายงาน
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ทั้งหมด</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overviewStats.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">+12% จากเดือนที่แล้ว</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การค้นหาวันนี้</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overviewStats.todaySearches)}</div>
            <p className="text-xs text-muted-foreground">+8% จากเมื่อวาน</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มิจฉาชีพในระบบ</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overviewStats.totalFraudsters)}</div>
            <p className="text-xs text-muted-foreground">+3 รายการใหม่วันนี้</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การแจ้งเตือนภัย</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overviewStats.warningAlerts)}</div>
            <p className="text-xs text-muted-foreground">-5% จากสัปดาห์ที่แล้ว</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้ใช้ออนไลน์</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(overviewStats.onlineUsers)}</div>
            <p className="text-xs text-muted-foreground">ณ ขณะนี้</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            ภาพรวม
          </TabsTrigger>
          <TabsTrigger value="popular-members">
            <Star className="mr-2 h-4 w-4" />
            สมาชิกยอดนิยม
          </TabsTrigger>
          <TabsTrigger value="fraudsters">
            <Shield className="mr-2 h-4 w-4" />
            มิจฉาชีพ
          </TabsTrigger>
          <TabsTrigger value="usage">
            <TrendingUp className="mr-2 h-4 w-4" />
            การใช้งาน
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Channel Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>สถิติการใช้งานตามช่องทาง</CardTitle>
                <CardDescription>การเข้าถึงระบบผ่านช่องทางต่างๆ</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {channelStats.map((stat, index) => {
                  const IconComponent = stat.icon
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">{stat.channel}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="font-semibold">{formatNumber(stat.count)}</div>
                          <div className="text-sm text-muted-foreground">{stat.percentage}%</div>
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${stat.percentage}%` }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            {/* Search Type Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>ประเภทการค้นหา</CardTitle>
                <CardDescription>สถิติการค้นหาแยกตามประเภท</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {searchTypeStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{stat.type}</span>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="font-semibold">{formatNumber(stat.count)}</div>
                        <div className="text-sm text-muted-foreground">{stat.percentage}%</div>
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${stat.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ช่วงเวลายอดนิยม</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>09:00 - 12:00</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>19:00 - 22:00</span>
                    <span className="font-semibold">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>13:00 - 17:00</span>
                    <span className="font-semibold">22%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>อื่นๆ</span>
                    <span className="font-semibold">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">วันที่ใช้งานมากที่สุด</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>วันจันทร์</span>
                    <span className="font-semibold">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันศุกร์</span>
                    <span className="font-semibold">17%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันอังคาร</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>วันเสาร์</span>
                    <span className="font-semibold">14%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">อุปกรณ์ที่ใช้</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>📱 มือถือ</span>
                    <span className="font-semibold">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>💻 คอมพิวเตอร์</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>📱 แท็บเล็ต</span>
                    <span className="font-semibold">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Popular Members Tab */}
        <TabsContent value="popular-members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>สมาชิกยอดนิยมที่ถูกค้นหามากที่สุด</CardTitle>
              <CardDescription>รายชื่อสมาชิกที่ผู้ใช้ค้นหาและดูโปรไฟล์มากที่สุด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularMembers.map((member, index) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{member.name}</h3>
                          {member.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              ✓ ยืนยันแล้ว
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{member.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{formatNumber(member.searches)}</span>
                        <span className="text-sm text-muted-foreground">ครั้ง</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{member.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fraudsters Tab */}
        <TabsContent value="fraudsters" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>มิจฉาชีพที่ถูกค้นหามากที่สุด</CardTitle>
              <CardDescription>รายชื่อมิจฉาชีพที่ผู้ใช้ตรวจสอบมากที่สุด เพื่อป้องกันการถูกหลอกลวง</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularFraudsters.map((fraudster, index) => (
                  <div key={fraudster.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-red-100 text-red-800 rounded-full font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{fraudster.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getRiskLevelColor(fraudster.riskLevel)}>
                            ความเสี่ยง{fraudster.riskLevel}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{fraudster.cases} เคส</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{formatNumber(fraudster.searches)}</span>
                        <span className="text-sm text-muted-foreground">ครั้ง</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Tab */}
        <TabsContent value="usage" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours */}
            <Card>
              <CardHeader>
                <CardTitle>ช่วงเวลาการใช้งาน</CardTitle>
                <CardDescription>สถิติการใช้งานตามช่วงเวลาในวัน</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "00:00 - 06:00", usage: 5, color: "bg-blue-200" },
                    { time: "06:00 - 09:00", usage: 15, color: "bg-blue-300" },
                    { time: "09:00 - 12:00", usage: 35, color: "bg-blue-500" },
                    { time: "12:00 - 15:00", usage: 25, color: "bg-blue-400" },
                    { time: "15:00 - 18:00", usage: 20, color: "bg-blue-400" },
                    { time: "18:00 - 21:00", usage: 28, color: "bg-blue-500" },
                    { time: "21:00 - 24:00", usage: 12, color: "bg-blue-300" },
                  ].map((period, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-24 text-sm font-medium">{period.time}</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-4">
                        <div
                          className={`${period.color} h-4 rounded-full flex items-center justify-end pr-2`}
                          style={{ width: `${period.usage}%` }}
                        >
                          <span className="text-xs text-white font-medium">{period.usage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>การกระจายตามพื้นที่</CardTitle>
                <CardDescription>สถิติการใช้งานตามจังหวัด</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { province: "กรุงเทพมหานคร", users: 4567, percentage: 30 },
                    { province: "เชียงใหม่", users: 1234, percentage: 8 },
                    { province: "ภูเก็ต", users: 987, percentage: 6.5 },
                    { province: "ขอนแก่น", users: 876, percentage: 5.7 },
                    { province: "นครราชสีมา", users: 765, percentage: 5 },
                    { province: "สงขลา", users: 654, percentage: 4.3 },
                    { province: "ชลบุรี", users: 543, percentage: 3.6 },
                    { province: "อื่นๆ", users: 5621, percentage: 36.9 },
                  ].map((area, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{area.province}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-muted-foreground">{formatNumber(area.users)} คน</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${Math.min(area.percentage * 3, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{area.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ประเภทผู้ใช้</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>ผู้ใช้ทั่วไป</span>
                    <span className="font-semibold">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>นายหน้า</span>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>เจ้าของบ้าน</span>
                    <span className="font-semibold">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ความถี่การใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>ใช้ทุกวัน</span>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ใช้หลายครั้งต่อสัปดาห์</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ใช้เป็นครั้งคราว</span>
                    <span className="font-semibold">50%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ระยะเวลาการใช้งาน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{"< 5 นาที"}</span>
                    <span className="font-semibold">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>5-15 นาที</span>
                    <span className="font-semibold">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>15-30 นาที</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{"> 30 นาที"}</span>
                    <span className="font-semibold">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
