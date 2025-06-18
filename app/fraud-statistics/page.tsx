"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  PieChart,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Shield,
  Share2,
  Download,
  Facebook,
  Twitter,
  Copy,
  Mail,
  PenLineIcon as Line,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

// ข้อมูลสถิติจำลอง
const fraudStats = {
  totalReports: 3247,
  thisMonth: 156,
  lastMonth: 142,
  percentageChange: 9.8,
  totalAmount: 24567890,
  averageAmount: 7566,
  resolvedCases: 1876,
  pendingCases: 1371,
}

// ประเภทการโกงและจำนวน
const fraudTypeData = [
  { type: "หลอกลวงการจองที่พัก", count: 1245, percentage: 38.3, color: "bg-red-500" },
  { type: "นายหน้าปลอม", count: 876, percentage: 27.0, color: "bg-orange-500" },
  { type: "เว็บไซต์หลอกลวง", count: 432, percentage: 13.3, color: "bg-yellow-500" },
  { type: "การโอนเงินหลอกลวง", count: 387, percentage: 11.9, color: "bg-blue-500" },
  { type: "การชำระเงินปลอม", count: 198, percentage: 6.1, color: "bg-green-500" },
  { type: "อื่นๆ", count: 109, percentage: 3.4, color: "bg-purple-500" },
]

// สถิติตามภูมิภาค
const regionData = [
  { region: "กรุงเทพและปริมณฑล", count: 1456, percentage: 44.8 },
  { region: "ภาคเหนือ", count: 487, percentage: 15.0 },
  { region: "ภาคตะวันออกเฉียงเหนือ", count: 432, percentage: 13.3 },
  { region: "ภาคกลาง", count: 387, percentage: 11.9 },
  { region: "ภาคตะวันออก", count: 276, percentage: 8.5 },
  { region: "ภาคใต้", count: 209, percentage: 6.5 },
]

// สถิติตามช่วงเวลา
const timelineData = [
  { month: "ม.ค.", count: 234 },
  { month: "ก.พ.", count: 256 },
  { month: "มี.ค.", count: 278 },
  { month: "เม.ย.", count: 284 },
  { month: "พ.ค.", count: 267 },
  { month: "มิ.ย.", count: 312 },
  { month: "ก.ค.", count: 298 },
  { month: "ส.ค.", count: 321 },
  { month: "ก.ย.", count: 343 },
  { month: "ต.ค.", count: 298 },
  { month: "พ.ย.", count: 278 },
  { month: "ธ.ค.", count: 256 },
]

// ช่องทางการหลอกลวง
const channelData = [
  { channel: "Facebook", count: 1234, percentage: 38.0 },
  { channel: "Line", count: 876, percentage: 27.0 },
  { channel: "เว็บไซต์ปลอม", count: 543, percentage: 16.7 },
  { channel: "โทรศัพท์", count: 345, percentage: 10.6 },
  { channel: "อีเมล", count: 156, percentage: 4.8 },
  { channel: "อื่นๆ", count: 93, percentage: 2.9 },
]

// กลุ่มเป้าหมายที่ถูกหลอกลวง
const victimData = [
  { group: "นักท่องเที่ยว", count: 1456, percentage: 44.8 },
  { group: "คนหางาน", count: 876, percentage: 27.0 },
  { group: "นักลงทุน", count: 432, percentage: 13.3 },
  { group: "นักศึกษา", count: 287, percentage: 8.8 },
  { group: "ผู้สูงอายุ", count: 196, percentage: 6.1 },
]

// ฟังก์ชันช่วยจัดรูปแบบตัวเลข
const formatNumber = (num: number) => {
  return new Intl.NumberFormat("th-TH").format(num)
}

