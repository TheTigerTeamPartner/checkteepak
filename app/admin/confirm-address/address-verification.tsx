"use client"

import { supabase } from "@/lib/supabase"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Clock, CheckCircle, XCircle, Eye, RefreshCw, Building, Plus } from "lucide-react"

// Interfaces
interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  status: string
  created_at: string
  updated_at: string
}

interface Address {
  id: string
  full_address: string
  province: string
  district: string
  sub_district: string
  postal_code: string
  is_default: boolean
  status: string
  created_at: string
  updated_at: string
  user: User
}

interface Verification {
  id: string
  user: User
  address: Address
  submittedAt: string
  status: string
}

// State
export default function Component() {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null)
  const [adminComment, setAdminComment] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [activeTab, setActiveTab] = useState("applicant")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // Fetch Data
  const fetchAddressVerifications = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/address?page=${page}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const { data, count } = await response.json()
      
      const formattedData = data.map((item: any) => ({
        id: item.id,
        user: {
          id: item.user.id,
          name: item.user.name,
          email: item.user.email,
          phone: item.user.phone,
          role: item.user.role,
          status: item.user.status
        },
        address: {
          id: item.id,
          full_address: item.full_address,
          province: item.province,
          district: item.district,
          sub_district: item.sub_district,
          postal_code: item.postal_code,
          is_default: item.is_default,
          status: item.status,
          created_at: item.created_at,
          updated_at: item.updated_at
        },
        submittedAt: item.created_at,
        status: item.status
      }))
  
      setVerifications(formattedData)
      setTotal(count || 0)
    } catch (err: any) {
      console.error('Error:', err)
      setError(`เกิดข้อผิดพลาด: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Update Status
  const updateAddressStatus = async (id: string, status: string, comment?: string) => {
    try {
      const updates: any = { status, updated_at: new Date().toISOString() }
      if (comment) {
        updates.comment = comment
      }

      const { error } = await supabase
        .from("addresses")
        .update(updates)
        .eq("id", id)

      if (error) throw error

      setVerifications((prev) =>
        prev.map((v) =>
          v.id === id
            ? {
                ...v,
                status,
                address: v.address ? { ...v.address, status } : null,
              }
            : v
        )
      )
      setAdminComment("")
      refreshData()
    } catch (err: any) {
      setError(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${err.message}`)
    }
  }

  // Event Handlers
  const handleApprove = (id: string) => {
    updateAddressStatus(id, "approved", adminComment)
  }

  const handleReject = (id: string) => {
    updateAddressStatus(id, "rejected", adminComment)
  }

  // Refresh Data
  const refreshData = () => {
    setPage(1)
    fetchAddressVerifications(1)
  }

  // Load More
  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  // Fetch data on mount and when page/filter changes
  useEffect(() => {
    fetchAddressVerifications(page)
  }, [page, filterStatus])

  // แปลงสถานะเป็น Badge พร้อมไอคอนสำหรับส่วนรายการและรายละเอียด
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            รอดำเนินการ
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="text-green-600 border-green-600 flex items-center">
            <CheckCircle className="h-4 w-4 mr-1" />
            อนุมัติแล้ว
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600 flex items-center">
            <XCircle className="h-4 w-4 mr-1" />
            ปฏิเสธ
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-600">
            ไม่ทราบสถานะ
          </Badge>
        )
    }
  }

  // กรอง verifications ตาม filterStatus
  const filteredVerifications = filterStatus === "all"
    ? verifications
    : verifications.filter((v) => v.status === filterStatus)

  const selectedData = verifications.find((v) => v.id === selectedVerification)

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ยืนยันที่อยู่</h1>
                <p className="text-gray-600">กรุณากรอกข้อมูลที่อยู่ปัจจุบันของคุณให้ครบถ้วน เพื่อใช้ในการยืนยันตัวตน</p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              <p>{error}</p>
              <Button variant="outline" onClick={refreshData} className="mt-2">
                <RefreshCw className="h-4 w-4 mr-2" />
                ลองใหม่
              </Button>
            </div>
          )}

          {/* Main Content */}
          {!isLoading && !error && !selectedVerification ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">รอดำเนินการ</p>
                        <p className="text-2xl font-bold text-yellow-600">
                          {verifications.filter((v) => v.status === "pending").length}
                        </p>
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
                        <p className="text-2xl font-bold text-green-600">
                          {verifications.filter((v) => v.status === "approved").length}
                        </p>
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
                        <p className="text-2xl font-bold text-red-600">
                          {verifications.filter((v) => v.status === "rejected").length}
                        </p>
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
                        <p className="text-2xl font-bold text-gray-900">{total}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filter Tabs */}
              <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                <TabsList>
                  {[
                    { value: "all", label: "ทั้งหมด" },
                    { value: "pending", label: "รอดำเนินการ" },
                    { value: "approved", label: "อนุมัติแล้ว" },
                    { value: "rejected", label: "ปฏิเสธ" },
                  ].map((tab) => (
                    <TabsTrigger key={tab.value} value={tab.value}>
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={filterStatus} className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>รายการยืนยันที่อยู่</CardTitle>
                      <CardDescription>คลิกเพื่อดูรายละเอียดและดำเนินการ</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {filteredVerifications.length > 0 ? (
                          filteredVerifications.map((verification) => (
                            <div
                              key={verification.id}
                              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                              onClick={() => setSelectedVerification(verification.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="bg-blue-100 p-2 rounded-lg"></div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{verification.user?.name}</h3>
                                    <p className="text-sm text-gray-600">อีเมล: {verification.user?.email}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {verification.address?.is_default ? (
                                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                                          <CheckCircle className="h-3 w-3 mr-1" />
                                          ที่อยู่หลัก
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline" className="text-gray-600 border-gray-600">
                                          ที่อยู่ทั่วไป
                                        </Badge>
                                      )}
                                      {/* แสดงสถานะด้วย Badge และไอคอน */}
                                      {getStatusText(verification.status)}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    ดูรายละเอียด
                                  </Button>
                                </div>
                              </div>
                              <div className="mt-3 text-sm text-gray-600">
                                <div className="space-y-1">
                                  {verification.address && (
                                    <p>
                                      <span className="font-medium">ที่อยู่:</span>{" "}
                                      {verification.address.full_address} ต.
                                      {verification.address.sub_district} อ.
                                      {verification.address.district} จ.{verification.address.province}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-600">ไม่มีรายการที่ตรงกับสถานะนี้</p>
                        )}
                      </div>
                      {/* Load More Button */}
                      {filteredVerifications.length < total && filterStatus === "all" && (
                        <div className="mt-4 flex justify-center">
                          <Button onClick={loadMore}>โหลดเพิ่ม</Button>
                        </div>
                      )}
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
                  <Button variant="outline" onClick={refreshData}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    รีเฟรช
                  </Button>
                </div>
              </div>

              {selectedData && (
                <div className="space-y-6">
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
                      {selectedData.address ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">ที่อยู่ของผู้ยื่นยันตัวตน</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                              {selectedData.address.is_default ? (
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  ที่อยู่หลัก
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-gray-600 border-gray-600">
                                  ที่อยู่ทั่วไป
                                </Badge>
                              )}
                              {/* แสดงสถานะด้วย Badge และไอคอน */}
                              {getStatusText(selectedData.status)}
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">ที่อยู่ทั่วไป</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.address.full_address}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">จังหวัด</Label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{selectedData.address.province}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">อำเภอ/เขต</Label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{selectedData.address.district}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">ตำบล/แขวง</Label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{selectedData.address.sub_district}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">เลขไปรษณีย์</Label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{selectedData.address.postal_code}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-red-600">ไม่มีข้อมูลที่อยู่ผู้ยื่น</p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                    <TabsContent value="realEstate" className="mt-4">
                      {selectedData.address ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Building className="h-5 w-5 text-green-600" />
                              ที่อยู่ของอสังหาริมทรัพย์
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                              {selectedData.address.type === "real_estate" && (
                                <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                                  อสังหา
                                </Badge>
                              )}
                              {selectedData.address.type === "other" && (
                                <Badge variant="secondary" className="bg-gray-50 text-gray-700 border-gray-200">
                                  อื่นๆ
                                </Badge>
                              )}
                              {/* แสดงสถานะด้วย Badge และไอคอน */}
                              {getStatusText(selectedData.status)}
                            </div>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700">ที่อยู่ทั่วไป</Label>
                                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                  <p className="text-gray-900">{selectedData.address.full_address}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">จังหวัด</Label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{selectedData.address.province}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">อำเภอ/เขต</Label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{selectedData.address.district}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">ตำบล/แขวง</Label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{selectedData.address.sub_district}</p>
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium text-gray-700">เลขไปรษณีย์</Label>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-gray-900">{selectedData.address.postal_code}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-red-600">ไม่มีข้อมูลที่อยู่อสังหาริมทรัพย์</p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                  <div className="lg:col-span-1 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>การดำเนินการ</CardTitle>
                        <CardDescription>ตรวจสอบและยืนยันข้อมูลที่อยู่</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
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