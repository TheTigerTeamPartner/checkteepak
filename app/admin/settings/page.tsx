"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Settings,
  Users,
  Search,
  Shield,
  Bell,
  Wrench,
  Save,
  RotateCcw,
  Download,
  Upload,
  Server,
  Database,
  Wifi,
  Activity,
} from "lucide-react"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Check Teepak",
    siteDescription: "แพลตฟอร์มตรวจสอบความน่าเชื่อถือของนายหน้าและเจ้าของบ้าน",
    defaultLanguage: "th",
    timezone: "Asia/Bangkok",
    maintenanceMode: false,
  })

  // User Settings State
  const [userSettings, setUserSettings] = useState({
    allowRegistration: true,
    requireEmailVerification: true,
    requirePhoneVerification: true,
    sessionDuration: 120, // minutes
    maxLoginAttempts: 5,
  })

  // Search Settings State
  const [searchSettings, setSearchSettings] = useState({
    resultsPerPage: 20,
    enableFuzzySearch: true,
    saveSearchHistory: true,
    historyRetentionDays: 90,
    enableRealTimeResults: true,
  })

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    encryptionMethod: "AES-256",
    backupFrequency: "daily",
    enableIpChecking: true,
    securityAlerts: true,
    logRetentionDays: 180,
  })

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enableAdminAlerts: true,
    notificationFrequency: "immediate",
    emailTemplate: "default",
  })

  // Advanced Settings State
  const [advancedSettings, setAdvancedSettings] = useState({
    apiRateLimit: 100, // requests per minute
    cacheDuration: 300, // seconds
    dbConnectionPool: 20,
    logLevel: "info",
    performanceMonitoring: true,
  })

  const handleSaveSettings = () => {
    toast({
      title: "บันทึกการตั้งค่าสำเร็จ",
      description: "การตั้งค่าระบบได้รับการอัพเดตเรียบร้อยแล้ว",
    })
  }

  const handleResetSettings = () => {
    toast({
      title: "รีเซ็ตการตั้งค่าสำเร็จ",
      description: "การตั้งค่าได้ถูกคืนค่าเป็นค่าเริ่มต้นแล้ว",
    })
  }

  const handleExportSettings = () => {
    toast({
      title: "ส่งออกการตั้งค่าสำเร็จ",
      description: "ไฟล์การตั้งค่าได้ถูกดาวน์โหลดแล้ว",
    })
  }

  const handleImportSettings = () => {
    toast({
      title: "นำเข้าการตั้งค่าสำเร็จ",
      description: "การตั้งค่าได้ถูกนำเข้าและอัพเดตแล้ว",
    })
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ตั้งค่าระบบ</h1>
          <p className="text-muted-foreground">จัดการการตั้งค่าและการกำหนดค่าระบบ</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="mr-2 h-4 w-4" />
            ส่งออก
          </Button>
          <Button variant="outline" onClick={handleImportSettings}>
            <Upload className="mr-2 h-4 w-4" />
            นำเข้า
          </Button>
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

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            สถานะระบบ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-green-500" />
              <span className="text-sm">เซิร์ฟเวอร์</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ออนไลน์
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-green-500" />
              <span className="text-sm">ฐานข้อมูล</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                เชื่อมต่อ
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm">API ภายนอก</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ปกติ
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <span className="text-sm">ความปลอดภัย</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                ปลอดภัย
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            ทั่วไป
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            ผู้ใช้
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            การค้นหา
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            ความปลอดภัย
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            การแจ้งเตือน
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            ขั้นสูง
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าทั่วไป</CardTitle>
              <CardDescription>การตั้งค่าพื้นฐานของเว็บไซต์</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">ชื่อเว็บไซต์</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">ภาษาเริ่มต้น</Label>
                  <Select
                    value={generalSettings.defaultLanguage}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, defaultLanguage: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="th">ไทย</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="siteDescription">คำอธิบายเว็บไซต์</Label>
                <Textarea
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">เขตเวลา</Label>
                  <Select
                    value={generalSettings.timezone}
                    onValueChange={(value) => setGeneralSettings({ ...generalSettings, timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Bangkok">Asia/Bangkok (UTC+7)</SelectItem>
                      <SelectItem value="UTC">UTC (UTC+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={generalSettings.maintenanceMode}
                    onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, maintenanceMode: checked })}
                  />
                  <Label htmlFor="maintenanceMode">โหมดบำรุงรักษา</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าผู้ใช้</CardTitle>
              <CardDescription>การจัดการบัญชีผู้ใช้และการยืนยันตัวตน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowRegistration"
                      checked={userSettings.allowRegistration}
                      onCheckedChange={(checked) => setUserSettings({ ...userSettings, allowRegistration: checked })}
                    />
                    <Label htmlFor="allowRegistration">อนุญาตการสมัครสมาชิกใหม่</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requireEmailVerification"
                      checked={userSettings.requireEmailVerification}
                      onCheckedChange={(checked) =>
                        setUserSettings({ ...userSettings, requireEmailVerification: checked })
                      }
                    />
                    <Label htmlFor="requireEmailVerification">บังคับยืนยันอีเมล</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requirePhoneVerification"
                      checked={userSettings.requirePhoneVerification}
                      onCheckedChange={(checked) =>
                        setUserSettings({ ...userSettings, requirePhoneVerification: checked })
                      }
                    />
                    <Label htmlFor="requirePhoneVerification">บังคับยืนยันเบอร์โทร</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionDuration">ระยะเวลาเซสชัน (นาที)</Label>
                    <Input
                      id="sessionDuration"
                      type="number"
                      value={userSettings.sessionDuration}
                      onChange={(e) =>
                        setUserSettings({ ...userSettings, sessionDuration: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxLoginAttempts">จำนวนการเข้าสู่ระบบผิดสูงสุด</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={userSettings.maxLoginAttempts}
                      onChange={(e) =>
                        setUserSettings({ ...userSettings, maxLoginAttempts: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search Settings */}
        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าการค้นหา</CardTitle>
              <CardDescription>การกำหนดค่าระบบค้นหาและการแสดงผล</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resultsPerPage">จำนวนผลลัพธ์ต่อหน้า</Label>
                    <Select
                      value={searchSettings.resultsPerPage.toString()}
                      onValueChange={(value) =>
                        setSearchSettings({ ...searchSettings, resultsPerPage: Number.parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 รายการ</SelectItem>
                        <SelectItem value="20">20 รายการ</SelectItem>
                        <SelectItem value="50">50 รายการ</SelectItem>
                        <SelectItem value="100">100 รายการ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="historyRetentionDays">ระยะเวลาเก็บประวัติ (วัน)</Label>
                    <Input
                      id="historyRetentionDays"
                      type="number"
                      value={searchSettings.historyRetentionDays}
                      onChange={(e) =>
                        setSearchSettings({ ...searchSettings, historyRetentionDays: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableFuzzySearch"
                      checked={searchSettings.enableFuzzySearch}
                      onCheckedChange={(checked) =>
                        setSearchSettings({ ...searchSettings, enableFuzzySearch: checked })
                      }
                    />
                    <Label htmlFor="enableFuzzySearch">การค้นหาแบบเบลอ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="saveSearchHistory"
                      checked={searchSettings.saveSearchHistory}
                      onCheckedChange={(checked) =>
                        setSearchSettings({ ...searchSettings, saveSearchHistory: checked })
                      }
                    />
                    <Label htmlFor="saveSearchHistory">บันทึกประวัติการค้นหา</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableRealTimeResults"
                      checked={searchSettings.enableRealTimeResults}
                      onCheckedChange={(checked) =>
                        setSearchSettings({ ...searchSettings, enableRealTimeResults: checked })
                      }
                    />
                    <Label htmlFor="enableRealTimeResults">ผลลัพธ์แบบเรียลไทม์</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าความปลอดภัย</CardTitle>
              <CardDescription>การจัดการความปลอดภัยและการเข้ารหัสข้อมูล</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backupFrequency">ความถี่การสำรองข้อมูล</Label>
                    <Select
                      value={securitySettings.backupFrequency}
                      onValueChange={(value) => setSecuritySettings({ ...securitySettings, backupFrequency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">ทุกชั่วโมง</SelectItem>
                        <SelectItem value="daily">รายวัน</SelectItem>
                        <SelectItem value="weekly">รายสัปดาห์</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logRetentionDays">ระยะเวลาเก็บ Log (วัน)</Label>
                    <Input
                      id="logRetentionDays"
                      type="number"
                      value={securitySettings.logRetentionDays}
                      onChange={(e) =>
                        setSecuritySettings({ ...securitySettings, logRetentionDays: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableIpChecking"
                      checked={securitySettings.enableIpChecking}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, enableIpChecking: checked })
                      }
                    />
                    <Label htmlFor="enableIpChecking">ตรวจสอบ IP Address</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="securityAlerts"
                      checked={securitySettings.securityAlerts}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, securityAlerts: checked })
                      }
                    />
                    <Label htmlFor="securityAlerts">แจ้งเตือนความปลอดภัย</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าการแจ้งเตือน</CardTitle>
              <CardDescription>การจัดการการแจ้งเตือนและการสื่อสาร</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableEmailNotifications"
                      checked={notificationSettings.enableEmailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, enableEmailNotifications: checked })
                      }
                    />
                    <Label htmlFor="enableEmailNotifications">อีเมลแจ้งเตือน</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableSmsNotifications"
                      checked={notificationSettings.enableSmsNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, enableSmsNotifications: checked })
                      }
                    />
                    <Label htmlFor="enableSmsNotifications">SMS แจ้งเตือน</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enableAdminAlerts"
                      checked={notificationSettings.enableAdminAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, enableAdminAlerts: checked })
                      }
                    />
                    <Label htmlFor="enableAdminAlerts">แจ้งเตือนผู้ดูแล</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="notificationFrequency">ความถี่การแจ้งเตือน</Label>
                    <Select
                      value={notificationSettings.notificationFrequency}
                      onValueChange={(value) =>
                        setNotificationSettings({ ...notificationSettings, notificationFrequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">ทันที</SelectItem>
                        <SelectItem value="hourly">รายชั่วโมง</SelectItem>
                        <SelectItem value="daily">รายวัน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailTemplate">เทมเพลตอีเมล</Label>
                    <Select
                      value={notificationSettings.emailTemplate}
                      onValueChange={(value) =>
                        setNotificationSettings({ ...notificationSettings, emailTemplate: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">เริ่มต้น</SelectItem>
                        <SelectItem value="modern">โมเดิร์น</SelectItem>
                        <SelectItem value="minimal">มินิมอล</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ตั้งค่าขั้นสูง</CardTitle>
              <CardDescription>การตั้งค่าเทคนิคและประสิทธิภาพระบบ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiRateLimit">API Rate Limit (ต่อนาที)</Label>
                    <Input
                      id="apiRateLimit"
                      type="number"
                      value={advancedSettings.apiRateLimit}
                      onChange={(e) =>
                        setAdvancedSettings({ ...advancedSettings, apiRateLimit: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cacheDuration">Cache Duration (วินาที)</Label>
                    <Input
                      id="cacheDuration"
                      type="number"
                      value={advancedSettings.cacheDuration}
                      onChange={(e) =>
                        setAdvancedSettings({ ...advancedSettings, cacheDuration: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dbConnectionPool">Database Connection Pool</Label>
                    <Input
                      id="dbConnectionPool"
                      type="number"
                      value={advancedSettings.dbConnectionPool}
                      onChange={(e) =>
                        setAdvancedSettings({ ...advancedSettings, dbConnectionPool: Number.parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="logLevel">Log Level</Label>
                    <Select
                      value={advancedSettings.logLevel}
                      onValueChange={(value) => setAdvancedSettings({ ...advancedSettings, logLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debug">Debug</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="performanceMonitoring"
                      checked={advancedSettings.performanceMonitoring}
                      onCheckedChange={(checked) =>
                        setAdvancedSettings({ ...advancedSettings, performanceMonitoring: checked })
                      }
                    />
                    <Label htmlFor="performanceMonitoring">Performance Monitoring</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