// ฟังก์ชันช่วยจัดรูปแบบเงิน
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function FraudStatisticsPage() {
  const [timeRange, setTimeRange] = useState("all")
  const { toast } = useToast()

  // ฟังก์ชันคัดลอกลิงก์
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "คัดลอกลิงก์แล้ว",
      description: "ลิงก์ถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
    })
  }

  // ฟังก์ชันแชร์ไปยัง social media
  const shareToSocial = (platform: string) => {
    const url = encodeURIComponent(window.location.href)
    const title = encodeURIComponent("สถิติการโกงในประเทศไทย - Check Teepak")

    let shareUrl = ""

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`
        break
      case "line":
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${url}`
        break
      case "email":
        shareUrl = `mailto:?subject=${title}&body=${url}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">สถิติการโกงในประเทศไทย</h1>
          <p className="text-muted-foreground mt-2">ข้อมูลสถิติการโกงที่รวบรวมจากรายงานที่ได้รับแจ้งผ่านระบบ Check Teepak</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ช่วงเวลาทั้งหมด" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ช่วงเวลาทั้งหมด</SelectItem>
              <SelectItem value="year">1 ปีที่ผ่านมา</SelectItem>
              <SelectItem value="6months">6 เดือนที่ผ่านมา</SelectItem>
              <SelectItem value="3months">3 เดือนที่ผ่านมา</SelectItem>
              <SelectItem value="month">เดือนนี้</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            ดาวน์โหลด PDF
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={() => shareToSocial("facebook")}>
                  <Facebook className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>แชร์ไปยัง Facebook</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={() => shareToSocial("twitter")}>
                  <Twitter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>แชร์ไปยัง Twitter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={() => shareToSocial("line")}>
                  <Line className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>แชร์ไปยัง Line</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={() => shareToSocial("email")}>
                  <Mail className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>แชร์ทางอีเมล</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={copyLink}>
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>คัดลอกลิงก์</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รายงานทั้งหมด</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(fraudStats.totalReports)}</div>
            <p className="text-xs text-muted-foreground">+{fraudStats.percentageChange}% จากเดือนที่แล้ว</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">มูลค่าความเสียหาย</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(fraudStats.totalAmount)}</div>
            <p className="text-xs text-muted-foreground">เฉลี่ย {formatCurrency(fraudStats.averageAmount)} ต่อกรณี</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กรณีที่ดำเนินการแล้ว</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(fraudStats.resolvedCases)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((fraudStats.resolvedCases / fraudStats.totalReports) * 100)}% ของรายงานทั้งหมด
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">กรณีที่รอดำเนินการ</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(fraudStats.pendingCases)}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((fraudStats.pendingCases / fraudStats.totalReports) * 100)}% ของรายงานทั้งหมด
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="types" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="types">
            <PieChart className="mr-2 h-4 w-4 hidden sm:inline-block" />
            ประเภทการโกง
          </TabsTrigger>
          <TabsTrigger value="regions">
            <MapPin className="mr-2 h-4 w-4 hidden sm:inline-block" />
            ภูมิภาค
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <TrendingUp className="mr-2 h-4 w-4 hidden sm:inline-block" />
            แนวโน้ม
          </TabsTrigger>
          <TabsTrigger value="channels">
            <Share2 className="mr-2 h-4 w-4 hidden sm:inline-block" />
            ช่องทาง
          </TabsTrigger>
          <TabsTrigger value="victims">
            <AlertTriangle className="mr-2 h-4 w-4 hidden sm:inline-block" />
            กลุ่มเป้าหมาย
          </TabsTrigger>
        </TabsList>

        {/* ประเภทการโกง */}
        <TabsContent value="types">
          <Card>
            <CardHeader>
              <CardTitle>ประเภทการโกงที่พบบ่อย</CardTitle>
              <CardDescription>สัดส่วนประเภทการโกงที่ได้รับรายงานผ่านระบบ Check Teepak</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* กราฟแท่งแนวนอน */}
                <div className="space-y-4">
                  {fraudTypeData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{formatNumber(item.count)}</Badge>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className={`${item.color} h-2.5 rounded-full`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* คำอธิบายเพิ่มเติม */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h3 className="text-amber-800 font-medium mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    ข้อควรระวัง
                  </h3>
                  <p className="text-amber-700 text-sm">
                    การหลอกลวงเกี่ยวกับการจองที่พักเป็นรูปแบบการโกงที่พบมากที่สุด โดยมักจะมีการใช้รูปภาพที่พักสวยงามในราคาถูกผิดปกติ
                    และเรียกเก็บเงินมัดจำล่วงหน้า ควรตรวจสอบความน่าเชื่อถือของผู้ให้เช่าและเว็บไซต์ก่อนทำการจองหรือโอนเงิน
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ภูมิภาค */}
        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>การกระจายตัวตามภูมิภาค</CardTitle>
              <CardDescription>สัดส่วนการโกงที่เกิดขึ้นในแต่ละภูมิภาคของประเทศไทย</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* แผนที่ประเทศไทย (จำลองด้วยกราฟแท่ง) */}
                <div className="space-y-4">
                  {regionData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.region}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{formatNumber(item.count)}</Badge>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* คำอธิบายเพิ่มเติม */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-blue-800 font-medium mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    ข้อสังเกต
                  </h3>
                  <p className="text-blue-700 text-sm">
                    กรุงเทพและปริมณฑลมีอัตราการโกงสูงที่สุด เนื่องจากเป็นพื้นที่ที่มีความต้องการที่พักสูง และมีราคาที่พักแพง
                    ทำให้เป็นเป้าหมายของมิจฉาชีพ รองลงมาคือภาคเหนือและภาคตะวันออกเฉียงเหนือ ซึ่งเป็นแหล่งท่องเที่ยวที่ได้รับความนิยม
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* แนวโน้ม */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>แนวโน้มการโกงตามช่วงเวลา</CardTitle>
              <CardDescription>จำนวนรายงานการโกงที่ได้รับในแต่ละเดือน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* กราฟเส้น (จำลองด้วยกราฟแท่ง) */}
                <div className="h-[300px] flex items-end space-x-2">
                  {timelineData.map((item, index) => {
                    const height = (item.count / Math.max(...timelineData.map((d) => d.count))) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all cursor-pointer relative group"
                          style={{ height: `${height}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {formatNumber(item.count)}
                          </div>
                        </div>
                        <span className="text-xs mt-2">{item.month}</span>
                      </div>
                    )
                  })}
                </div>

                {/* คำอธิบายเพิ่มเติม */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-green-800 font-medium mb-2 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    การวิเคราะห์แนวโน้ม
                  </h3>
                  <p className="text-green-700 text-sm">
                    จากข้อมูลพบว่าการโกงมีแนวโน้มเพิ่มขึ้นในช่วงเดือนมิถุนายนถึงกันยายน ซึ่งเป็นช่วงฤดูท่องเที่ยวและช่วงปิดเทอม
                    ทำให้มีความต้องการที่พักสูง มิจฉาชีพจึงฉวยโอกาสในช่วงนี้ ส่วนช่วงต้นปีและปลายปีมีอัตราการโกงที่ต่ำกว่า
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ช่องทาง */}
        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <CardTitle>ช่องทางการหลอกลวง</CardTitle>
              <CardDescription>ช่องทางที่มิจฉาชีพใช้ในการหลอกลวงผู้เสียหาย</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* กราฟวงกลม (จำลองด้วยกราฟแท่ง) */}
                <div className="space-y-4">
                  {channelData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.channel}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{formatNumber(item.count)}</Badge>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* คำอธิบายเพิ่มเติม */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="text-purple-800 font-medium mb-2 flex items-center">
                    <Share2 className="h-4 w-4 mr-2" />
                    ข้อควรระวัง
                  </h3>
                  <p className="text-purple-700 text-sm">
                    Facebook เป็นช่องทางที่มิจฉาชีพใช้มากที่สุด โดยมักจะสร้างเพจปลอมหรือโปรไฟล์ปลอมเพื่อหลอกลวง รองลงมาคือ Line
                    ซึ่งมักใช้ในการติดต่อและเรียกเก็บเงิน ควรตรวจสอบความน่าเชื่อถือของเพจหรือบัญชีผู้ใช้ โดยดูจากประวัติการโพสต์ จำนวนผู้ติดตาม
                    และรีวิวจากผู้ใช้จริง
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* กลุ่มเป้าหมาย */}
        <TabsContent value="victims">
          <Card>
            <CardHeader>
              <CardTitle>กลุ่มเป้าหมายที่ถูกหลอกลวง</CardTitle>
              <CardDescription>กลุ่มคนที่มักตกเป็นเหยื่อของการหลอกลวง</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {/* กราฟแท่ง */}
                <div className="space-y-4">
                  {victimData.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{item.group}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{formatNumber(item.count)}</Badge>
                          <span className="text-sm font-medium">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* คำอธิบายเพิ่มเติม */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-red-800 font-medium mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    คำแนะนำ
                  </h3>
                  <p className="text-red-700 text-sm">
                    นักท่องเที่ยวเป็นกลุ่มที่ตกเป็นเหยื่อมากที่สุด เนื่องจากมักจะไม่คุ้นเคยกับพื้นที่และต้องการที่พักในระยะเวลาสั้นๆ
                    ทำให้ตัดสินใจเร็วและขาดการตรวจสอบที่รอบคอบ ควรใช้แพลตฟอร์มการจองที่พักที่น่าเชื่อถือ
                    และหลีกเลี่ยงการโอนเงินผ่านช่องทางที่ไม่มีการคุ้มครอง
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="mt-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-6 text-white text-center">
        <h2 className="text-2xl font-bold mb-2">พบเจอการโกงหรือต้องสงสัย?</h2>
        <p className="mb-4 opacity-90">แจ้งให้เราทราบเพื่อช่วยเหลือคนอื่นๆ และสร้างชุมชนที่ปลอดภัย</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="bg-white text-red-600 hover:bg-white/90">แจ้งเหตุโกง</Button>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            ตรวจสอบมิจฉาชีพ
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>ข้อมูลสถิติอ้างอิงจากรายงานที่ได้รับแจ้งผ่านระบบ Check Teepak ณ วันที่ 1 มิถุนายน 2566</p>
        <p className="mt-1">สงวนลิขสิทธิ์ © 2566 Check Teepak. สงวนสิทธิ์ทุกประการ.</p>
      </div>
    </div>
  )
}
