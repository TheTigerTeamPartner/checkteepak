"use client"

import { supabase } from "@/lib/supabase"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Eye, RefreshCw, Building } from "lucide-react"

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
  type_id: number
  user_id: string
}

interface Verification {
  id: string
  user: User
  address: Address
  submittedAt: string
  status: string
}

// Component
export default function Component() {
  const [verifications, setVerifications] = useState<Verification[]>([])
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null)
  const [selectedUserAddresses, setSelectedUserAddresses] = useState<Verification[]>([])
  const [adminComment, setAdminComment] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)

  // Fetch Data for List View
  const fetchAddressVerifications = async (page: number) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/address?page=${page}`)
      if (!response.ok) throw new Error("Failed to fetch addresses")
      const { data, count } = await response.json()

      const formattedData = data.map((item: any) => ({
        id: item.id,
        user: {
          id: item.user?.id || "",
          name: item.user?.name || "ไม่ระบุ",
          email: item.user?.email || "ไม่ระบุ",
          phone: item.user?.phone || "ไม่ระบุ",  
          role: item.user?.role || "ไม่ระบุ",
          status: item.user?.status || "ไม่ระบุ",
          created_at: item.user?.created_at || "",
          updated_at: item.user?.updated_at || "",
        },
        address: {
          id: item.id,
          full_address: item.full_address || "ไม่ระบุ",
          province: item.province || "ไม่ระบุ",
          district: item.district || "ไม่ระบุ",
          sub_district: item.sub_district || "ไม่ระบุ",
          postal_code: item.postal_code || "ไม่ระบุ",
          is_default: item.is_default || false,
          status: item.status || "pending",
          created_at: item.created_at || "",
          updated_at: item.updated_at || "",
          type_id: item.type_id || 0,
          user_id: item.user_id || "",
        },
        submittedAt: item.created_at || "",
        status: item.status || "pending",
      }))

      setVerifications(formattedData)
      setTotal(count || 0)
    } catch (err: any) {
      console.error("Error:", err)
      setError(`เกิดข้อผิดพลาด: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch Addresses for Detail View
  const fetchUserAddresses = async (userId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/address?user_id=${userId}`)
      if (!response.ok) throw new Error("Failed to fetch user addresses")
      const { data } = await response.json()

      const formattedData = data.map((item: any) => ({
        id: item.id,
        user: {
          id: item.user?.id || "",
          name: item.user?.name || "ไม่ระบุ",
          email: item.user?.email || "ไม่ระบุ",
          phone: item.user?.phone || null,
          role: item.user?.role || "ไม่ระบุ",
          status: item.user?.status || "ไม่ระบุ",
          created_at: item.user?.created_at || "",
          updated_at: item.user?.updated_at || "",
        },
        address: {
          id: item.id,
          full_address: item.full_address || "ไม่ระบุ",
          province: item.province || "ไม่ระบุ",
          district: item.district || "ไม่ระบุ",
          sub_district: item.sub_district || "ไม่ระบุ",
          postal_code: item.postal_code || "ไม่ระบุ",
          is_default: item.is_default || false,
          status: item.status || "pending",
          created_at: item.created_at || "",
          updated_at: item.updated_at || "",
          type_id: item.type_id || 0,
          user_id: item.user_id || "",
        },
        submittedAt: item.created_at || "",
        status: item.status || "pending",
      }))

      setSelectedUserAddresses(formattedData)
    } catch (err: any) {
      console.error("Error:", err)
      setError(`เกิดข้อผิดพลาดในการดึงข้อมูลที่อยู่: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Update Address Status
  const updateAddressStatus = async (id: string, status: string, comment?: string) => {
    try {
      const response = await fetch(`/api/address`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }

      const { data } = await response.json();
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status, address: { ...v.address, status } } : v))
      );
      setSelectedUserAddresses((prev) =>
        prev.map((v) => (v.id === id ? { ...v, status, address: { ...v.address, status } } : v))
      );
      setAdminComment("");
    } catch (err: any) {
      setError(`เกิดข้อผิดพลาดในการอัปเดตสถานะ: ${err.message}`);
    }
  };

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
    if (selectedVerification) {
      const selected = verifications.find((v) => v.user.id === selectedVerification)
      if (selected?.user?.id) {
        fetchUserAddresses(selected.user.id)
      }
    }
  }

  // Load More
  const loadMore = () => {
    setPage((prev) => prev + 1)
  }

  // Fetch data on mount and when page changes
  useEffect(() => {
    fetchAddressVerifications(page)
  }, [page])

  // Fetch user addresses when selecting a verification
  useEffect(() => {
    if (selectedVerification) {
      const selected = verifications.find((v) => v.user.id === selectedVerification)
      if (selected?.user?.id) {
        fetchUserAddresses(selected.user.id)
      }
    } else {
      setSelectedUserAddresses([])
    }
  }, [selectedVerification, verifications])

  // Get unique users for list view
  const uniqueUsers = useMemo(() => {
    const userMap = new Map();
    verifications.forEach((v) => {
      if (!userMap.has(v.user.id)) {
        userMap.set(v.user.id, {
          id: v.user.id,
          name: v.user.name,
          email: v.user.email,
          phone: v.user.phone
        });
      }
    });
    return Array.from(userMap.values());
  }, [verifications]);

  // Convert status to Badge with icon
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

  // Filter verifications based on filterStatus
  const filteredUsers =
    filterStatus === "all" ? uniqueUsers : uniqueUsers.filter((u) => verifications.some(v => v.user.id === u.id && v.status === filterStatus))

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">ยืนยันที่อยู่</h1>
            <p className="text-gray-600">กรุณากรอกข้อมูลที่อยู่ปัจจุบันของคุณให้ครบถ้วน เพื่อใช้ในการยืนยันตัวตน</p>
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
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => {
                            const verification = verifications.find(v => v.user.id === user.id);
                            return (
                              <div
                                key={user.id}
                                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => setSelectedVerification(user.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{verification?.user?.name}</h3>
                                    <p className="text-sm text-gray-600">อีเมล: {verification?.user?.email}</p>
                                    <p className="text-sm text-gray-600">เบอร์โทรศัพท์: {verification?.user?.phone}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      {getStatusText(verification?.status || "pending")}
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    ดูรายละเอียด
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-gray-600">ไม่มีรายการที่ตรงกับสถานะนี้</p>
                        )}
                      </div>
                      {verifications.length < total && filterStatus === "all" && (
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
                <Button variant="outline" onClick={refreshData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  รีเฟรช
                </Button>
              </div>

              {selectedUserAddresses.length > 0 ? (
                <div className="space-y-6">
                  <Tabs defaultValue="applicant" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="applicant">ที่อยู่ผู้ยื่นยันตัวตน</TabsTrigger>
                      <TabsTrigger value="realEstate">ที่อยู่อสังหาริมทรัพย์</TabsTrigger>
                    </TabsList>
                    <TabsContent value="applicant" className="mt-4">
                      {selectedUserAddresses.some((v) => v.address.type_id === 1 && v.address.user_id === selectedVerification) ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">ที่อยู่ของผู้ยื่นยันตัวตน</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {selectedUserAddresses
                              .filter((v) => v.address.type_id === 1 && v.address.user_id === selectedVerification)
                              .map((verification) => (
                                <div key={verification.id} className="space-y-4 border-b pb-4 last:border-b-0">
                                  <div className="flex items-center gap-2">
                                    {verification.address.is_default ? (
                                      <Badge variant="outline" className="text-blue-600 border-blue-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        ที่อยู่หลัก
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="text-gray-600 border-gray-600">
                                        ที่อยู่ทั่วไป
                                      </Badge>
                                    )}
                                    {getStatusText(verification.status)}
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">ที่อยู่ทั่วไป</Label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-gray-900">{verification.address.full_address}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">จังหวัด</Label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900">{verification.address.province}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">อำเภอ/เขต</Label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900">{verification.address.district}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">ตำบล/แขวง</Label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900">{verification.address.sub_district}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">เลขไปรษณีย์</Label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900">{verification.address.postal_code}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-row space-x-2">
                                    <Button
                                      className="bg-green-600 hover:bg-green-700 w-1/2 text-sm"
                                      onClick={() => handleApprove(verification.id)}
                                      disabled={verification.status === "approved" || verification.status === "rejected"}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      อนุมัติ
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      className="w-1/2 text-sm"
                                      onClick={() => handleReject(verification.id)}
                                      disabled={verification.status === "approved" || verification.status === "rejected"}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      ปฏิเสธ
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </CardContent>
                        </Card>
                      ) : (
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-red-600">ไม่มีข้อมูลที่อยู่ผู้ยื่นยันตัวตนสำหรับผู้ใช้นี้</p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                    <TabsContent value="realEstate" className="mt-4">
                      {selectedUserAddresses.some((v) => v.address.type_id === 2 && v.address.user_id === selectedVerification) ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Building className="h-5 w-5 text-green-600" />
                              ที่อยู่อสังหาริมทรัพย์
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {selectedUserAddresses
                              .filter((v) => v.address.type_id === 2 && v.address.user_id === selectedVerification)
                              .map((verification) => (
                                <div key={verification.id} className="space-y-4 border-b pb-4 last:border-b-0">
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-50 text-green-700 border-green-200"
                                    >
                                      อสังหา
                                    </Badge>
                                    {getStatusText(verification.status)}
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium text-gray-700">ที่อยู่ทั่วไป</Label>
                                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                      <p className="text-gray-900">{verification.address.full_address}</p>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">จังหวัด</Label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900">{verification.address.province}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">อำเภอ/เขต</Label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900">{verification.address.district}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">ตำบล/แขวง</Label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900">{verification.address.sub_district}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-gray-700">เลขไปรษณีย์</Label>
                                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                        <p className="text-gray-900">{verification.address.postal_code}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex flex-row space-x-2">
                                    <Button
                                      className="bg-green-600 hover:bg-green-700 w-1/2 text-sm"
                                      onClick={() => handleApprove(verification.id)}
                                      disabled={verification.status === "approved" || verification.status === "rejected"}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      อนุมัติ
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      className="w-1/2 text-sm"
                                      onClick={() => handleReject(verification.id)}
                                      disabled={verification.status === "approved" || verification.status === "rejected"}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      ปฏิเสธ
                                    </Button>
                                  </div>
                                </div>
                              ))}
                          </CardContent>
                        </Card>
                      ) : (
                        <Card>
                          <CardContent className="p-4">
                            <p className="text-red-600">ไม่มีข้อมูลที่อยู่อสังหาริมทรัพย์สำหรับผู้ใช้นี้</p>
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-red-600">กำลังโหลด...</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}