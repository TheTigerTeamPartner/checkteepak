"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, AlertTriangle, X } from "lucide-react"

export default function ReportPage() {
  const [formData, setFormData] = useState({
    accommodationName: "",
    phone: "",
    reportType: "",
    incidentDate: "",
    description: "",
    bankAccount: "",
    bankName: "",
    accountHolder: "",
    reporterName: "",
    reporterPhone: "",
    reporterEmail: "",
    facebookProfile: "",
    instagramProfile: "",
    lineId: "",
    tiktokProfile: "",
    websiteUrl: "",
    otherSocialMedia: "",
  })

  const [uploadedFiles, setUploadedFiles] = useState({
    transferSlip: null as File | null,
    fraudEvidence: null as File | null,
    blockEvidence: null as File | null,
    otherEvidence: [] as File[],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    formData.title = formData.reportType || "ไม่มีหัวข้อ"
  
    const form = new FormData()
    form.append("json", JSON.stringify(formData))
  
    if (uploadedFiles.transferSlip) form.append("transferSlip", uploadedFiles.transferSlip)
    if (uploadedFiles.fraudEvidence) form.append("fraudEvidence", uploadedFiles.fraudEvidence)
    if (uploadedFiles.blockEvidence) form.append("blockEvidence", uploadedFiles.blockEvidence)
    uploadedFiles.otherEvidence.forEach((file) => {
      form.append("otherEvidence", file)
    })
  
    const res = await fetch("/api/reports", {
      method: "POST",
      body: form,
    })
  
    const data = await res.json()
    if (data.success) {
      alert("ส่งรายงานเรียบร้อยแล้ว")
    } else {
      alert("เกิดข้อผิดพลาดในการส่งรายงาน")
    }
  }
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === "other") {
        setUploadedFiles((prev) => ({
          ...prev,
          otherEvidence: [...prev.otherEvidence, file],
        }))
      } else {
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: file,
        }))
      }
    }
  }

  const removeFile = (type: string, index?: number) => {
    if (type === "other" && typeof index === "number") {
      setUploadedFiles((prev) => ({
        ...prev,
        otherEvidence: prev.otherEvidence.filter((_, i) => i !== index),
      }))
    } else {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: null,
      }))
    }
  }

  const FileUploadSection = ({
    title,
    description,
    type,
    file,
    accept = "image/*,.pdf",
  }: {
    title: string
    description: string
    type: string
    file: File | null
    accept?: string
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{title}</Label>
      <p className="text-xs text-gray-500 mb-2">{description}</p>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={(e) => handleFileUpload(e, type)}
          id={`upload-${type}`}
        />
        <label htmlFor={`upload-${type}`} className="cursor-pointer">
          <Upload className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">คลิกเพื่ออัพโหลด หรือลากไฟล์มาวาง</p>
          <p className="mt-1 text-xs text-gray-400">รองรับไฟล์ JPG, PNG, PDF ขนาดไม่เกิน 10MB</p>
        </label>
      </div>
      {file && (
        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2">
          <span className="text-sm text-green-700">{file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeFile(type)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">แจ้งที่พักโกง</h1>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 mr-3" />
            <div>
              <h3 className="font-medium text-amber-800">ข้อมูลสำคัญ</h3>
              <p className="text-sm text-amber-700 mt-1">
                กรุณาให้ข้อมูลที่ถูกต้องและครบถ้วน เพื่อให้ทีมงานสามารถตรวจสอบและดำเนินการได้อย่างรวดเร็ว ข้อมูลของคุณจะถูกเก็บเป็นความลับ
              </p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ข้อมูลที่พัก */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลที่พัก</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="accommodationName">ชื่อที่พัก *</Label>
              <Input
                id="accommodationName"
                placeholder="ระบุชื่อที่พักที่มีปัญหา"
                value={formData.accommodationName}
                onChange={(e) => setFormData({ ...formData, accommodationName: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">เบอร์โทรศัพท์ที่พัก</Label>
              <Input
                id="phone"
                placeholder="เบอร์โทรศัพท์ที่ติดต่อที่พัก"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="reportType">ประเภทปัญหา *</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, reportType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทปัญหา" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fraud">หลอกลวง/โกงเงิน</SelectItem>
                  <SelectItem value="fake">ที่พักปลอม/ไม่มีจริง</SelectItem>
                  <SelectItem value="misleading">ข้อมูลเท็จ/ทำให้เข้าใจผิด</SelectItem>
                  <SelectItem value="unsafe">ไม่ปลอดภัย</SelectItem>
                  <SelectItem value="poor-service">บริการแย่</SelectItem>
                  <SelectItem value="other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="incidentDate">วันที่เกิดเหตุ</Label>
              <Input
                id="incidentDate"
                type="date"
                value={formData.incidentDate}
                onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* ข้อมูลการติดต่อ */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูล Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebookProfile">Facebook Profile/Page</Label>
              <Input
                id="facebookProfile"
                placeholder="ลิงก์ Facebook ของที่พักหรือเจ้าของ"
                value={formData.facebookProfile}
                onChange={(e) => setFormData({ ...formData, facebookProfile: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="instagramProfile">Instagram Profile</Label>
              <Input
                id="instagramProfile"
                placeholder="ลิงก์ Instagram ของที่พักหรือเจ้าของ"
                value={formData.instagramProfile}
                onChange={(e) => setFormData({ ...formData, instagramProfile: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="lineId">Line ID</Label>
              <Input
                id="lineId"
                placeholder="Line ID ที่ใช้ติดต่อ"
                value={formData.lineId}
                onChange={(e) => setFormData({ ...formData, lineId: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="tiktokProfile">TikTok Profile</Label>
              <Input
                id="tiktokProfile"
                placeholder="ลิงก์ TikTok ของที่พักหรือเจ้าของ"
                value={formData.tiktokProfile}
                onChange={(e) => setFormData({ ...formData, tiktokProfile: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="websiteUrl">เว็บไซต์</Label>
              <Input
                id="websiteUrl"
                placeholder="เว็บไซต์หรือลิงก์อื่นๆ ที่เกี่ยวข้อง"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="otherSocialMedia">Social Media อื่นๆ</Label>
              <Textarea
                id="otherSocialMedia"
                placeholder="ระบุ social media อื่นๆ ที่เกี่ยวข้อง เช่น Twitter, YouTube, etc."
                rows={3}
                value={formData.otherSocialMedia}
                onChange={(e) => setFormData({ ...formData, otherSocialMedia: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* ข้อมูลการชำระเงิน */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลการชำระเงิน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="paymentMethod">ช่องทางการชำระเงิน</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="วิธีการชำระเงิน" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">โอนเงินผ่านธนาคาร</SelectItem>
                  <SelectItem value="promptpay">PromptPay</SelectItem>
                  <SelectItem value="true-wallet">TrueMoney Wallet</SelectItem>
                  <SelectItem value="cash">เงินสด</SelectItem>
                  <SelectItem value="credit-card">บัตรเครดิต</SelectItem>
                  <SelectItem value="other">อื่นๆ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankName">ธนาคาร</Label>
                <Input
                  id="bankName"
                  placeholder="ชื่อธนาคารที่โอนเงินไป"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="bankAccount">เลขบัญชี</Label>
                <Input
                  id="bankAccount"
                  placeholder="เลขบัญชีที่โอนเงินไป"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accountHolder">ชื่อเจ้าของบัญชี</Label>
              <Input
                id="accountHolder"
                placeholder="ชื่อเจ้าของบัญชีที่โอนเงินไป"
                value={formData.accountHolder}
                onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* รายละเอียดเหตุการณ์ */}
        <Card>
          <CardHeader>
            <CardTitle>รายละเอียดเหตุการณ์</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="description">รายละเอียดเหตุการณ์ *</Label>
              <Textarea
                id="description"
                placeholder="อธิบายรายละเอียดเหตุการณ์ที่เกิดขึ้น เช่น วิธีการติดต่อ, การโอนเงิน, ปัญหาที่พบ เป็นต้น"
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* หลักฐาน */}
        <Card>
          <CardHeader>
            <CardTitle>แนบหลักฐาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUploadSection
              title="สลิปการโอนเงิน *"
              description="แนบสลิปการโอนเงินที่คุณโอนให้กับที่พัก"
              type="transferSlip"
              file={uploadedFiles.transferSlip}
            />

            <FileUploadSection
              title="หลักฐานการโดนโกง"
              description="แนบภาพหน้าจอการสนทนา หรือหลักฐานที่แสดงว่าคุณถูกหลอกลวง"
              type="fraudEvidence"
              file={uploadedFiles.fraudEvidence}
            />

            <FileUploadSection
              title="หลักฐานการโดนบล็อค"
              description="แนบภาพหน้าจอที่แสดงว่าคุณถูกบล็อคจากการติดต่อ"
              type="blockEvidence"
              file={uploadedFiles.blockEvidence}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">หลักฐานอื่นๆ (ถ้ามี)</Label>
              <p className="text-xs text-gray-500 mb-2">แนบหลักฐานเพิ่มเติมที่เกี่ยวข้อง</p>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileUpload(e, "other")}
                  id="upload-other"
                  multiple
                />
                <label htmlFor="upload-other" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">คลิกเพื่ออัพโหลดหลักฐานเพิ่มเติม</p>
                  <p className="mt-1 text-xs text-gray-400">สามารถเลือกหลายไฟล์พร้อมกันได้</p>
                </label>
              </div>
              {uploadedFiles.otherEvidence.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.otherEvidence.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2"
                    >
                      <span className="text-sm text-green-700">{file.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile("other", index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ข้อมูลการติดต่อของผู้แจ้ง */}
        <Card>
          <CardHeader>
            <CardTitle>ข้อมูลการติดต่อของคุณ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reporterName">ชื่อ-นามสกุล *</Label>
                <Input
                  id="reporterName"
                  placeholder="ชื่อของคุณ"
                  value={formData.reporterName}
                  onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reporterPhone">เบอร์โทรศัพท์ *</Label>
                <Input
                  id="reporterPhone"
                  placeholder="เบอร์ติดต่อกลับ"
                  value={formData.reporterPhone}
                  onChange={(e) => setFormData({ ...formData, reporterPhone: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="reporterEmail">อีเมล</Label>
                <Input
                  id="reporterEmail"
                  type="email"
                  placeholder="อีเมลติดต่อกลับ"
                  value={formData.reporterEmail}
                  onChange={(e) => setFormData({ ...formData, reporterEmail: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button type="submit" className="flex-1">
            ส่งรายงาน
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            ยกเลิก
          </Button>
        </div>
      </form>
    </div>
  )
}
