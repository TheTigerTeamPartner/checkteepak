"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, ShieldCheck, CheckCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VerifyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // ข้อมูลส่วนตัว
    ownerName: "",
    idNumber: "",
    phone: "",
    email: "",
    address: "",

    // ข้อมูลที่พัก
    accommodationName: "",
    accommodationType: "",
    accommodationAddress: "",
    accommodationPhone: "",
    website: "",
    facebookPage: "",
    bankAccount: "",

    // เอกสาร
    idCard: null as File | null,
    businessLicense: null as File | null,
    propertyDocument: null as File | null,

    // รูปภาพที่พัก
    images: [] as File[],

    // ฟีเจอร์
    features: [] as string[],

    // ข้อตกลง
    agreeTerms: false,
  })

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData({ ...formData, [field]: file })
  }

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      const newImages = Array.from(files)
      setFormData({ ...formData, images: [...formData.images, ...newImages] })
    }
  }

  const handleFeatureToggle = (feature: string) => {
    const updatedFeatures = formData.features.includes(feature)
      ? formData.features.filter((f) => f !== feature)
      : [...formData.features, feature]
    setFormData({ ...formData, features: updatedFeatures })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // ในระบบจริงจะส่งข้อมูลไป API
    console.log("Verification submitted:", formData)
    alert("ส่งคำขอยืนยันตัวตนเรียบร้อยแล้ว ทีมงานจะตรวจสอบและติดต่อกลับภายใน 3-5 วันทำการ")
  }

  const availableFeatures = [
    "Wi-Fi ฟรี",
    "ที่จอดรถฟรี",
    "สระว่ายน้ำ",
    "ฟิตเนส",
    "สปา",
    "ร้านอาหาร",
    "บาร์",
    "ห้องประชุม",
    "บริการซักรีด",
    "รูมเซอร์วิส",
    "รับส่งสนามบิน",
    "เครื่องปรับอากาศ",
    "ทีวี",
    "ตู้เย็น",
    "ตู้นิรภัย",
    "เครื่องทำน้ำอุ่น",
    "ระเบียง",
    "วิวทะเล",
    "วิวภูเขา",
    "วิวสวน",
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ยืนยันตัวตนเจ้าของที่พัก</h1>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <div className="flex items-start">
            <ShieldCheck className="h-5 w-5 text-teal-600 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-teal-800">ประโยชน์ของการยืนยันตัวตน</h3>
              <ul className="text-sm text-teal-700 mt-1 space-y-1">
                <li>• ได้รับตรารับรองความน่าเชื่อถือ</li>
                <li>• เพิ่มความมั่นใจให้กับลูกค้า</li>
                <li>• จัดการข้อมูลที่พักได้เอง</li>
                <li>• ตอบกลับรีวิวและข้อความจากลูกค้า</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>แบบฟอร์มยืนยันตัวตน</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">ข้อมูลส่วนตัว</TabsTrigger>
              <TabsTrigger value="accommodation">ข้อมูลที่พัก</TabsTrigger>
              <TabsTrigger value="documents">เอกสาร</TabsTrigger>
              <TabsTrigger value="images">รูปภาพ</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ownerName">ชื่อ-นามสกุล *</Label>
                  <Input
                    id="ownerName"
                    placeholder="ชื่อเจ้าของที่พัก"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="idNumber">เลขบัตรประชาชน *</Label>
                  <Input
                    id="idNumber"
                    placeholder="1-2345-67890-12-3"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">เบอร์โทรศัพท์ *</Label>
                  <Input
                    id="phone"
                    placeholder="081-234-5678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">อีเมล *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="owner@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">ที่อยู่ *</Label>
                <Textarea
                  id="address"
                  placeholder="ที่อยู่ตามบัตรประชาชน"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="accommodation" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accommodationName">ชื่อที่พัก *</Label>
                  <Input
                    id="accommodationName"
                    placeholder="ชื่อที่พักของคุณ"
                    value={formData.accommodationName}
                    onChange={(e) => setFormData({ ...formData, accommodationName: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="accommodationType">ประเภทที่พัก *</Label>
                  <Select onValueChange={(value) => setFormData({ ...formData, accommodationType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทที่พัก" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hotel">โรงแรม</SelectItem>
                      <SelectItem value="resort">รีสอร์ท</SelectItem>
                      <SelectItem value="villa">วิลล่า</SelectItem>
                      <SelectItem value="apartment">อพาร์ทเมนท์</SelectItem>
                      <SelectItem value="homestay">โฮมสเตย์</SelectItem>
                      <SelectItem value="guesthouse">เกสต์เฮาส์</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accommodationPhone">เบอร์โทรที่พัก</Label>
                  <Input
                    id="accommodationPhone"
                    placeholder="เบอร์โทรติดต่อที่พัก"
                    value={formData.accommodationPhone}
                    onChange={(e) => setFormData({ ...formData, accommodationPhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="website">เว็บไซต์</Label>
                  <Input
                    id="website"
                    placeholder="www.youraccommodation.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="facebookPage">เพจ Facebook</Label>
                  <Input
                    id="facebookPage"
                    placeholder="ชื่อเพจ Facebook"
                    value={formData.facebookPage}
                    onChange={(e) => setFormData({ ...formData, facebookPage: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="bankAccount">เลขบัญชีธนาคาร</Label>
                  <Input
                    id="bankAccount"
                    placeholder="ธ.กสิกรไทย 123-4-56789-0"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="accommodationAddress">ที่อยู่ที่พัก *</Label>
                <Textarea
                  id="accommodationAddress"
                  placeholder="ที่อยู่ที่ตั้งของที่พัก"
                  value={formData.accommodationAddress}
                  onChange={(e) => setFormData({ ...formData, accommodationAddress: e.target.value })}
                  required
                />
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label>สำเนาบัตรประชาชน *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      className="hidden"
                      id="idCard"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("idCard", e.target.files?.[0] || null)}
                    />
                    <label htmlFor="idCard" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">คลิกเพื่ออัพโหลดสำเนาบัตรประชาชน</p>
                    </label>
                    {formData.idCard && <p className="mt-2 text-sm text-green-600">✓ {formData.idCard.name}</p>}
                  </div>
                </div>

                <div>
                  <Label>ใบอนุญาตประกอบธุรกิจ (ถ้ามี)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      className="hidden"
                      id="businessLicense"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("businessLicense", e.target.files?.[0] || null)}
                    />
                    <label htmlFor="businessLicense" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">คลิกเพื่ออัพโหลดใบอนุญาตประกอบธุรกิจ</p>
                    </label>
                    {formData.businessLicense && (
                      <p className="mt-2 text-sm text-green-600">✓ {formData.businessLicense.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>เอกสารสิทธิ์ที่ดิน/โฉนด (ถ้ามี)</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      className="hidden"
                      id="propertyDocument"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload("propertyDocument", e.target.files?.[0] || null)}
                    />
                    <label htmlFor="propertyDocument" className="cursor-pointer">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">คลิกเพื่ออัพโหลดเอกสารสิทธิ์ที่ดิน</p>
                    </label>
                    {formData.propertyDocument && (
                      <p className="mt-2 text-sm text-green-600">✓ {formData.propertyDocument.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="space-y-6 mt-6">
              <div>
                <Label>รูปภาพที่พัก *</Label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    className="hidden"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files)}
                  />
                  <label htmlFor="images" className="cursor-pointer">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">คลิกเพื่ออัพโหลดรูปภาพที่พัก</p>
                    <p className="mt-1 text-xs text-gray-400">สามารถเลือกหลายไฟล์พร้อมกัน (ขั้นต่ำ 3 รูป)</p>
                  </label>
                </div>
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-green-600 mb-2">รูปภาพที่เลือก ({formData.images.length} รูป):</p>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          {image.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label>สิ่งอำนวยความสะดวก</Label>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) => setFormData({ ...formData, agreeTerms: checked as boolean })}
              />
              <Label htmlFor="agreeTerms" className="text-sm">
                ฉันยอมรับ{" "}
                <a href="/terms" className="text-teal-600 hover:underline">
                  ข้อกำหนดและเงื่อนไข
                </a>{" "}
                และ{" "}
                <a href="/privacy" className="text-teal-600 hover:underline">
                  นโยบายความเป็นส่วนตัว
                </a>
              </Label>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSubmit} className="flex-1" disabled={!formData.agreeTerms}>
                <CheckCircle className="h-4 w-4 mr-2" />
                ส่งคำขอยืนยันตัวตน
              </Button>
              <Button type="button" variant="outline" className="flex-1">
                บันทึกร่าง
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
