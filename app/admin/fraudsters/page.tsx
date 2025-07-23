"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  Edit,
  FileText,
  Search,
  UserPlus,
  Phone,
  Mail,
  CreditCard,
  Globe,
  Facebook,
  Instagram,
  MessageCircle,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
} from "lucide-react"

interface Fraudster {
  id: string
  name: string
  email: string
  phone: string
  address: string
  lineId: string
  facebookPage: string
  instagramAccount: string
  website: string
  bankAccounts: BankAccount[]
  cases: Case[]
  verified: boolean
  riskLevel: "low" | "medium" | "high"
  status: "pending" | "verified" | "rejected"
  dateAdded: string
  reportedBy: string
}

interface BankAccount {
  id: string
  bankName: string
  accountNumber: string
  accountName: string
  verified: boolean
}

interface Case {
  id: string
  description: string
  date: string
  status: "open" | "closed" | "investigating"
  victimName: string
  fraudType: string
  evidence: string[]
}

const mockFraudsters: Fraudster[] = [
  {
    id: "1",
    name: "สมชาย ใจดี",
    email: "somchai.fake@gmail.com",
    phone: "081-234-5678",
    address: "123/45 ซอยลาดพร้าว 15 เขตจตุจักร กรุงเทพฯ 10900",
    lineId: "@somchai_property",
    facebookPage: "facebook.com/somchai.property.fake",
    instagramAccount: "@somchai_realestate",
    website: "www.somchai-property.com",
    bankAccounts: [
      {
        id: "1",
        bankName: "ธนาคารกสิกรไทย",
        accountNumber: "123-4-56789-0",
        accountName: "นายสมชาย ใจดี",
        verified: false,
      },
      {
        id: "2",
        bankName: "ธนาคารไทยพาณิชย์",
        accountNumber: "987-6-54321-0",
        accountName: "นายสมชาย ใจดี",
        verified: false,
      },
    ],
    cases: [
      {
        id: "1",
        description: "หลอกขายคอนโดปลอม โครงการ The Luxury Condo",
        date: "2024-01-15",
        status: "investigating",
        victimName: "นางสาวมาลี สวยงาม",
        fraudType: "หลอกขายที่พัก",
        evidence: ["screenshot_transfer.jpg", "fake_contract.pdf"],
      },
      {
        id: "2",
        description: "หลอกให้จ่ายค่ามัดจำห้องเช่าปลอม",
        date: "2024-02-10",
        status: "open",
        victimName: "นายจิรายุ มั่งมี",
        fraudType: "หลอกเก็บเงินมัดจำ",
        evidence: ["line_chat.jpg", "fake_receipt.jpg"],
      },
    ],
    verified: false,
    riskLevel: "high",
    status: "pending",
    dateAdded: "2024-03-01",
    reportedBy: "ระบบรับเรื่องร้องเรียน",
  },
  {
    id: "2",
    name: "วิไล หลอกลวง",
    email: "wilai.scammer@hotmail.com",
    phone: "089-876-5432",
    address: "456/78 ถนนสุขุมวิท 21 เขตวัฒนา กรุงเทพฯ 10110",
    lineId: "@wilai_agent",
    facebookPage: "facebook.com/wilai.realestate.pro",
    instagramAccount: "@wilai_luxury_homes",
    website: "www.wilai-homes.net",
    bankAccounts: [
      {
        id: "3",
        bankName: "ธนาคารกรุงเทพ",
        accountNumber: "555-1-23456-7",
        accountName: "นางวิไล หลอกลวง",
        verified: false,
      },
    ],
    cases: [
      {
        id: "3",
        description: "แอบอ้างเป็นนายหน้าอสังหาริมทรัพย์ หลอกเก็บค่าคอมมิชชั่น",

        date: "2024-01-20",
        status: "closed",
        victimName: "นายประยุทธ์ ซื่อสัตย์",
        fraudType: "นายหน้าปลอม",
        evidence: ["fake_license.jpg", "commission_receipt.pdf"],
      },
      {
        id: "4",
        description: "หลอกขายบ้านที่ไม่มีอยู่จริง",
        date: "2024-02-05",
        status: "investigating",
        victimName: "นางสุดา ดีใจ",
        fraudType: "หลอกขายที่พัก",
        evidence: ["fake_photos.zip", "forged_documents.pdf"],
      },
    ],
    verified: true,
    riskLevel: "high",
    status: "verified",
    dateAdded: "2024-02-15",
    reportedBy: "เจ้าหน้าที่ตรวจสอบ",
  },
  {
    id: "3",
    name: "ดำรง โกงเงิน",
    email: "damrong.fraud@yahoo.com",
    phone: "092-111-2222",
    address: "789/12 ซอยรามคำแหง 24 เขตวังทองหลาง กรุงเทพฯ 10310",
    lineId: "@damrong_property",
    facebookPage: "facebook.com/damrong.investment",
    instagramAccount: "@damrong_rich",
    website: "www.damrong-invest.com",
    bankAccounts: [
      {
        id: "4",
        bankName: "ธนาคารกรุงไทย",
        accountNumber: "777-8-99999-1",
        accountName: "นายดำรง โกงเงิน",
        verified: false,
      },
      {
        id: "5",
        bankName: "ธนาคารทหารไทยธนชาต",
        accountNumber: "333-2-11111-5",
        accountName: "นายดำรง โกงเงิน",
        verified: false,
      },
    ],
    cases: [
      {
        id: "5",
        description: "หลอกลงทุนโครงการคอนโดปลอม",
        date: "2024-01-10",
        status: "open",
        victimName: "นายสมศักดิ์ รวยเร็ว",
        fraudType: "หลอกลงทุน",
        evidence: ["investment_proposal.pdf", "fake_permits.jpg"],
      },
    ],
    verified: false,
    riskLevel: "high",
    status: "rejected",
    dateAdded: "2024-01-25",
    reportedBy: "ระบบรับเรื่องร้องเรียน",
  },
]

