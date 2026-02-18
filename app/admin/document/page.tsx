"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Check, X, FileText, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface UserDocument {
  id: string
  userId: string
  username: string
  fullName: string
  submittedAt: Date
  status: "pending" | "approved" | "rejected"
  documents: {
    id: string
    name: string
    url: string
    verified: boolean
  }[]
  adminNotes?: string
}

export default function AdminDocumentVerification() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")
  const [selectedSubmission, setSelectedSubmission] = useState<UserDocument | null>(null)
  const [rejectionReason, setRejectionReason] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Mock data - replace with actual API calls
  const mockSubmissions: UserDocument[] = [
    {
      id: "1",
      userId: "user123",
      username: "john_doe",
      fullName: "John Doe",
      submittedAt: new Date("2023-05-15"),
      status: "pending",
      documents: [
        { id: "national-id", name: "บัตรประชาชน", url: "/sample-id.jpg", verified: false },
        { id: "house-registration", name: "สำเนาทะเบียนบ้าน", url: "/sample-house.jpg", verified: false },
        { id: "bank-account", name: "สำเนาบัญชี", url: "/sample-bank.jpg", verified: false },
      ]
    },
    {
      id: "2",
      userId: "user456",
      username: "jane_smith",
      fullName: "Jane Smith",
      submittedAt: new Date("2023-05-10"),
      status: "approved",
      documents: [
        { id: "national-id", name: "บัตรประชาชน", url: "/sample-id-2.jpg", verified: true },
        { id: "house-registration", name: "สำเนาทะเบียนบ้าน", url: "/sample-house-2.jpg", verified: true },
        { id: "bank-account", name: "สำเนาบัญชี", url: "/sample-bank-2.jpg", verified: true },
        { id: "land-title", name: "สำเนาโฉนดที่ดิน", url: "/sample-land.jpg", verified: true },
      ]
    },
    {
      id: "3",
      userId: "user789",
      username: "robert_johnson",
      fullName: "Robert Johnson",
      submittedAt: new Date("2023-05-05"),
      status: "rejected",
      adminNotes: "เอกสารไม่ชัดเจน กรุณาอัปโหลดใหม่",
      documents: [
        { id: "national-id", name: "บัตรประชาชน", url: "/sample-id-3.jpg", verified: false },
        { id: "bank-account", name: "สำเนาบัญชี", url: "/sample-bank-3.jpg", verified: false },
      ]
    },
    {
      id: "4",
      userId: "user101",
      username: "sarah_williams",
      fullName: "Sarah Williams",
      submittedAt: new Date("2023-05-01"),
      status: "pending",
      documents: [
        { id: "national-id", name: "บัตรประชาชน", url: "/sample-id-4.jpg", verified: false },
        { id: "house-registration", name: "สำเนาทะเบียนบ้าน", url: "/sample-house-4.jpg", verified: false },
      ]
    },
    {
      id: "5",
      userId: "user202",
      username: "michael_brown",
      fullName: "Michael Brown",
      submittedAt: new Date("2023-04-28"),
      status: "pending",
      documents: [
        { id: "national-id", name: "บัตรประชาชน", url: "/sample-id-5.jpg", verified: false },
        { id: "house-registration", name: "สำเนาทะเบียนบ้าน", url: "/sample-house-5.jpg", verified: false },
        { id: "bank-account", name: "สำเนาบัญชี", url: "/sample-bank-5.jpg", verified: false },
        { id: "land-title", name: "สำเนาโฉนดที่ดิน", url: "/sample-land-5.jpg", verified: false },
      ]
    },
    {
      id: "6",
      userId: "user303",
      username: "emily_davis",
      fullName: "Emily Davis",
      submittedAt: new Date("2023-04-25"),
      status: "approved",
      documents: [
        { id: "national-id", name: "บัตรประชาชน", url: "/sample-id-6.jpg", verified: true },
        { id: "house-registration", name: "สำเนาทะเบียนบ้าน", url: "/sample-house-6.jpg", verified: true },
      ]
    },
  ]

  // Filter submissions based on search and status
  const filteredSubmissions = mockSubmissions.filter(submission => {
    const matchesSearch = 
      submission.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.userId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const approveSubmission = (id: string) => {
    // In a real app, this would be an API call
    console.log(`Approved submission ${id}`)
    // Update the mock data
    const updated = mockSubmissions.map(sub => 
      sub.id === id ? { ...sub, status: "approved" } : sub
    )
    // In real app, you would set state with the response from API
  }

  const rejectSubmission = (id: string) => {
    // In a real app, this would be an API call
    console.log(`Rejected submission ${id} with reason: ${rejectionReason}`)
    // Update the mock data
    const updated = mockSubmissions.map(sub => 
      sub.id === id ? { ...sub, status: "rejected", adminNotes: rejectionReason } : sub
    )
    // In real app, you would set state with the response from API
    setSelectedSubmission(null)
    setRejectionReason("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">รอตรวจสอบ</Badge>
      case "approved":
        return <Badge className="bg-green-500 hover:bg-green-600">อนุมัติแล้ว</Badge>
      case "rejected":
        return <Badge variant="destructive">ถูกปฏิเสธ</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">การยืนยันเอกสารผู้ใช้</CardTitle>
                <CardDescription className="text-gray-600">
                  ตรวจสอบและจัดการเอกสารที่ผู้ใช้ส่งมาเพื่อยืนยันตัวตน
                </CardDescription>
              </div>
              <div className="mt-4 md:mt-0 flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="ค้นหาผู้ใช้..."
                    className="pl-9 w-full md:w-[300px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as any)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="pending">รอตรวจสอบ</SelectItem>
                    <SelectItem value="approved">อนุมัติแล้ว</SelectItem>
                    <SelectItem value="rejected">ถูกปฏิเสธ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-500">ไม่พบข้อมูลการยืนยันเอกสาร</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ผู้ใช้</TableHead>
                      <TableHead>วันที่ส่ง</TableHead>
                      <TableHead>เอกสาร</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead className="text-right">ดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="font-medium">{submission.fullName}</div>
                          <div className="text-sm text-gray-500">@{submission.username}</div>
                        </TableCell>
                        <TableCell>
                          {submission.submittedAt.toLocaleDateString("th-TH")}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {submission.documents.map(doc => (
                              <Badge key={doc.id} variant="outline" className="text-xs">
                                {doc.name}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(submission.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedSubmission(submission)}
                          >
                            ตรวจสอบ
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    แสดง {paginatedSubmissions.length} จาก {filteredSubmissions.length} รายการ
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center px-4 text-sm">
                      หน้า {currentPage} จาก {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Document Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>ตรวจสอบเอกสาร</CardTitle>
                  <CardDescription>
                    {selectedSubmission.fullName} (@{selectedSubmission.username})
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSubmission(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <h3 className="font-medium">ข้อมูลผู้ใช้</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">ชื่อเต็ม</p>
                      <p>{selectedSubmission.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">ชื่อผู้ใช้</p>
                      <p>@{selectedSubmission.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">วันที่ส่ง</p>
                      <p>{selectedSubmission.submittedAt.toLocaleDateString("th-TH")}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">สถานะ</p>
                      <div className="mt-1">
                        {getStatusBadge(selectedSubmission.status)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <h3 className="font-medium">เอกสารที่ส่งมา</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedSubmission.documents.map((document) => (
                      <div key={document.id} className="border rounded-lg overflow-hidden">
                        <div className="p-3 bg-gray-50 border-b">
                          <h4 className="font-medium">{document.name}</h4>
                        </div>
                        <div className="p-4">
                          <img
                            src={document.url}
                            alt={document.name}
                            className="w-full h-48 object-contain border rounded"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedSubmission.adminNotes && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                    <h4 className="font-medium text-red-800">เหตุผลที่ปฏิเสธ</h4>
                    <p className="text-sm text-red-700 mt-1">{selectedSubmission.adminNotes}</p>
                  </div>
                )}

                {selectedSubmission.status === "pending" && (
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="rejectionReason">หมายเหตุ (หากปฏิเสธ)</Label>
                      <Input
                        id="rejectionReason"
                        placeholder="ระบุเหตุผลหากต้องการปฏิเสธ..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <Button
                        variant="destructive"
                        onClick={() => rejectSubmission(selectedSubmission.id)}
                        disabled={!rejectionReason}
                      >
                        <X className="h-4 w-4 mr-2" />
                        ปฏิเสธ
                      </Button>
                      <Button
                        onClick={() => approveSubmission(selectedSubmission.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        อนุมัติ
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}