"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Save,
  RotateCcw,
  Share2,
  BarChart,
  LinkIcon,
  MessageSquare,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
} from "lucide-react"

export default function AdminMarketingPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("integration")

  // Marketing Settings State
  const [marketingSettings, setMarketingSettings] = useState({
    // Social Media Integration
    facebookPixelId: "",
    googleAnalyticsId: "G-XXXXXXXXXX",
    lineOfficialId: "@checkteepak",

    // Marketing Display
    showPromotionBanner: true,
    promotionBannerText: "รับส่วนลด 20% สำหรับสมาชิกใหม่ที่สมัครภายในเดือนนี้!",
    showPopupOnExit: false,
    popupTitle: "อย่าพลาดโอกาสดีๆ",
    popupContent: "สมัครสมาชิกวันนี้รับสิทธิพิเศษมากมาย",

    // Marketing Links
    facebookPageUrl: "https://facebook.com/checkteepak",
    instagramUrl: "https://instagram.com/checkteepak",
    lineOaUrl: "https://line.me/ti/p/@checkteepak",
    tiktokUrl: "https://tiktok.com/@checkteepak",

    // Marketing Messages
    homePageHeadline: "ค้นหาและตรวจสอบที่พักออนไลน์ที่น่าเชื่อถือ",
    homePageSubheadline: "ป้องกันการโดนหลอกลวงจากมิจฉาชีพ ด้วยฐานข้อมูลที่ครอบคลุมที่สุด",
    callToActionText: "เริ่มต้นใช้งานฟรี",
    footerTagline: "Check Teepak - แพลตฟอร์มตรวจสอบความน่าเชื่อถือของนายหน้าและเจ้าของบ้าน",
  })

  const handleSaveSettings = () => {
    toast({
      title: "บันทึกการตั้งค่าการตลาดสำเร็จ",
      description: "การตั้งค่าการตลาดได้รับการอัพเดตเรียบร้อยแล้ว",
    })
  }

  const handleResetSettings = () => {
    toast({
      title: "รีเซ็ตการตั้งค่าสำเร็จ",
      description: "การตั้งค่าได้ถูกคืนค่าเป็นค่าเริ่มต้นแล้ว",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">จัดการการตลาด</h1>
          <p className="text-muted-foreground">ตั้งค่าการเชื่อมต่อทางการตลาด การแสดงผล และข้อความทางการตลาดต่างๆ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="mr-2 h-4 w-4" />
            รีเซ็ต
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="mr-2 h-4 w-4" />
            บันทึก
          </Button>
        </div>
      </div>

      {/* Marketing Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ผู้เยี่ยมชมรายเดือน</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground">+12.5% จากเดือนที่แล้ว</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อัตราการแปลง</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-muted-foreground">+0.8% จากเดือนที่แล้ว</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">การมีส่วนร่วม</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68.4%</div>
            <p className="text-xs text-muted-foreground">+5.2% จากเดือนที่แล้ว</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ยอดดูหน้าเว็บ</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">+18.3% จากเดือนที่แล้ว</p>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integration" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            การเชื่อมต่อ
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            การแสดงผล
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            ลิงก์
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            ข้อความ
          </TabsTrigger>
        </TabsList>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                การเชื่อมต่อทางการตลาด
              </CardTitle>
              <CardDescription>ตั้งค่าการเชื่อมต่อกับแพลตฟอร์มการตลาดและโซเชียลมีเดีย</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixelId"
                    value={marketingSettings.facebookPixelId}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, facebookPixelId: e.target.value })}
                    placeholder="เช่น 123456789012345"
                  />
                  <p className="text-xs text-muted-foreground">ใช้สำหรับติดตามการแปลงและประสิทธิภาพโฆษณา Facebook</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={marketingSettings.googleAnalyticsId}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, googleAnalyticsId: e.target.value })}
                    placeholder="เช่น G-XXXXXXXXXX"
                  />
                  <p className="text-xs text-muted-foreground">ใช้สำหรับวิเคราะห์การใช้งานเว็บไซต์</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lineOfficialId">Line Official ID</Label>
                  <Input
                    id="lineOfficialId"
                    value={marketingSettings.lineOfficialId}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, lineOfficialId: e.target.value })}
                    placeholder="เช่น @checkteepak"
                  />
                  <p className="text-xs text-muted-foreground">ใช้สำหรับเชื่อมต่อกับ Line Official Account</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                การแสดงผลทางการตลาด
              </CardTitle>
              <CardDescription>ตั้งค่าการแสดงผลโปรโมชั่นและแบนเนอร์ต่างๆ บนเว็บไซต์</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showPromotionBanner"
                    checked={marketingSettings.showPromotionBanner}
                    onCheckedChange={(checked) =>
                      setMarketingSettings({ ...marketingSettings, showPromotionBanner: checked })
                    }
                  />
                  <Label htmlFor="showPromotionBanner">แสดงแบนเนอร์โปรโมชั่น</Label>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="promotionBannerText">ข้อความแบนเนอร์โปรโมชั่น</Label>
                  <Input
                    id="promotionBannerText"
                    value={marketingSettings.promotionBannerText}
                    onChange={(e) =>
                      setMarketingSettings({ ...marketingSettings, promotionBannerText: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">ข้อความที่จะแสดงในแบนเนอร์โปรโมชั่นด้านบนเว็บไซต์</p>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="showPopupOnExit"
                    checked={marketingSettings.showPopupOnExit}
                    onCheckedChange={(checked) =>
                      setMarketingSettings({ ...marketingSettings, showPopupOnExit: checked })
                    }
                  />
                  <Label htmlFor="showPopupOnExit">แสดงป๊อปอัพเมื่อผู้ใช้กำลังออกจากเว็บไซต์</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="popupTitle">หัวข้อป๊อปอัพ</Label>
                    <Input
                      id="popupTitle"
                      value={marketingSettings.popupTitle}
                      onChange={(e) => setMarketingSettings({ ...marketingSettings, popupTitle: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="popupContent">เนื้อหาป๊อปอัพ</Label>
                    <Textarea
                      id="popupContent"
                      value={marketingSettings.popupContent}
                      onChange={(e) => setMarketingSettings({ ...marketingSettings, popupContent: e.target.value })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5" />
                ลิงก์ทางการตลาด
              </CardTitle>
              <CardDescription>ตั้งค่าลิงก์ปลายทางสำหรับโซเชียลมีเดียและช่องทางการตลาด</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebookPageUrl">URL เพจ Facebook</Label>
                  <Input
                    id="facebookPageUrl"
                    value={marketingSettings.facebookPageUrl}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, facebookPageUrl: e.target.value })}
                    placeholder="https://facebook.com/checkteepak"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagramUrl">URL Instagram</Label>
                  <Input
                    id="instagramUrl"
                    value={marketingSettings.instagramUrl}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/checkteepak"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lineOaUrl">URL Line Official Account</Label>
                  <Input
                    id="lineOaUrl"
                    value={marketingSettings.lineOaUrl}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, lineOaUrl: e.target.value })}
                    placeholder="https://line.me/ti/p/@checkteepak"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiktokUrl">URL TikTok</Label>
                  <Input
                    id="tiktokUrl"
                    value={marketingSettings.tiktokUrl}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, tiktokUrl: e.target.value })}
                    placeholder="https://tiktok.com/@checkteepak"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">คำแนะนำ</h4>
                <p className="text-sm text-blue-700">
                  ลิงก์เหล่านี้จะถูกใช้ในส่วน Footer และปุ่มโซเชียลมีเดียต่างๆ บนเว็บไซต์ ตรวจสอบให้แน่ใจว่าลิงก์ทำงานได้ถูกต้องก่อนบันทึก
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                ข้อความทางการตลาด
              </CardTitle>
              <CardDescription>ตั้งค่าข้อความและคำโปรยทางการตลาดที่แสดงบนเว็บไซต์</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="homePageHeadline">หัวข้อหลักหน้าแรก</Label>
                  <Input
                    id="homePageHeadline"
                    value={marketingSettings.homePageHeadline}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, homePageHeadline: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">หัวข้อหลักที่แสดงในส่วน Hero Section ของหน้าแรก</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homePageSubheadline">หัวข้อรองหน้าแรก</Label>
                  <Textarea
                    id="homePageSubheadline"
                    value={marketingSettings.homePageSubheadline}
                    onChange={(e) =>
                      setMarketingSettings({ ...marketingSettings, homePageSubheadline: e.target.value })
                    }
                    rows={2}
                  />
                  <p className="text-xs text-muted-foreground">คำอธิบายเพิ่มเติมที่แสดงใต้หัวข้อหลัก</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="callToActionText">ข้อความปุ่ม Call to Action</Label>
                  <Input
                    id="callToActionText"
                    value={marketingSettings.callToActionText}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, callToActionText: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">ข้อความที่แสดงในปุ่มหลักของเว็บไซต์</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="footerTagline">ข้อความ Tagline ส่วนท้ายเว็บไซต์</Label>
                  <Input
                    id="footerTagline"
                    value={marketingSettings.footerTagline}
                    onChange={(e) => setMarketingSettings({ ...marketingSettings, footerTagline: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">ข้อความสั้นๆ ที่อธิบายเว็บไซต์ในส่วน Footer</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">ตัวอย่างการแสดงผล</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <p>
                    <strong>หัวข้อหลัก:</strong> {marketingSettings.homePageHeadline}
                  </p>
                  <p>
                    <strong>หัวข้อรอง:</strong> {marketingSettings.homePageSubheadline}
                  </p>
                  <p>
                    <strong>ปุ่ม CTA:</strong> {marketingSettings.callToActionText}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