const FraudstersPage = () => {
  const [open, setOpen] = useState(false)
  const [selectedFraudster, setSelectedFraudster] = useState<Fraudster | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const totalFraudsters = mockFraudsters.length
  const verifiedFraudsters = mockFraudsters.filter((f) => f.status === "verified").length
  const pendingFraudsters = mockFraudsters.filter((f) => f.status === "pending").length
  const totalCases = mockFraudsters.reduce((acc, f) => acc + f.cases.length, 0)
  const highRiskFraudsters = mockFraudsters.filter((f) => f.riskLevel === "high").length

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500 text-white"
      case "pending":
        return "bg-yellow-500 text-white"
      case "rejected":
        return "bg-red-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const columns: ColumnDef<Fraudster>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            ชื่อ-นามสกุล
            {column.getIsSorted() === false ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <ArrowUp className="ml-2 h-4 w-4" />
            )}
          </Button>
        )
      },
      cell: ({ row }) => row.original.name,
    },
    {
      accessorKey: "phone",
      header: "เบอร์โทรศัพท์",
    },
    {
      accessorKey: "riskLevel",
      header: "ระดับความเสี่ยง",
      cell: ({ row }) => {
        const riskLevel = row.original.riskLevel
        const riskText = riskLevel === "high" ? "สูง" : riskLevel === "medium" ? "กลาง" : "ต่ำ"
        return <Badge className={getRiskBadgeColor(riskLevel)}>{riskText}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "สถานะ",
      cell: ({ row }) => {
        const status = row.original.status
        const statusText = status === "verified" ? "ยืนยันแล้ว" : status === "pending" ? "รอตรวจสอบ" : "ไม่อนุมัติ"
        const StatusIcon = status === "verified" ? CheckCircle : status === "pending" ? Clock : X
        return (
            <Badge className={getStatusBadgeColor(status)}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusText}
            </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "การดำเนินการ",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedFraudster(row.original)
              setOpen(true)
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            ดูรายละเอียด
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle delete
              if (confirm("คุณต้องการลบข้อมูลมิจฉาชีพนี้หรือไม่?")) {
                console.log("Delete fraudster:", row.original.id)
              }
            }}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: mockFraudsters,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">ฐานข้อมูลมิจฉาชีพที่ยืนยันแล้ว</h1>

      <p className="text-gray-600 mb-5">
        ฐานข้อมูลมิจฉาชีพที่ได้รับการตรวจสอบและยืนยันแล้ว ข้อมูลเหล่านี้จะแสดงในผลลัพธ์การค้นหาของลูกค้า เพื่อป้องกันการถูกหลอกลวง
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-5">
        <Card>
          <CardHeader>
            <CardTitle>มิจฉาชีพที่ยืนยันแล้ว</CardTitle>
            <CardDescription>จำนวนมิจฉาชีพในระบบ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFraudsters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>แสดงในระบบค้นหา</CardTitle>
            <CardDescription>ข้อมูลที่ตรวจสอบแล้ว</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedFraudsters}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ซ่อนจากระบบค้นหา</CardTitle>
            <CardDescription>รอการตรวจสอบข้อมูล</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingFraudsters}</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>เคสทั้งหมด</CardTitle>
            <CardDescription>จำนวนเคสการโกง</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCases}</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>ความเสี่ยงสูง</CardTitle>
            <CardDescription>มิจฉาชีพอันตราย</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskFraudsters}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="ค้นหามิจฉาชีพ..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Search className="h-5 w-5 text-gray-500" />
        </div>

        <div className="flex items-center space-x-2">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            ดึงจากเรื่องร้องเรียน
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                เพิ่มมิจฉาชีพใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>เพิ่มข้อมูลมิจฉาชีพใหม่</DialogTitle>
                <DialogDescription>เลือกประเภทข้อมูลที่ต้องการเพิ่ม</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="select-type" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="select-type">เลือกประเภทข้อมูล</TabsTrigger>
                  <TabsTrigger value="add-data">กรอกข้อมูล</TabsTrigger>
                </TabsList>

                <TabsContent value="select-type" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <h3 className="font-medium">เลือกประเภทข้อมูลที่ต้องการเพิ่ม:</h3>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="id-card" className="rounded" />
                        <Label htmlFor="id-card" className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          เลขบัตรประชาชน
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="phone" className="rounded" />
                        <Label htmlFor="phone" className="flex items-center">
                          <Phone className="mr-2 h-4 w-4" />
                          เบอร์โทรศัพท์
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="facebook" className="rounded" />
                        <Label htmlFor="facebook" className="flex items-center">
                          <Facebook className="mr-2 h-4 w-4" />
                          Facebook Page
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="instagram" className="rounded" />
                        <Label htmlFor="instagram" className="flex items-center">
                          <Instagram className="mr-2 h-4 w-4" />
                          Instagram
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="line" className="rounded" />
                        <Label htmlFor="line" className="flex items-center">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Line ID
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="line-oa" className="rounded" />
                        <Label htmlFor="line-oa" className="flex items-center">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Line OA
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="tiktok" className="rounded" />
                        <Label htmlFor="tiktok" className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          TikTok
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="bank-account" className="rounded" />
                        <Label htmlFor="bank-account" className="flex items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          เลขบัญชีธนาคาร
                        </Label>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="w-full">ดำเนินการต่อ</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="add-data" className="space-y-4">
                  <div className="grid gap-4 py-4">
                    <h3 className="font-medium">กรอกข้อมูลมิจฉาชีพ:</h3>

                    {/* ข้อมูลที่พัก */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">ข้อมูลที่พัก</h4>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="accommodation-name" className="text-right">
                          ชื่อที่พัก
                        </Label>
                        <Input id="accommodation-name" placeholder="ชื่อที่พักที่มีปัญหา" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="accommodation-phone" className="text-right">
                          เบอร์โทรศัพท์
                        </Label>
                        <Input id="accommodation-phone" placeholder="เบอร์โทรศัพท์ที่พัก" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fraud-type" className="text-right">
                          ประเภทการโกง
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="เลือกประเภทการโกง" />
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
                    </div>

                    {/* ข้อมูล Social Media */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">ข้อมูล Social Media</h4>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="facebook-profile" className="text-right">
                          Facebook Profile/Page
                        </Label>
                        <Input id="facebook-profile" placeholder="ลิงก์ Facebook" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="instagram-profile" className="text-right">
                          Instagram Profile
                        </Label>
                        <Input id="instagram-profile" placeholder="ลิงก์ Instagram" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="line-id-input" className="text-right">
                          Line ID
                        </Label>
                        <Input id="line-id-input" placeholder="Line ID" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tiktok-profile" className="text-right">
                          TikTok Profile
                        </Label>
                        <Input id="tiktok-profile" placeholder="ลิงก์ TikTok" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="website-url" className="text-right">
                          เว็บไซต์
                        </Label>
                        <Input id="website-url" placeholder="เว็บไซต์หรือลิงก์อื่นๆ" className="col-span-3" />
                      </div>
                    </div>

                    {/* ข้อมูลการชำระเงิน */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">ข้อมูลการชำระเงิน</h4>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bank-name-select" className="text-right">
                          ธนาคาร
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="เลือกธนาคาร" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kbank">ธนาคารกสิกรไทย</SelectItem>
                            <SelectItem value="scb">ธนาคารไทยพาณิชย์</SelectItem>
                            <SelectItem value="bbl">ธนาคารกรุงเทพ</SelectItem>
                            <SelectItem value="ktb">ธนาคารกรุงไทย</SelectItem>
                            <SelectItem value="ttb">ธนาคารทหารไทยธนชาต</SelectItem>
                            <SelectItem value="gsb">ธนาคารออมสิน</SelectItem>
                            <SelectItem value="baac">ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account-number-input" className="text-right">
                          เลขบัญชี
                        </Label>
                        <Input id="account-number-input" placeholder="123-4-56789-0" className="col-span-3" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="account-name-input" className="text-right">
                          ชื่อบัญชี
                        </Label>
                        <Input id="account-name-input" placeholder="ชื่อเจ้าของบัญชี" className="col-span-3" />
                      </div>
                    </div>

                    {/* รายละเอียดเหตุการณ์ */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm text-muted-foreground">รายละเอียดเหตุการณ์</h4>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incident-description" className="text-right">
                          รายละเอียดการหลอกลวง
                        </Label>
                        <Textarea
                          id="incident-description"
                          placeholder="อธิบายรายละเอียดเหตุการณ์..."
                          className="col-span-3"
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="incident-date" className="text-right">
                          วันที่เกิดเหตุ
                        </Label>
                        <Input id="incident-date" type="date" className="col-span-3" />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button variant="outline">ยกเลิก</Button>
                      <Button>เพิ่มข้อมูลมิจฉาชีพ</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-5">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-yellow-800">คำเตือน</h3>
            <p className="text-sm text-yellow-700 mt-1">
              การเพิ่มข้อมูลมิจฉาชีพลงในฐานข้อมูลนี้ จะมีผลต่อการแสดงข้อมูลในระบบค้นหาของลูกค้า โปรดตรวจสอบข้อมูลให้ถูกต้อง และเป็นปัจจุบันเสมอ
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-blue-800">ข้อมูลสาธารณะ</h3>
            <p className="text-sm text-blue-700 mt-1">
              ข้อมูลมิจฉาชีพในหน้านี้จะแสดงในผลลัพธ์การค้นหาของลูกค้า เพื่อช่วยป้องกันการถูกหลอกลวง กรุณาตรวจสอบความถูกต้องก่อนเผยแพร่
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === "function"
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {typeof cell.column.columnDef.cell === "function"
                      ? cell.column.columnDef.cell(cell.getContext())
                      : cell.getValue()}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex-1 text-sm text-muted-foreground">
          แสดง {table.getFilteredRowModel().rows.length} จาก {table.getCoreRowModel().rows.length} รายการ
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ก่อนหน้า
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            ถัดไป
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดมิจฉาชีพ</DialogTitle>
            <DialogDescription>ข้อมูลและเคสการหลอกลวง</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile">ข้อมูลพื้นฐาน</TabsTrigger>
              <TabsTrigger value="contact">ข้อมูลติดต่อ</TabsTrigger>
              <TabsTrigger value="social">โซเชียลมีเดีย</TabsTrigger>
              <TabsTrigger value="bank">บัญชีธนาคาร</TabsTrigger>
              <TabsTrigger value="cases">เคสการโกง</TabsTrigger>
              <TabsTrigger value="evidence">หลักฐาน</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {selectedFraudster && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">ชื่อ-นามสกุล</Label>
                    <Input defaultValue={selectedFraudster.name} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">ที่อยู่</Label>
                    <Textarea defaultValue={selectedFraudster.address} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">ระดับความเสี่ยง</Label>
                    <Select defaultValue={selectedFraudster.riskLevel}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">ต่ำ</SelectItem>
                        <SelectItem value="medium">กลาง</SelectItem>
                        <SelectItem value="high">สูง</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">สถานะ</Label>
                    <Select defaultValue={selectedFraudster.status}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">รอตรวจสอบ</SelectItem>
                        <SelectItem value="verified">ยืนยันแล้ว</SelectItem>
                        <SelectItem value="rejected">ไม่อนุมัติ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contact">
              {selectedFraudster && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      เบอร์โทรศัพท์
                    </Label>
                    <Input defaultValue={selectedFraudster.phone} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      อีเมล
                    </Label>
                    <Input defaultValue={selectedFraudster.email} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Line ID
                    </Label>
                    <Input defaultValue={selectedFraudster.lineId} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      ที่อยู่
                    </Label>
                    <Textarea defaultValue={selectedFraudster.address} className="col-span-3" />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="social">
              {selectedFraudster && (
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook Page
                    </Label>
                    <Input defaultValue={selectedFraudster.facebookPage} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </Label>
                    <Input defaultValue={selectedFraudster.instagramAccount} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      เว็บไซต์
                    </Label>
                    <Input defaultValue={selectedFraudster.website} className="col-span-3" />
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bank">
              {selectedFraudster && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">บัญชีธนาคาร</h3>
                    <Button size="sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      เพิ่มบัญชีใหม่
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ธนาคาร</TableHead>
                        <TableHead>เลขบัญชี</TableHead>
                        <TableHead>ชื่อบัญชี</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedFraudster.bankAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>{account.bankName}</TableCell>
                          <TableCell className="font-mono">{account.accountNumber}</TableCell>
                          <TableCell>{account.accountName}</TableCell>
                          <TableCell>
                            <Badge variant={account.verified ? "default" : "destructive"}>
                              {account.verified ? "ยืนยันแล้ว" : "ไม่ยืนยัน"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cases">
              {selectedFraudster && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">เคสการหลอกลวง ({selectedFraudster.cases.length} เคส)</h3>
                  </div>
                  <div className="space-y-4">
                    {selectedFraudster.cases.map((caseItem) => (
                      <Card key={caseItem.id}>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{caseItem.description}</CardTitle>
                            <Badge
                              variant={
                                caseItem.status === "open"
                                  ? "destructive"
                                  : caseItem.status === "investigating"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {caseItem.status === "open"
                                ? "เปิด"
                                : caseItem.status === "investigating"
                                  ? "กำลังสอบสวน"
                                  : "ปิด"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">ผู้ถูกหลอก:</span> {caseItem.victimName}
                            </div>
                            <div>
                              <span className="font-medium">วันที่เกิดเหตุ:</span>{" "}
                              {new Date(caseItem.date).toLocaleDateString("th-TH")}
                            </div>
                            <div>
                              <span className="font-medium">ประเภทการโกง:</span> {caseItem.fraudType}
                            </div>
                          </div>
                          <div className="mt-3">
                            <span className="font-medium">หลักฐาน:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {caseItem.evidence.map((evidence, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {evidence}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="evidence">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">หลักฐานและเอกสาร</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">รูปภาพหลักฐาน</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">screenshot_transfer.jpg</span>
                            <Button size="sm" variant="outline">
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">line_chat.jpg</span>
                            <Button size="sm" variant="outline">
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">เอกสารประกอบ</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">fake_contract.pdf</span>
                            <Button size="sm" variant="outline">
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">fake_receipt.jpg</span>
                            <Button size="sm" variant="outline">
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setOpen(false)}>
              ปิด
            </Button>
            <Button variant="destructive">
              <AlertTriangle className="mr-2 h-4 w-4" />
              ปฏิเสธ
            </Button>
            <Button>
              <CheckCircle className="mr-2 h-4 w-4" />
              อนุมัติ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FraudstersPage
