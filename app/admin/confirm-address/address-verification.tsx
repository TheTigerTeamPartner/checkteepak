"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import {
  MapPin, Clock, CheckCircle, XCircle, Eye, Edit, Trash2, Plus, Building
} from "lucide-react"

export default function Component() {
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null)
  const [adminComment, setAdminComment] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("applicant")
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Fetch error:", error)
        return
      }

      const formatted = data.map((row) => ({
        id: row.id,
        user: {
          name: row.agent_name || "ไม่ทราบชื่อ",
          email: row.agent_email || "-",
          phone: row.agent_phone || "-",
        },
        applicantAddress: {
          isMainAddress: row.is_default,
          houseNumber: row.full_address,
          province: row.province,
          district: row.district,
          subDistrict: row.sub_district,
          postalCode: row.postal_code,
          type: row.type_id === 1 ? "individual" : "real_estate",
          verificationStatus: row.status || "pending",
        },
        realEstateAddress: {
          houseNumber: row.full_address,
          province: row.province,
          district: row.district,
          subDistrict: row.sub_district,
          postalCode: row.postal_code,
          setAsMain: row.is_default,
          type: row.type_id === 2 ? "real_estate" : "individual",
          verificationStatus: row.status || "pending",
        },
        submittedAt: row.created_at,
        status: row.status || "pending",
        priority: "normal",
      }))

      setPendingVerifications(formatted)
    }

    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            <Clock className="h-3 w-3 mr-1" />
            รอดำเนินการ
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            อนุมัติแล้ว
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            <XCircle className="h-3 w-3 mr-1" />
            ปฏิเสธ
          </Badge>
        )
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>
    }
  }

  

  const getAddressVerificationStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
            <CheckCircle className="h-3 w-3 mr-1" />
            ยืนยันแล้ว
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600 bg-yellow-50">
            <Clock className="h-3 w-3 mr-1" />
            รอดำเนินการ
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
            <XCircle className="h-3 w-3 mr-1" />
            ปฏิเสธ
          </Badge>
        )
      default:
        return <Badge variant="outline">ไม่ทราบสถานะ</Badge>
    }
  }

  const handleApprove = async (id: string) => {
    await supabase
      .from("addresses")
      .update({ status: "approved" })
      .eq("id", id)
    setPendingVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "approved" } : v))
    )
  }

  const handleReject = async (id: string) => {
    await supabase
      .from("addresses")
      .update({ status: "rejected", admin_comment: adminComment })
      .eq("id", id)
    setPendingVerifications((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status: "rejected" } : v))
    )
  }

  const filtered = pendingVerifications.filter((v) => {
    if (filterStatus === "all") return true
    return v.status === filterStatus
  })

  const selectedData = pendingVerifications.find((v) => v.id === selectedVerification)
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      

      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-red-100 p-2 rounded-lg">
             
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ยืนยันที่อยู่</h1>
                <p className="text-gray-600">กรุณากรอกข้อมูลที่อยู่ปัจจุบันของคุณให้ครบถ้วน เพื่อใช้ในการยืนยันตัวตน</p>
              </div>
            </div>
          </div>

          {!selectedVerification ? (
            /* List View */
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">รอดำเนินการ</p>
                        <p className="text-2xl font-bold text-yellow-600">12</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">อนุมัติแล้ว</p>
                        <p className="text-2xl font-bold text-green-600">45</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">ปฏิเสธ</p>
                        <p className="text-2xl font-bold text-red-600">8</p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">ทั้งหมด</p>
                        <p className="text-2xl font-bold text-gray-900">65</p>
                      </div>
                    
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filter Tabs */}
              <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                <TabsList>
                  <TabsTrigger value="all">ทั้งหมด</TabsTrigger>
                  <TabsTrigger value="pending">รอดำเนินการ</TabsTrigger>
                  <TabsTrigger value="approved">อนุมัติแล้ว</TabsTrigger>
                  <TabsTrigger value="rejected">ปฏิเสธ</TabsTrigger>
                </TabsList>

                <TabsContent value={filterStatus} className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>รายการยืนยันที่อยู่</CardTitle>
                      <CardDescription>คลิกเพื่อดูรายละเอียดและดำเนินการ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {pendingVerifications.map((verification) => (
                          <div
                            key={verification.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => setSelectedVerification(verification.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900">{verification.user.name}</h3>
                                  <p className="text-sm text-gray-600">รหัส: {verification.id}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {verification.applicantAddress.isMainAddress ? (
                                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        ที่อยู่หลัก
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-gray-600 border-gray-600">
                                        ที่อยู่ทั่วไป
                                      </Badge>
                                    )}
                                    {getAddressVerificationStatusBadge(
                                      verification.applicantAddress.verificationStatus,
                                    )}
                                
                                    {verification.applicantAddress.type === "other" && (
                                      <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                                        อื่นๆ
                                      </Badge>
                                    )}
                                    {verification.realEstateAddress.type === "real_estate" && (
                                      <Badge
                                        variant="secondary"
                                        className="bg-green-50 text-green-700 border-green-200"
                                      >
                                        อสังหา
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                
                                {getStatusBadge(verification.status)}
                                <Button variant="outline" size="sm">
                                  <Eye className="h-4 w-4 mr-1" />
                                  ดูรายละเอียด
                                </Button>
                              </div>
                            </div>
                            <div className="mt-3 text-sm text-gray-600">
                              <div className="space-y-1">
                                <p>
                                  <span className="font-medium">ผู้ยื่น:</span> {verification.applicantAddress.houseNumber}{" "}
                                  ต.{verification.applicantAddress.subDistrict} อ.
                                  {verification.applicantAddress.district} จ.{verification.applicantAddress.province}
                                </p>
                                <p>
                                  <span className="font-medium">อสังหา:</span>{" "}
                                  {verification.realEstateAddress.houseNumber} ต.
                                  {verification.realEstateAddress.subDistrict} อ.
                                  {verification.realEstateAddress.district} จ.{verification.realEstateAddress.province}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            /* Detail View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => setSelectedVerification(null)}>
                  ← กลับไปรายการ
                </Button>
                <div className="flex items-center space-x-2">
                  
                  {selectedData && getStatusBadge(selectedData.status)}
                </div>
              </div>

              {selectedData && (
                <div className="space-y-6">
                  {/* Tabs for Applicant and Real Estate Address */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="applicant"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600"
                      >
                        ที่อยู่ของผู้ยื่นยันตัวตน
                      </TabsTrigger>
                      <TabsTrigger
                        value="realEstate"
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-600"
                      >
                        ที่อยู่ของอสังหาริมทรัพย์
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="applicant" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            
                            ที่อยู่ของผู้ยื่นยันตัวตน
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Address Type Badge */}
                          <div className="flex items-center gap-2">
                            {selectedData.applicantAddress.isMainAddress ? (
                              <Badge variant="outline" className="text-blue-600 border-blue-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                ที่อยู่หลัก
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-gray-600 border-gray-600">
                                ที่อยู่ทั่วไป
                              </Badge>
                            )}
                            
                            {selectedData.applicantAddress.type === "other" && (
                              <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                                อื่นๆ
                              </Badge>
                            )}
                          </div>

                          {/* Address Fields */}
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">ที่อยู่ทั่วไป</Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-900">{selectedData.applicantAddress.houseNumber}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">จังหวัด</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.applicantAddress.province}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">อำเภอ/เขต</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.applicantAddress.district}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">ตำบล/แขวง</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.applicantAddress.subDistrict}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">เลขไปรษณีย์</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.applicantAddress.postalCode}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          
                        </CardContent>
                      </Card>
                      {/* Add New Address Button for Applicant (if applicable) */}
                      
                    </TabsContent>

                    <TabsContent value="realEstate" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-green-600" />
                            ที่อยู่ของอสังหาริมทรัพย์
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Address Type Badge */}
                          <div className="flex items-center gap-2 mb-4">
                            {selectedData.realEstateAddress.type === "real_estate" && (
                              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                                อสังหา
                              </Badge>
                            )}
                            {selectedData.realEstateAddress.type === "other" && (
                              <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                                อื่นๆ
                              </Badge>
                            )}
                            {getAddressVerificationStatusBadge(selectedData.realEstateAddress.verificationStatus)}
                          </div>
                          {/* Address Fields */}
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700">ที่อยู่ทั่วไป</Label>
                              <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                <p className="text-gray-900">{selectedData.realEstateAddress.houseNumber}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">จังหวัด</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.realEstateAddress.province}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">อำเภอ/เขต</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.realEstateAddress.district}</p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">ตำบล/แขวง</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.realEstateAddress.subDistrict}</p>
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700">เลขไปรษณีย์</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.realEstateAddress.postalCode}</p>
                                </div>
                              </div>
                            </div>

                            {/* Set as Main Address Checkbox */}
                            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                              <Checkbox id="setAsMain" checked={selectedData.realEstateAddress.setAsMain} disabled />
                              <Label htmlFor="setAsMain" className="text-sm font-medium text-blue-900">
                                ตั้งเป็นที่อยู่หลัก
                              </Label>
                            </div>
                          </div>

                          
                        </CardContent>
                      </Card>

                      {/* Add New Address Button for Real Estate (if applicable) */}
                      <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                        <CardContent className="p-6">
                          <Button variant="ghost" className="w-full h-auto p-4 text-gray-600 hover:text-gray-900">
                            <Plus className="h-5 w-5 mr-2" />
                            เพิ่มที่อยู่ใหม่
                          </Button>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>

                  {/* Right Column - Admin Actions (remains outside tabs) */}
                  <div className="lg:col-span-1 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>การดำเนินการ</CardTitle>
                        <CardDescription>ตรวจสอบและยืนยันข้อมูลที่อยู่</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        

                        {/* Admin Comment */}
                        <div>
                          <Label htmlFor="adminComment">หมายเหตุ/เหตุผล</Label>
                          <textarea
                            id="adminComment"
                            placeholder="กรอกหมายเหตุหรือเหตุผลในการอนุมัติ/ปฏิเสธ"
                            value={adminComment}
                            onChange={(e) => setAdminComment(e.target.value)}
                            rows={4}
                            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2">
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(selectedData.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            อนุมัติ
                          </Button>
                          <Button variant="destructive" onClick={() => handleReject(selectedData.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            ปฏิเสธ
                          </Button>
                        </div>

                        {/* Timeline */}
                        <div className="pt-4 border-t">
                          <h4 className="font-medium text-gray-900 mb-3">ประวัติการดำเนินการ</h4>
                          <div className="space-y-2">
                            <div className="flex items-start space-x-3">
                              <div className="bg-blue-100 p-1 rounded-full">
                                <Clock className="h-3 w-3 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">ส่งคำขอ</p>
                                <p className="text-xs text-gray-500">{selectedData.submittedAt}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
