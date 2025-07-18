"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  User,
  Camera,
  Phone,
  Mail,
  MessageCircle,
  Facebook,
  Instagram,
  Globe,
  CreditCard,
  Plus,
  Trash2,
  Eye,
  Save,
  Send,
  ExternalLink,
  Copy,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Edit,
  Upload,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast"

export default function ProfileManagementPage() {
  const [activeTab, setActiveTab] = useState("basic")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    basic: {
      firstName: "",
      lastName: "",
      profileImage: "",
      coverImage: "",
      address: "",
      bio: "",
      specialties: [],
    },
    contact: {
      phones: [],
      emails: [],
      lineIds: [],
    },
    marketing: {
      facebookPages: [],
      instagramAccounts: [],
      lineOAs: [],
      websites: [],
      otherChannels: [],
    },
    banking: [],
    visibility: {
      showPhone: true,
      showEmail: true,
      showLineId: true,
      showFacebook: true,
      showInstagram: true,
      showLineOA: true,
      showWebsite: true,
      showBanking: false,
    },
    pendingApprovals: [],
  })
  const [newSpecialty, setNewSpecialty] = useState("")
  const [newMarketingChannel, setNewMarketingChannel] = useState({ type: "", url: "" })
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
  })

  // Fetch approvals จาก API
  useEffect(() => {
    const fetchApprovals = async () => {
      try {
        const response = await fetch('/api/agents/approvals');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { data } = await response.json();
        // ถ้า data.status มีค่า ให้สร้าง array เดี่ยว
        const approvals = data.status ? [{ status: data.status }] : [];
        setFormData((prev) => ({
          ...prev,
          pendingApprovals: approvals,
        }));
      } catch (error) {
        console.error('Error fetching approvals:', error);
        toast({
          title: "ไม่สามารถโหลดข้อมูลการอนุมัติ",
          description: error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
          variant: "destructive",
        });
      }
    };
    fetchApprovals()
  }, [])

  const handleSaveDraft = () => {
    toast({
      title: "บันทึกร่างสำเร็จ",
      description: "ข้อมูลของคุณได้รับการบันทึกเป็นร่างแล้ว",
    })
  }

  const submitAgentProfile = async () => {
    try {
      const payload = {
        name: `${formData.basic.firstName} ${formData.basic.lastName}`.trim(),
        location: formData.basic.address,
        bio: formData.basic.bio,
        image_url: formData.basic.profileImage,
        phone: formData.contact.phones[0]?.value || "",
        email: formData.contact.emails[0]?.value || "",
        line_id: formData.contact.lineIds[0]?.value || "",
        social_facebook: formData.marketing.facebookPages[0]?.url || "",
        instagram: formData.marketing.instagramAccounts[0]?.url || "",
        website: formData.marketing.websites[0]?.url || "",
        specialties: formData.basic.specialties,
        banking: formData.banking,
        status: "pending",
      }

      const res = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "เกิดข้อผิดพลาดในการส่งข้อมูล")
      }

      // Fetch ข้อมูลสถานะใหม่หลังจากส่งข้อมูลสำเร็จ
      const fetchApprovals = async () => {
        try {
          const response = await fetch('/api/agents/approvals')
          const data = await response.json()
          setFormData((prev) => ({
            ...prev,
            pendingApprovals: data,
          }))
        } catch (error) {
          console.error('Error fetching approvals after submission:', error)
        }
      }
      fetchApprovals()

      toast({
        title: "ส่งขออนุมัติสำเร็จ",
        description: "ข้อมูลของคุณถูกส่งเข้าสู่ระบบแล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error instanceof Error ? error.message : "ไม่สามารถส่งข้อมูลได้",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            รอการอนุมัติ
          </Badge>
        )
      case "verified":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            อนุมัติแล้ว
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            ไม่อนุมัติ
          </Badge>
        )
      default:
        return null
    }
  }

  const handleSubmitForApproval = () => {
    submitAgentProfile()
  }

  const handleCopyProfileLink = () => {
    navigator.clipboard.writeText(`https://checkteepak.com/agent/somchai-jaidee`)
    toast({
      title: "คัดลอกลิงก์สำเร็จ",
      description: "ลิงก์โปรไฟล์ได้รับการคัดลอกไปยังคลิปบอร์ดแล้ว",
    })
  }

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData((prev) => ({
        ...prev,
        basic: {
          ...prev.basic,
          specialties: [...prev.basic.specialties, newSpecialty.trim()],
        },
      }))
      setNewSpecialty("")
    }
  }

  const removeSpecialty = (index) => {
    setFormData((prev) => ({
      ...prev,
      basic: {
        ...prev.basic,
        specialties: prev.basic.specialties.filter((_, i) => i !== index),
      },
    }))
  }

  const addBankAccount = () => {
    if (newBankAccount.bankName && newBankAccount.accountNumber && newBankAccount.accountName) {
      setFormData((prev) => ({
        ...prev,
        banking: [
          ...prev.banking,
          {
            id: Date.now(),
            ...newBankAccount,
            isPrimary: prev.banking.length === 0,
          },
        ],
      }))
      setNewBankAccount({ bankName: "", accountNumber: "", accountName: "" })
    }
  }

  const removeBankAccount = (id) => {
    setFormData((prev) => ({
      ...prev,
      banking: prev.banking.filter((account) => account.id !== id),
    }))
  }

  const setPrimaryAccount = (id) => {
    setFormData((prev) => ({
      ...prev,
      banking: prev.banking.map((account) => ({
        ...account,
        isPrimary: account.id === id,
      })),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">จัดการโปรไฟล์</h1>
          <p className="text-gray-600">จัดการข้อมูลโปรไฟล์ที่จะแสดงให้ลูกค้าเห็น</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleCopyProfileLink}>
            <Copy className="w-4 h-4 mr-2" />
            คัดลอกลิงก์โปรไฟล์
          </Button>
          <Button variant="outline" asChild>
            <a href="/agent/somchai-jaidee" target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              ดูตัวอย่าง
            </a>
          </Button>
        </div>
      </div>

      {/* Alert for pending approvals */}
      {Array.isArray(formData.pendingApprovals) && formData.pendingApprovals.some((item) => item.status === "pending") && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800">
              {/* เนื้อหา alert */}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="basic">ข้อมูลพื้นฐาน</TabsTrigger>
          <TabsTrigger value="contact">ข้อมูลติดต่อ</TabsTrigger>
          <TabsTrigger value="marketing">ช่องทางการตลาด</TabsTrigger>
          <TabsTrigger value="banking">ข้อมูลการเงิน</TabsTrigger>
          <TabsTrigger value="visibility">การแสดงผล</TabsTrigger>
          <TabsTrigger value="approvals">สถานะอนุมัติ</TabsTrigger>
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                ข้อมูลพื้นฐาน
              </CardTitle>
              <CardDescription>จัดการข้อมูลพื้นฐานของโปรไฟล์ เช่น ชื่อ รูปภาพ และการแนะนำตัว</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Images */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">รูปโปรไฟล์</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={formData.basic.profileImage || "/placeholder.svg"} />
                      <AvatarFallback>สช</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      เปลี่ยนรูปโปรไฟล์
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-base font-medium">รูปภาพหน้าปก</Label>
                  <div className="mt-2">
                    <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.basic.coverImage || "/placeholder.svg"}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm">
                          <Camera className="w-4 h-4 mr-2" />
                          เปลี่ยนรูปปก
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">ชื่อ</Label>
                  <Input
                    id="firstName"
                    value={formData.basic.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        basic: { ...prev.basic, firstName: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">นามสกุล</Label>
                  <Input
                    id="lastName"
                    value={formData.basic.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        basic: { ...prev.basic, lastName: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">ที่อยู่</Label>
                <Textarea
                  id="address"
                  value={formData.basic.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      basic: { ...prev.basic, address: e.target.value },
                    }))
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="bio">การแนะนำตัว</Label>
                <Textarea
                  id="bio"
                  value={formData.basic.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      basic: { ...prev.basic, bio: e.target.value },
                    }))
                  }
                  rows={4}
                  placeholder="แนะนำตัวคุณให้ลูกค้าได้รู้จัก..."
                />
              </div>

              {/* Specialties */}
              <div>
                <Label className="text-base font-medium">ความเชี่ยวชาญ</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {formData.basic.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {specialty}
                        <button onClick={() => removeSpecialty(index)} className="ml-1 hover:text-red-600">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="เพิ่มความเชี่ยวชาญ..."
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addSpecialty()}
                    />
                    <Button onClick={addSpecialty} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Information Tab */}
        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                ข้อมูลติดต่อ
              </CardTitle>
              <CardDescription>จัดการช่องทางการติดต่อของคุณ (สามารถเพิ่มได้หลายช่องทาง)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phone Numbers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    เบอร์โทรศัพท์
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          phones: [...(prev.contact.phones || []), { value: "", verified: false, id: Date.now() }],
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> เพิ่มเบอร์โทรศัพท์
                  </Button>
                </div>

                {/* List of phone numbers */}
                <div className="space-y-3">
                  {(formData.contact.phones || [{ value: formData.contact.phone, verified: false, id: 1 }]).map(
                    (phone, index) => (
                      <div key={phone.id || index} className="flex items-center gap-2">
                        <Input
                          value={phone.value}
                          onChange={(e) => {
                            const updatedPhones = [
                              ...(formData.contact.phones || [
                                { value: formData.contact.phone, verified: false, id: 1 },
                              ]),
                            ]
                            updatedPhones[index].value = e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                phones: updatedPhones,
                              },
                            }))
                          }}
                          placeholder="เบอร์โทรศัพท์"
                          className="flex-1"
                        />
                        {phone.verified ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ยืนยันแล้ว
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            ยืนยัน OTP
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 px-2"
                          onClick={() => {
                            const updatedPhones = (formData.contact.phones || []).filter((_, i) => i !== index)
                            setFormData((prev) => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                phones: updatedPhones,
                              },
                            }))
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Separator />

              {/* Email Addresses */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    อีเมล
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          emails: [...(prev.contact.emails || []), { value: "", verified: false, id: Date.now() }],
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> เพิ่มอีเมล
                  </Button>
                </div>

                {/* List of emails */}
                <div className="space-y-3">
                  {(formData.contact.emails || [{ value: formData.contact.email, verified: false, id: 1 }]).map(
                    (email, index) => (
                      <div key={email.id || index} className="flex items-center gap-2">
                        <Input
                          type="email"
                          value={email.value}
                          onChange={(e) => {
                            const updatedEmails = [
                              ...(formData.contact.emails || [
                                { value: formData.contact.email, verified: false, id: 1 },
                              ]),
                            ]
                            updatedEmails[index].value = e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                emails: updatedEmails,
                              },
                            }))
                          }}
                          placeholder="อีเมล"
                          className="flex-1"
                        />
                        {email.verified ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ยืนยันแล้ว
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            ส่งลิงก์ยืนยัน
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 px-2"
                          onClick={() => {
                            const updatedEmails = (formData.contact.emails || []).filter((_, i) => i !== index)
                            setFormData((prev) => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                emails: updatedEmails,
                              },
                            }))
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Separator />

              {/* Line IDs */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Line ID
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        contact: {
                          ...prev.contact,
                          lineIds: [...(prev.contact.lineIds || []), { value: "", verified: false, id: Date.now() }],
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> เพิ่ม Line ID
                  </Button>
                </div>

                {/* List of Line IDs */}
                <div className="space-y-3">
                  {(formData.contact.lineIds || [{ value: formData.contact.lineId, verified: false, id: 1 }]).map(
                    (lineId, index) => (
                      <div key={lineId.id || index} className="flex items-center gap-2">
                        <Input
                          value={lineId.value}
                          onChange={(e) => {
                            const updatedLineIds = [
                              ...(formData.contact.lineIds || [
                                { value: formData.contact.lineId, verified: false, id: 1 },
                              ]),
                            ]
                            updatedLineIds[index].value = e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                lineIds: updatedLineIds,
                              },
                            }))
                          }}
                          placeholder="Line ID"
                          className="flex-1"
                        />
                        {lineId.verified ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ยืนยันแล้ว
                          </Badge>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              ยืนยัน
                            </Button>
                            <Button variant="outline" size="sm">
                              <Upload className="w-4 h-4 mr-1" /> แนบหลักฐาน
                            </Button>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 px-2"
                          onClick={() => {
                            const updatedLineIds = (formData.contact.lineIds || []).filter((_, i) => i !== index)
                            setFormData((prev) => ({
                              ...prev,
                              contact: {
                                ...prev.contact,
                                lineIds: updatedLineIds,
                              },
                            }))
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">การยืนยันช่องทางการติดต่อ</h4>
                    <p className="text-sm text-blue-700 mt-1">ทุกช่องทางการติดต่อจำเป็นต้องได้รับการยืนยันเพื่อความน่าเชื่อถือ โดย:</p>
                    <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                      <li>เบอร์โทรศัพท์: ยืนยันผ่าน SMS OTP</li>
                      <li>อีเมล: ยืนยันผ่านลิงก์ที่ส่งไปยังอีเมลของคุณ</li>
                      <li>Line ID: ยืนยันผ่านการแอดเพื่อนกับบัญชีทางการ หรือแนบภาพหน้าจอ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketing Channels Tab */}
        <TabsContent value="marketing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                ช่องทางการตลาด
              </CardTitle>
              <CardDescription>จัดการช่องทางการตลาดและโซเชียลมีเดียของคุณ (สามารถเพิ่มได้หลายช่องทาง)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Facebook Pages */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Facebook className="w-4 h-4" />
                    Facebook Page
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        marketing: {
                          ...prev.marketing,
                          facebookPages: [
                            ...(prev.marketing.facebookPages || []),
                            { url: "", verified: false, id: Date.now() },
                          ],
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> เพิ่ม Facebook Page
                  </Button>
                </div>

                {/* List of Facebook Pages */}
                <div className="space-y-3">
                  {(
                    formData.marketing.facebookPages || [{ url: formData.marketing.facebook, verified: false, id: 1 }]
                  ).map((page, index) => (
                    <div key={page.id || index} className="flex items-center gap-2">
                      <Input
                        value={page.url}
                        onChange={(e) => {
                          const updatedPages = [
                            ...(formData.marketing.facebookPages || [
                              { url: formData.marketing.facebook, verified: false, id: 1 },
                            ]),
                          ]
                          updatedPages[index].url = e.target.value
                          setFormData((prev) => ({
                            ...prev,
                            marketing: {
                              ...prev.marketing,
                              facebookPages: updatedPages,
                            },
                          }))
                        }}
                        placeholder="https://facebook.com/your-page"
                        className="flex-1"
                      />
                      {page.verified ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          ยืนยันแล้ว
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-1" /> แนบหลักฐาน
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 px-2"
                        onClick={() => {
                          const updatedPages = (formData.marketing.facebookPages || []).filter((_, i) => i !== index)
                          setFormData((prev) => ({
                            ...prev,
                            marketing: {
                              ...prev.marketing,
                              facebookPages: updatedPages,
                            },
                          }))
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Instagram Accounts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        marketing: {
                          ...prev.marketing,
                          instagramAccounts: [
                            ...(prev.marketing.instagramAccounts || []),
                            { url: "", verified: false, id: Date.now() },
                          ],
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> เพิ่ม Instagram
                  </Button>
                </div>

                {/* List of Instagram Accounts */}
                <div className="space-y-3">
                  {(
                    formData.marketing.instagramAccounts || [
                      { url: formData.marketing.instagram, verified: false, id: 1 },
                    ]
                  ).map((account, index) => (
                    <div key={account.id || index} className="flex items-center gap-2">
                      <Input
                        value={account.url}
                        onChange={(e) => {
                          const updatedAccounts = [
                            ...(formData.marketing.instagramAccounts || [
                              { url: formData.marketing.instagram, verified: false, id: 1 },
                            ]),
                          ]
                          updatedAccounts[index].url = e.target.value
                          setFormData((prev) => ({
                            ...prev,
                            marketing: {
                              ...prev.marketing,
                              instagramAccounts: updatedAccounts,
                            },
                          }))
                        }}
                        placeholder="https://instagram.com/your-account"
                        className="flex-1"
                      />
                      {account.verified ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          ยืนยันแล้ว
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-1" /> แนบหลักฐาน
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 px-2"
                        onClick={() => {
                          const updatedAccounts = (formData.marketing.instagramAccounts || []).filter(
                            (_, i) => i !== index,
                          )
                          setFormData((prev) => ({
                            ...prev,
                            marketing: {
                              ...prev.marketing,
                              instagramAccounts: updatedAccounts,
                            },
                          }))
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Line OA */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Line Official Account
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        marketing: {
                          ...prev.marketing,
                          lineOAs: [...(prev.marketing.lineOAs || []), { value: "", verified: false, id: Date.now() }],
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> เพิ่ม Line OA
                  </Button>
                </div>

                {/* List of Line OAs */}
                <div className="space-y-3">
                  {(formData.marketing.lineOAs || [{ value: formData.marketing.lineOA, verified: false, id: 1 }]).map(
                    (lineOA, index) => (
                      <div key={lineOA.id || index} className="flex items-center gap-2">
                        <Input
                          value={lineOA.value}
                          onChange={(e) => {
                            const updatedLineOAs = [
                              ...(formData.marketing.lineOAs || [
                                { value: formData.marketing.lineOA, verified: false, id: 1 },
                              ]),
                            ]
                            updatedLineOAs[index].value = e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              marketing: {
                                ...prev.marketing,
                                lineOAs: updatedLineOAs,
                              },
                            }))
                          }}
                          placeholder="@your-line-oa"
                          className="flex-1"
                        />
                        {lineOA.verified ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ยืนยันแล้ว
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-1" /> แนบหลักฐาน
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 px-2"
                          onClick={() => {
                            const updatedLineOAs = (formData.marketing.lineOAs || []).filter((_, i) => i !== index)
                            setFormData((prev) => ({
                              ...prev,
                              marketing: {
                                ...prev.marketing,
                                lineOAs: updatedLineOAs,
                              },
                            }))
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Separator />

              {/* Websites */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    เว็บไซต์
                  </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        marketing: {
                          ...prev.marketing,
                          websites: [...(prev.marketing.websites || []), { url: "", verified: false, id: Date.now() }],
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> เพิ่มเว็บไซต์
                  </Button>
                </div>

                {/* List of Websites */}
                <div className="space-y-3">
                  {(formData.marketing.websites || [{ url: formData.marketing.website, verified: false, id: 1 }]).map(
                    (website, index) => (
                      <div key={website.id || index} className="flex items-center gap-2">
                        <Input
                          value={website.url}
                          onChange={(e) => {
                            const updatedWebsites = [
                              ...(formData.marketing.websites || [
                                { url: formData.marketing.website, verified: false, id: 1 },
                              ]),
                            ]
                            updatedWebsites[index].url = e.target.value
                            setFormData((prev) => ({
                              ...prev,
                              marketing: {
                                ...prev.marketing,
                                websites: updatedWebsites,
                              },
                            }))
                          }}
                          placeholder="https://your-website.com"
                          className="flex-1"
                        />
                        {website.verified ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            ยืนยันแล้ว
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm">
                            <Upload className="w-4 h-4 mr-1" /> แนบหลักฐาน
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 px-2"
                          onClick={() => {
                            const updatedWebsites = (formData.marketing.websites || []).filter((_, i) => i !== index)
                            setFormData((prev) => ({
                              ...prev,
                              marketing: {
                                ...prev.marketing,
                                websites: updatedWebsites,
                              },
                            }))
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <Separator />

              {/* Other Marketing Channels */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-base font-medium">ช่องทางการตลาดอื่นๆ</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        marketing: {
                          ...prev.marketing,
                          otherChannels: [
                            ...(prev.marketing.otherChannels || []),
                            { type: "", url: "", verified: false, id: Date.now() },
                          ],
                        },
                      }))
                    }}
                  >
                    <Plus className="w-4 h-4 mr-1" /> เพิ่มช่องทาง
                  </Button>
                </div>

                {/* List of Other Channels */}
                <div className="space-y-3">
                  {(formData.marketing.otherChannels || []).map((channel, index) => (
                    <div key={channel.id} className="flex items-center gap-2">
                      <Select
                        value={channel.type}
                        onValueChange={(value) => {
                          const updatedChannels = [...(formData.marketing.otherChannels || [])]
                          updatedChannels[index].type = value
                          setFormData((prev) => ({
                            ...prev,
                            marketing: {
                              ...prev.marketing,
                              otherChannels: updatedChannels,
                            },
                          }))
                        }}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="เลือกประเภท" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="other">อื่นๆ</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="URL หรือ ID"
                        value={channel.url}
                        onChange={(e) => {
                          const updatedChannels = [...(formData.marketing.otherChannels || [])]
                          updatedChannels[index].url = e.target.value
                          setFormData((prev) => ({
                            ...prev,
                            marketing: {
                              ...prev.marketing,
                              otherChannels: updatedChannels,
                            },
                          }))
                        }}
                        className="flex-1"
                      />
                      {channel.verified ? (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          ยืนยันแล้ว
                        </Badge>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-1" /> แนบหลักฐาน
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 px-2"
                        onClick={() => {
                          const updatedChannels = (formData.marketing.otherChannels || []).filter((_, i) => i !== index)
                          setFormData((prev) => ({
                            ...prev,
                            marketing: {
                              ...prev.marketing,
                              otherChannels: updatedChannels,
                            },
                          }))
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">การยืนยันช่องทางการตลาด</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      ทุกช่องทางการตลาดจำเป็นต้องได้รับการยืนยันเพื่อความน่าเชื่อถือ โดยแนบหลักฐานดังนี้:
                    </p>
                    <ul className="text-sm text-blue-700 mt-1 list-disc list-inside space-y-1">
                      <li>Facebook Page: ภาพหน้าจอที่แสดงว่าคุณเป็นแอดมิน</li>
                      <li>Instagram: ภาพหน้าจอโปรไฟล์ที่ล็อกอินแล้ว</li>
                      <li>Line OA: ภาพหน้าจอหลังบ้านที่แสดงว่าคุณเป็นเจ้าของ</li>
                      <li>เว็บไซต์: เพิ่มโค้ดยืนยันที่เราให้ไว้ในเว็บไซต์ของคุณ</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Banking Information Tab */}
        <TabsContent value="banking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                ข้อมูลการเงิน
              </CardTitle>
              <CardDescription>จัดการบัญชีธนาคารสำหรับรับเงิน</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Bank Accounts */}
              <div className="space-y-4">
                {formData.banking.map((account) => (
                  <Card key={account.id} className={account.isPrimary ? "border-teal-200 bg-teal-50" : ""}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{account.bankName}</span>
                            {account.isPrimary && (
                              <Badge variant="default" className="bg-teal-600">
                                บัญชีหลัก
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {account.accountNumber} - {account.accountName}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!account.isPrimary && (
                            <Button variant="outline" size="sm" onClick={() => setPrimaryAccount(account.id)}>
                              ตั้งเป็นหลัก
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>ลบบัญชีธนาคาร</AlertDialogTitle>
                                <AlertDialogDescription>
                                  คุณแน่ใจหรือไม่ที่จะลบบัญชีธนาคารนี้? การดำเนินการนี้ไม่สามารถยกเลิกได้
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => removeBankAccount(account.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  ลบ
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Separator />

              {/* Add New Bank Account */}
              <div>
                <Label className="text-base font-medium">เพิ่มบัญชีธนาคารใหม่</Label>
                <div className="mt-2 space-y-3">
                  <Select
                    value={newBankAccount.bankName}
                    onValueChange={(value) => setNewBankAccount((prev) => ({ ...prev, bankName: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกธนาคาร" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย</SelectItem>
                      <SelectItem value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ</SelectItem>
                      <SelectItem value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์</SelectItem>
                      <SelectItem value="ธนาคารกรุงไทย">ธนาคารกรุงไทย</SelectItem>
                      <SelectItem value="ธนาคารทหารไทยธนชาต">ธนาคารทหารไทยธนชาต</SelectItem>
                      <SelectItem value="ธนาคารกรุงศรีอยุธยา">ธนาคารกรุงศรีอยุธยา</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="หมายเลขบัญชี"
                    value={newBankAccount.accountNumber}
                    onChange={(e) => setNewBankAccount((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  />
                  <Input
                    placeholder="ชื่อบัญชี"
                    value={newBankAccount.accountName}
                    onChange={(e) => setNewBankAccount((prev) => ({ ...prev, accountName: e.target.value }))}
                  />
                  <Button onClick={addBankAccount} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    เพิ่มบัญชีธนาคาร
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Visibility Settings Tab */}
        <TabsContent value="visibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                การตั้งค่าการแสดงผล
              </CardTitle>
              <CardDescription>เลือกข้อมูลที่จะแสดงให้ลูกค้าเห็นในโปรไฟล์สาธารณะ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Visibility */}
              <div>
                <h3 className="font-medium mb-4">ข้อมูลติดต่อ</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>เบอร์โทรศัพท์</span>
                    </div>
                    <Switch
                      checked={formData.visibility.showPhone}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: { ...prev.visibility, showPhone: checked },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>อีเมล</span>
                    </div>
                    <Switch
                      checked={formData.visibility.showEmail}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: { ...prev.visibility, showEmail: checked },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Line ID</span>
                    </div>
                    <Switch
                      checked={formData.visibility.showLineId}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: { ...prev.visibility, showLineId: checked },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Marketing Channels Visibility */}
              <div>
                <h3 className="font-medium mb-4">ช่องทางการตลาด</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-4 h-4" />
                      <span>Facebook</span>
                    </div>
                    <Switch
                      checked={formData.visibility.showFacebook}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: { ...prev.visibility, showFacebook: checked },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-4 h-4" />
                      <span>Instagram</span>
                    </div>
                    <Switch
                      checked={formData.visibility.showInstagram}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: { ...prev.visibility, showInstagram: checked },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Line Official Account</span>
                    </div>
                    <Switch
                      checked={formData.visibility.showLineOA}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: { ...prev.visibility, showLineOA: checked },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>เว็บไซต์</span>
                    </div>
                    <Switch
                      checked={formData.visibility.showWebsite}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: { ...prev.visibility, showWebsite: checked },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Banking Visibility */}
              <div>
                <h3 className="font-medium mb-4">ข้อมูลการเงิน</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span>ข้อมูลบัญชีธนาคาร</span>
                    </div>
                    <Switch
                      checked={formData.visibility.showBanking}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          visibility: { ...prev.visibility, showBanking: checked },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Approval Status Tab */}
        <TabsContent value="approvals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                สถานะการอนุมัติ
              </CardTitle>
              <CardDescription>ติดตามสถานะการอนุมัติข้อมูลที่คุณส่งไป</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.pendingApprovals.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {item.type === "contact" && "ข้อมูลติดต่อ"}
                            {item.type === "marketing" && "ช่องทางการตลาด"}
                            {item.type === "basic" && "ข้อมูลพื้นฐาน"}
                          </span>
                          <span className="text-gray-500">- {item.field}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            <span className="font-medium">เดิม:</span> {item.oldValue}
                          </p>
                          <p>
                            <span className="font-medium">ใหม่:</span> {item.newValue}
                          </p>
                        </div>
                        <div className="text-xs text-gray-500">
                          ส่งเมื่อ:{" "}
                          {new Date(item.submittedAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                        {item.status === "rejected" && item.rejectionReason && (
                          <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                            <span className="font-medium">เหตุผลที่ไม่อนุมัติ:</span> {item.rejectionReason}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(item.status)}
                        {item.status === "rejected" && (
                          <Button variant="outline" size="sm">
                            <Edit className="w-3 h-3 mr-1" />
                            แก้ไขใหม่
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {formData.pendingApprovals.length === 0 && (
                  <div className="text-center py-8 text-gray-500">ไม่มีข้อมูลที่รอการอนุมัติ</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
        <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
          <Save className="w-4 h-4 mr-2" />
          บันทึกร่าง
        </Button>
        <Button onClick={handleSubmitForApproval} className="flex-1">
          <Send className="w-4 h-4 mr-2" />
          ส่งขออนุมัติ
        </Button>
      </div>
    </div>
  )
}