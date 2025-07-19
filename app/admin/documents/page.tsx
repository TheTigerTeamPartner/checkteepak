"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Globe,
  CreditCard,
  Building,
  Calendar,
  MapPin,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface AgentData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: "pending" | "verified" | "scammer"
  submitted_at: string
  social_facebook: string
  instagram: string
  line_id: string
  website: string
  banking: { bankName: string; accountNumber: string; status: string } | null
}

export default function DocumentsPage() {
  const [agents, setAgents] = useState<AgentData[]>([])
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/agents/approvals?full=true")
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const { data } = await response.json()
        console.log("Fetched agents:", data) // Log เพื่อตรวจสอบข้อมูล
        const formattedAgents = data.map((agent: any) => ({
          id: agent.id,
          name: agent.name || "ไม่ระบุชื่อ",
          email: agent.email || "",
          phone: agent.phone || "",
          location: agent.location || "",
          status: agent.status || "pending",
          submitted_at: agent.submitted_at || new Date().toISOString().split("T")[0],
          social_facebook: agent.social_facebook || "",
          instagram: agent.instagram || "",
          line_id: agent.line_id || "",
          website: agent.website || "",
          banking: agent.banking || { bankName: "", accountNumber: "", status: "pending" },
        }))
        setAgents(formattedAgents)
      } catch (error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลสมาชิกได้ กรุณาลองใหม่อีกครั้ง",
          variant: "destructive",
        })
        console.error("Fetch error:", error)
      }
    }
    fetchAgents()
  }, [toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
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
      case "scammer":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            ไม่อนุมัติ
          </Badge>
        )
      default:
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">
            <AlertCircle className="h-3 w-3 mr-1" />
            ข้อมูลไม่ครบ
          </Badge>
        )
    }
  }

  const getTypeBadge = () => (
    <Badge variant="outline" className="bg-blue-50 text-blue-700">
      นายหน้า
    </Badge>
  )

  const handleViewDetails = (agent: AgentData) => {
    setSelectedAgent(agent)
    setIsDetailDialogOpen(true)
  }

  const handleCallAgent = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const handleApproveAll = async () => {
    if (!selectedAgent) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "verified" }),
        credentials: "include", // รับประกันการส่ง cookie
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const updatedData = await response.json();
      console.log("API Response:", updatedData); // Log เพื่อตรวจสอบ
      const updatedAgent = { ...selectedAgent, status: "verified" };
      setSelectedAgent(updatedAgent);
      setAgents(agents.map(a => a.id === selectedAgent.id ? updatedAgent : a));
      toast({ title: "สำเร็จ", description: "อนุมัติข้อมูลทั้งหมดเรียบร้อยแล้ว", variant: "success" });
    } catch (error) {
      console.error("Approve error:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: `ไม่สามารถอนุมัติได้ กรุณาลองใหม่อีกครั้ง (${error.message})`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReject = async () => {
    if (!selectedAgent) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/agents/${selectedAgent.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "scammer", reason: rejectionReason }),
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const updatedData = await response.json();
      console.log("API Response:", updatedData);
      const updatedAgent = { ...selectedAgent, status: "scammer" };
      setSelectedAgent(updatedAgent);
      setAgents(agents.map(a => a.id === selectedAgent.id ? updatedAgent : a));
      toast({ title: "สำเร็จ", description: `ไม่อนุมัติข้อมูลเรียบร้อยแล้ว เหตุผล: ${rejectionReason || "ไม่ระบุ"}`, variant: "success" });
      setRejectionReason("");
    } catch (error) {
      console.error("Reject error:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: `ไม่สามารถไม่อนุมัติได้ กรุณาลองใหม่อีกครั้ง (${error.message})`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ตรวจสอบข้อมูลสมาชิก</h2>
          <p className="text-muted-foreground">ตรวจสอบและอนุมัติข้อมูลองค์ประกอบต่างๆ ของสมาชิกที่ส่งเข้ามา</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            ประวัติการตรวจสอบ
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            ส่งออกรายงาน
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">รอการตรวจสอบ</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter(a => a.status === "pending").length}</div>
            <p className="text-xs text-muted-foreground">+3 สมาชิกใหม่วันนี้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">อนุมัติแล้ว</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter(a => a.status === "verified").length}</div>
            <p className="text-xs text-muted-foreground">+12 สมาชิกในสัปดาห์นี้</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ไม่อนุมัติ</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter(a => a.status === "scammer").length}</div>
            <p className="text-xs text-muted-foreground">-1 จากสัปดาห์ที่แล้ว</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ข้อมูลไม่ครบ</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">รอการส่งข้อมูลเพิ่มเติม</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <TabsList>
            <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
            <TabsTrigger value="contact-info">ข้อมูลติดต่อ</TabsTrigger>
            <TabsTrigger value="social-media">Social Media</TabsTrigger>
            <TabsTrigger value="marketing">ช่องทางการตลาด</TabsTrigger>
            <TabsTrigger value="legal-docs">เอกสารทางกฎหมาย</TabsTrigger>
            <TabsTrigger value="payment">ช่องทางการชำระเงิน</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="ค้นหาสมาชิก..." className="w-full md:w-[200px] pl-8" />
            </div>
            <Select defaultValue="pending">
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="pending">รอการตรวจสอบ</SelectItem>
                <SelectItem value="verified">อนุมัติแล้ว</SelectItem>
                <SelectItem value="scammer">ไม่อนุมัติ</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>รายชื่อสมาชิกที่ส่งข้อมูลเข้ามา</CardTitle>
              <CardDescription>สมาชิกที่ส่งข้อมูลเพื่อขอการตรวจสอบและอนุมัติ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agents.map((agent) => (
                  <div
                    key={agent.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src="/placeholder.svg"
                          alt={agent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900">{agent.name}</h3>
                          {getTypeBadge()}
                          {getStatusBadge(agent.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span>{agent.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{agent.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{agent.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>ส่งเมื่อ: {agent.submitted_at}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewDetails(agent)}>
                        <Eye className="h-4 w-4 mr-1" />
                        ดูรายละเอียด
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCallAgent(agent.phone)}
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        โทร
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact-info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลติดต่อ</CardTitle>
              <CardDescription>เบอร์โทรศัพท์ อีเมล และ Line ID</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAgent && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">เบอร์โทรศัพท์</h4>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>{selectedAgent.phone}</span>
                      <Badge variant="outline">รอยืนยัน</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">อีเมล</h4>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>{selectedAgent.email}</span>
                      <Badge variant="outline">รอยืนยัน</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Line ID</h4>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <span>{selectedAgent.line_id}</span>
                      <Badge variant="outline">รอยืนยัน</Badge>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social-media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Facebook, Instagram, Line, Website</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAgent && (
                <div className="space-y-4">
                  {[
                    { platform: "facebook", value: selectedAgent.social_facebook },
                    { platform: "instagram", value: selectedAgent.instagram },
                    { platform: "lineOA", value: selectedAgent.line_id },
                    { platform: "website", value: selectedAgent.website },
                  ].map(({ platform, value }) => (
                    <div key={platform} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        {platform === "facebook" && <Facebook className="h-4 w-4" />}
                        {platform === "instagram" && <Instagram className="h-4 w-4" />}
                        {platform === "lineOA" && <MessageCircle className="h-4 w-4" />}
                        {platform === "website" && <Globe className="h-4 w-4" />}
                        <span className="capitalize">{platform}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{value || "ไม่ได้ระบุ"}</span>
                        {value && <Button size="sm" variant="outline">อนุมัติ</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ช่องทางการตลาด</CardTitle>
              <CardDescription>ข้อมูลการตลาด</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูลการตลาด</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal-docs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>เอกสารทางกฎหมาย</CardTitle>
              <CardDescription>ใบรับรอง</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">ยังไม่มีข้อมูลเอกสาร</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>ช่องทางการชำระเงิน</CardTitle>
              <CardDescription>บัญชีธนาคาร</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAgent && selectedAgent.banking && (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <h4 className="font-medium">บัญชีธนาคาร</h4>
                      <p className="text-sm text-gray-600">
                        {selectedAgent.banking.bankName} - {selectedAgent.banking.accountNumber}
                      </p>
                      <p className="text-sm text-gray-600">สถานะ: {selectedAgent.banking.status}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">อนุมัติ</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดข้อมูลสมาชิก</DialogTitle>
            <DialogDescription>ตรวจสอบและอนุมัติข้อมูลองค์ประกอบต่างๆ ของสมาชิก</DialogDescription>
          </DialogHeader>
          {selectedAgent && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 rounded-full overflow-hidden">
                  <img src="/placeholder.svg" alt={selectedAgent.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedAgent.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeBadge()}
                    {getStatusBadge(selectedAgent.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                    <span>{selectedAgent.email}</span>
                    <span>{selectedAgent.phone}</span>
                    <span>{selectedAgent.location}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCallAgent(selectedAgent.phone)}
                  className="text-blue-600 border-blue-300 hover:bg-blue-50"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  โทรติดต่อ
                </Button>
              </div>

              <Tabs defaultValue="contact" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="contact">ข้อมูลติดต่อ</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="marketing">การตลาด</TabsTrigger>
                  <TabsTrigger value="legal">เอกสารกฎหมาย</TabsTrigger>
                  <TabsTrigger value="payment">การชำระเงิน</TabsTrigger>
                </TabsList>
                <TabsContent value="contact">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">เบอร์โทรศัพท์</h4>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>{selectedAgent.phone}</span>
                        <Badge variant="outline">รอยืนยัน</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">อีเมล</h4>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>{selectedAgent.email}</span>
                        <Badge variant="outline">รอยืนยัน</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Line ID</h4>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>{selectedAgent.line_id}</span>
                        <Badge variant="outline">รอยืนยัน</Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="social">
                  <div className="space-y-4">
                    {[
                      { platform: "facebook", value: selectedAgent.social_facebook },
                      { platform: "instagram", value: selectedAgent.instagram },
                      { platform: "lineOA", value: selectedAgent.line_id },
                      { platform: "website", value: selectedAgent.website },
                    ].map(({ platform, value }) => (
                      <div key={platform} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          {platform === "facebook" && <Facebook className="h-4 w-4" />}
                          {platform === "instagram" && <Instagram className="h-4 w-4" />}
                          {platform === "lineOA" && <MessageCircle className="h-4 w-4" />}
                          {platform === "website" && <Globe className="h-4 w-4" />}
                          <span className="capitalize">{platform}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">{value || "ไม่ได้ระบุ"}</span>
                          {value && <Button size="sm" variant="outline">อนุมัติ</Button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="marketing">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">ช่องทางการตลาดออนไลน์</h4>
                      <p className="text-sm text-gray-600">ยังไม่มีข้อมูล</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="legal">
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">ใบรับรอง</h4>
                      <p className="text-sm text-gray-600">ยังไม่มีข้อมูล</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="payment">
                  <div className="space-y-4">
                    {selectedAgent.banking && (
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5" />
                          <div>
                            <h4 className="font-medium">บัญชีธนาคาร</h4>
                            <p className="text-sm text-gray-600">
                              {selectedAgent.banking.bankName} - {selectedAgent.banking.accountNumber}
                            </p>
                            <p className="text-sm text-gray-600">สถานะ: {selectedAgent.banking.status}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">อนุมัติ</Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason">หมายเหตุ/เหตุผลการไม่อนุมัติ (ถ้ามี)</Label>
                  <Textarea
                    id="rejection-reason"
                    placeholder="ระบุหมายเหตุหรือเหตุผลหากไม่อนุมัติ..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleApproveAll}
                    disabled={isLoading}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    อนุมัติทั้งหมด
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                    onClick={handleReject}
                    disabled={isLoading}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    ไม่อนุมัติ
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCallAgent(selectedAgent.phone)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    disabled={isLoading}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    โทรติดต่อสมาชิก
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}