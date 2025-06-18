"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Building2, Upload, CheckCircle, Clock, AlertCircle, ArrowLeft } from "lucide-react"

export default function PaymentPage() {
  const [selectedPackage, setSelectedPackage] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("promptpay")
  const [paymentData, setPaymentData] = useState({
    fullName: "",
    phone: "",
    email: "",
    note: "",
    slipFile: null as File | null,
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const packageData = localStorage.getItem("selectedPackage")
    if (packageData) {
      setSelectedPackage(JSON.parse(packageData))
    }

    // ดึงข้อมูลการสมัครสมาชิก
    const registrationData = localStorage.getItem("registrationData")
    if (registrationData) {
      const userData = JSON.parse(registrationData)
      setPaymentData((prev) => ({
        ...prev,
        fullName: `${userData.firstName} ${userData.lastName}`,
        phone: userData.phone,
        email: userData.email,
      }))
    }
  }, [])

  const paymentMethods = [
    {
      id: "promptpay",
      name: "พร้อมเพย์ (PromptPay)",
      icon: <Smartphone className="h-5 w-5" />,
      description: "โอนผ่านพร้อมเพย์",
      qrCode: true,
    },
    {
      id: "bank-transfer",
      name: "โอนเงินผ่านธนาคาร",
      icon: <Building2 className="h-5 w-5" />,
      description: "โอนเงินผ่านแอปธนาคาร",
      qrCode: false,
    },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentData({ ...paymentData, slipFile: file })
    }
  }

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentData.slipFile) {
      alert("กรุณาแนบสลิปการโอนเงิน")
      return
    }

    // บันทึกข้อมูลการชำระเงิน
    const paymentInfo = {
      package: selectedPackage,
      paymentMethod,
      paymentData,
      timestamp: new Date().toISOString(),
      status: "pending",
    }

    localStorage.setItem("paymentInfo", JSON.stringify(paymentInfo))
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">รอการตรวจสอบการชำระเงิน</h1>
            <p className="text-gray-600 mb-6">เราได้รับข้อมูลการชำระเงินของคุณแล้ว ทีมงานจะตรวจสอบและอนุมัติภายใน 24 ชั่วโมง</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">แพ็คเก็จ:</span>
                <span>{selectedPackage?.name}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">จำนวนเงิน:</span>
                <span className="font-bold text-teal-600">฿{selectedPackage?.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">สถานะ:</span>
                <Badge className="bg-amber-500 hover:bg-amber-600">รอตรวจสอบ</Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
                ไปที่แดชบอร์ด
              </Button>
              <Button variant="outline" onClick={() => (window.location.href = "/")} className="w-full">
                กลับหน้าหลัก
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-blue-900">หมายเหตุ:</p>
                  <p className="text-sm text-blue-700">
                    คุณจะได้รับอีเมลยืนยันเมื่อการชำระเงินได้รับการอนุมัติ หากมีปัญหาใดๆ ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!selectedPackage) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">ไม่พบข้อมูลแพ็คเก็จ</h1>
            <p className="text-gray-600 mb-6">กรุณาเลือกแพ็คเก็จก่อนดำเนินการชำระเงิน</p>
            <Button onClick={() => (window.location.href = "/select-package")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              กลับไปเลือกแพ็คเก็จ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => (window.location.href = "/select-package")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          กลับไปเลือกแพ็คเก็จ
        </Button>
        <h1 className="text-3xl font-bold">ชำระเงิน</h1>
        <p className="text-gray-600">ดำเนินการชำระเงินเพื่อเริ่มใช้งานแพ็คเก็จของคุณ</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Package Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>สรุปการสั่งซื้อ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-bold text-lg">{selectedPackage.name}</h3>
                <p className="text-sm text-gray-600">{selectedPackage.description}</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>ราคาแพ็คเก็จ</span>
                  <span>฿{selectedPackage.originalPrice.toLocaleString()}</span>
                </div>
                {selectedPackage.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>ส่วนลด ({selectedPackage.discount}%)</span>
                    <span>-฿{(selectedPackage.originalPrice - selectedPackage.price).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>VAT 7%</span>
                  <span>฿{Math.round(selectedPackage.price * 0.07).toLocaleString()}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>ยอดรวม</span>
                <span className="text-teal-600">฿{Math.round(selectedPackage.price * 1.07).toLocaleString()}</span>
              </div>

              <div className="bg-teal-50 p-3 rounded-lg">
                <p className="text-sm text-teal-700">
                  <CheckCircle className="h-4 w-4 inline mr-1" />
                  ระยะเวลา: {Math.round(selectedPackage.duration / 30)} เดือน
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลการชำระเงิน</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPayment} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <Label className="text-base font-medium">เลือกวิธีการชำระเงิน</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    {paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          paymentMethod === method.id ? "ring-2 ring-teal-500 shadow-md" : ""
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">{method.icon}</div>
                            <div>
                              <h3 className="font-medium">{method.name}</h3>
                              <p className="text-sm text-gray-500">{method.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Payment Details */}
                {paymentMethod === "promptpay" && (
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-4">ชำระเงินผ่านพร้อมเพย์</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="bg-white p-4 rounded-lg text-center">
                          <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                            <span className="text-gray-500">QR Code พร้อมเพย์</span>
                          </div>
                          <p className="text-sm text-gray-600">สแกน QR Code เพื่อชำระเงิน</p>
                        </div>
                      </div>
                      <div>
                        <div className="space-y-3">
                          <div>
                            <Label>หมายเลขพร้อมเพย์</Label>
                            <div className="bg-white p-3 rounded border font-mono">081-234-5678</div>
                          </div>
                          <div>
                            <Label>ชื่อบัญชี</Label>
                            <div className="bg-white p-3 rounded border">บริษัท เช็คที่พัก จำกัด</div>
                          </div>
                          <div>
                            <Label>จำนวนเงิน</Label>
                            <div className="bg-white p-3 rounded border font-bold text-teal-600">
                              ฿{Math.round(selectedPackage.price * 1.07).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "bank-transfer" && (
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-bold mb-4">ข้อมูลบัญชีธนาคาร</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>ธนาคาร</Label>
                        <div className="bg-white p-3 rounded border">ธนาคารกสิกรไทย</div>
                      </div>
                      <div>
                        <Label>เลขที่บัญชี</Label>
                        <div className="bg-white p-3 rounded border font-mono">123-4-56789-0</div>
                      </div>
                      <div className="md:col-span-2">
                        <Label>ชื่อบัญชี</Label>
                        <div className="bg-white p-3 rounded border">บริษัท เช็คที่พัก จำกัด</div>
                      </div>
                      <div className="md:col-span-2">
                        <Label>จำนวนเงิน</Label>
                        <div className="bg-white p-3 rounded border font-bold text-teal-600">
                          ฿{Math.round(selectedPackage.price * 1.07).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="font-bold">ข้อมูลผู้ชำระเงิน</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">ชื่อ-นามสกุล</Label>
                      <Input
                        id="fullName"
                        value={paymentData.fullName}
                        onChange={(e) => setPaymentData({ ...paymentData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                      <Input
                        id="phone"
                        value={paymentData.phone}
                        onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">อีเมล</Label>
                    <Input
                      id="email"
                      type="email"
                      value={paymentData.email}
                      onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="note">หมายเหตุ (ถ้ามี)</Label>
                    <Textarea
                      id="note"
                      value={paymentData.note}
                      onChange={(e) => setPaymentData({ ...paymentData, note: e.target.value })}
                      placeholder="ข้อมูลเพิ่มเติมหรือคำถาม"
                    />
                  </div>
                </div>

                {/* Upload Slip */}
                <div>
                  <Label htmlFor="slip">แนบสลิปการโอนเงิน *</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">คลิกเพื่อเลือกไฟล์หรือลากไฟล์มาวางที่นี่</p>
                      <p className="text-xs text-gray-500">รองรับไฟล์ JPG, PNG, PDF ขนาดไม่เกิน 5MB</p>
                      <input
                        type="file"
                        id="slip"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-3"
                        onClick={() => document.getElementById("slip")?.click()}
                      >
                        เลือกไฟล์
                      </Button>
                    </div>
                    {paymentData.slipFile && (
                      <div className="mt-2 p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">ไฟล์: {paymentData.slipFile.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button type="submit" size="lg" className="w-full">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    ส่งข้อมูลการชำระเงิน
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">ทีมงานจะตรวจสอบและอนุมัติภายใน 24 ชั่วโมง</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
