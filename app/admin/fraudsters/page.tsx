"use client"

import { useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
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
  cheater_name: string
  phone: string
  status: "pending" | "verified" | "rejected"
  riskLevel: "low" | "medium" | "high"
  accommodation_name?: string
  facebook_profile?: string
  instagram_profile?: string
  line_id?: string
  tiktok_profile?: string
  website_url?: string
  bank_name?: string
  bank_account?: string
  account_holder?: string
  description?: string
  incident_date?: string
  created_at: string
}

const FraudstersPage = () => {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedFraudster, setSelectedFraudster] = useState<Fraudster | null>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [fraudsters, setFraudsters] = useState<Fraudster[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    cheater_name: '',
    phone: '',
    accommodation_name: '',
    report_type: '',
    bank_name: '',
    bank_account: '',
    account_holder: '',
    facebook_profile: '',
    instagram_profile: '',
    line_id: '',
    tiktok_profile: '',
    website_url: '',
    description: '',
    incident_date: '',
    status: 'pending',
    riskLevel: 'medium' as 'low' | 'medium' | 'high'
  })

  // Fetch data from Supabase
  const fetchFraudsters = async () => {
    try {
      const { data, error } = await supabase
        .from('scammer')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setFraudsters(data || [])
    } catch (error) {
      console.error('Error fetching fraudsters:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchFraudsters()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
 


      const { data, error } = await supabase
        .from('scammer')
        .insert([{
          ...formData,
          // ให้ค่า default ถ้าไม่ได้กรอก
          title: formData.title || "ไม่มีหัวข้อ",
          description: formData.description || "ไม่มีรายละเอียด",
          status: 'pending',
          riskLevel: formData.riskLevel || 'medium'
        }])
        .select();

      if (error) throw error;

      if (data) {
        setFraudsters(prev => [data[0], ...prev]);
        setOpen(false);
        setFormData({
          cheater_name: '',
          phone: '',
          accommodation_name: '',
          report_type: '',
          bank_name: '',
          bank_account: '',
          account_holder: '',
          facebook_profile: '',
          instagram_profile: '',
          line_id: '',
          tiktok_profile: '',
          website_url: '',
          description: '',
          title: '', // อย่าลืมเพิ่ม title ตรงนี้ด้วย
          incident_date: '',
          status: 'pending',
          riskLevel: 'medium',
          evidence_urls: '',
          reporter_name: '',
          reporter_phone: '',
          reporter_email: '',
          other_social_media: '',
        });
        router.refresh();
      }
    } catch (error) {
      console.error('Error adding fraudster:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const totalFraudsters = fraudsters.length
  const verifiedFraudsters = fraudsters.filter((f) => f.status === "verified").length
  const pendingFraudsters = fraudsters.filter((f) => f.status === "pending").length
  const highRiskFraudsters = fraudsters.filter((f) => f.riskLevel === "high").length
  const totalCases = fraudsters.length;

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
      accessorKey: "cheater_name",
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
      cell: ({ row }) => row.original.cheater_name || 'ไม่มีข้อมูล',
    },
    {
      accessorKey: "phone",
      header: "เบอร์โทรศัพท์",
      cell: ({ row }) => row.original.phone || 'ไม่มีข้อมูล',
    },
    {
      accessorKey: "riskLevel",
      header: "ระดับความเสี่ยง",
      cell: ({ row }) => {
        const riskLevel = row.original.riskLevel || 'medium'
        const riskText = riskLevel === "high" ? "สูง" : riskLevel === "medium" ? "กลาง" : "ต่ำ"
        return <Badge className={getRiskBadgeColor(riskLevel)}>{riskText}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "สถานะ",
      cell: ({ row }) => {
        const status = row.original.status || 'pending'
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
            onClick={async () => {
              if (confirm("คุณต้องการลบข้อมูลมิจฉาชีพนี้หรือไม่?")) {
                try {
                  const { error } = await supabase
                    .from('scammer')
                    .delete()
                    .eq('id', row.original.id)

                  if (error) throw error
                  fetchFraudsters()
                } catch (error) {
                  console.error('Error deleting fraudster:', error)
                }
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
    data: fraudsters,
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
            value={(table.getColumn("cheater_name")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("cheater_name")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Search className="h-5 w-5 text-gray-500" />
        </div>

        <div className="flex items-center space-x-2">
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
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <h3 className="font-medium">กรอกข้อมูลมิจฉาชีพ:</h3>

                  {/* ข้อมูลที่พัก */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">ข้อมูลที่พัก</h4>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="cheater_name" className="text-right">
                        ชื่อผู้ที่โกง
                      </Label>
                      <Input
                        id="cheater_name"
                        name="cheater_name"
                        placeholder="ชื่อผู้ที่โกง"
                        className="col-span-3"
                        value={formData.cheater_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="accommodation_name" className="text-right">
                        ชื่อที่พัก
                      </Label>
                      <Input
                        id="accommodation_name"
                        name="accommodation_name"
                        placeholder="ชื่อที่พักที่มีปัญหา"
                        className="col-span-3"
                        value={formData.accommodation_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="phone" className="text-right">
                        เบอร์โทรศัพท์
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="เบอร์โทรศัพท์ที่พัก"
                        className="col-span-3"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="report_type" className="text-right">
                        ประเภทการโกง
                      </Label>
                      <Select
                        value={formData.report_type}
                        onValueChange={(value) => handleSelectChange('report_type', value)}
                      >
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
                      <Label htmlFor="facebook_profile" className="text-right">
                        Facebook Profile/Page
                      </Label>
                      <Input
                        id="facebook_profile"
                        name="facebook_profile"
                        placeholder="ลิงก์ Facebook"
                        className="col-span-3"
                        value={formData.facebook_profile}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="instagram_profile" className="text-right">
                        Instagram Profile
                      </Label>
                      <Input
                        id="instagram_profile"
                        name="instagram_profile"
                        placeholder="ลิงก์ Instagram"
                        className="col-span-3"
                        value={formData.instagram_profile}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="line_id" className="text-right">
                        Line ID
                      </Label>
                      <Input
                        id="line_id"
                        name="line_id"
                        placeholder="Line ID"
                        className="col-span-3"
                        value={formData.line_id}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="tiktok_profile" className="text-right">
                        TikTok Profile
                      </Label>
                      <Input
                        id="tiktok_profile"
                        name="tiktok_profile"
                        placeholder="ลิงก์ TikTok"
                        className="col-span-3"
                        value={formData.tiktok_profile}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="website_url" className="text-right">
                        เว็บไซต์
                      </Label>
                      <Input
                        id="website_url"
                        name="website_url"
                        placeholder="เว็บไซต์หรือลิงก์อื่นๆ"
                        className="col-span-3"
                        value={formData.website_url}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* ข้อมูลการชำระเงิน */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">ข้อมูลการชำระเงิน</h4>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="bank_name" className="text-right">
                        ธนาคาร
                      </Label>
                      <Select
                        value={formData.bank_name}
                        onValueChange={(value) => handleSelectChange('bank_name', value)}
                      >
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
                      <Label htmlFor="bank_account" className="text-right">
                        เลขบัญชี
                      </Label>
                      <Input
                        id="bank_account"
                        name="bank_account"
                        placeholder="123-4-56789-0"
                        className="col-span-3"
                        value={formData.bank_account}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="account_holder" className="text-right">
                        ชื่อบัญชี
                      </Label>
                      <Input
                        id="account_holder"
                        name="account_holder"
                        placeholder="ชื่อเจ้าของบัญชี"
                        className="col-span-3"
                        value={formData.account_holder}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {/* รายละเอียดเหตุการณ์ */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm text-muted-foreground">รายละเอียดเหตุการณ์</h4>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        รายละเอียดการหลอกลวง
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="อธิบายรายละเอียดเหตุการณ์..."
                        className="col-span-3"
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="incident_date" className="text-right">
                        วันที่เกิดเหตุ
                      </Label>
                      <Input
                        id="incident_date"
                        name="incident_date"
                        type="date"
                        className="col-span-3"
                        value={formData.incident_date}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="riskLevel" className="text-right">
                        ระดับความเสี่ยง
                      </Label>
                      <Select
                        value={formData.riskLevel}
                        onValueChange={(value: 'low' | 'medium' | 'high') => handleSelectChange('riskLevel', value)}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="เลือกระดับความเสี่ยง" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">ต่ำ</SelectItem>
                          <SelectItem value="medium">กลาง</SelectItem>
                          <SelectItem value="high">สูง</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      ยกเลิก
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'กำลังบันทึก...' : 'เพิ่มข้อมูลมิจฉาชีพ'}
                    </Button>
                  </div>
                </div>
              </form>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {typeof cell.column.columnDef.cell === "function"
                        ? cell.column.columnDef.cell(cell.getContext())
                        : cell.getValue()}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {isLoading ? 'กำลังโหลดข้อมูล...' : 'ไม่พบข้อมูลมิจฉาชีพ'}
                </TableCell>
              </TableRow>
            )}
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

      {/* Dialog for viewing fraudster details */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>รายละเอียดมิจฉาชีพ</DialogTitle>
            <DialogDescription>ข้อมูลและเคสการหลอกลวง</DialogDescription>
          </DialogHeader>
          {selectedFraudster && (
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
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">ชื่อ-นามสกุล</Label>
                    <Input defaultValue={selectedFraudster.cheater_name || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">ชื่อที่พัก</Label>
                    <Input defaultValue={selectedFraudster.accommodation_name || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium">ระดับความเสี่ยง</Label>
                    <Select 
                      defaultValue={selectedFraudster.riskLevel || 'medium'}
                      onValueChange={async (value: 'low' | 'medium' | 'high') => {
                        try {
                          // อัปเดทค่าใน state ก่อน (ถ้ามีการใช้ state)
                          setSelectedFraudster({
                            ...selectedFraudster,
                            riskLevel: value
                          });

                          // อัปเดทในฐานข้อมูล
                          const { error } = await supabase
                            .from('scammer')
                            .update({ riskLevel: value })
                            .eq('id', selectedFraudster.id);

                          if (error) throw error;

                          // แสดงข้อความสำเร็จ (optional)
                          toast.success('อัปเดทระดับความเสี่ยงเรียบร้อยแล้ว');
                          
                          // รีเฟรชข้อมูล (optional)
                          fetchFraudsters();
                        
                      } catch (error) {
                        console.error('Error updating risk level:', error);
                        toast.error('เกิดข้อผิดพลาดในการอัปเดทระดับความเสี่ยง');
                      }
                    }}
                  >
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
  <Select 
    defaultValue={selectedFraudster.status || 'pending'}
    onValueChange={async (value: 'pending' | 'verified' | 'rejected') => {
      try {
        // อัปเดทค่าใน state ก่อน (ถ้ามีการใช้ state)
        setSelectedFraudster({
          ...selectedFraudster,
          status: value
        });

        // อัปเดทในฐานข้อมูล
        const { error } = await supabase
          .from('scammer')
          .update({ status: value })
          .eq('id', selectedFraudster.id);

        if (error) throw error;

        // อัปเดทข้อมูลในตาราง
        setFraudsters(prev => prev.map(f => 
          f.id === selectedFraudster.id ? { ...f, status: value } : f
        ));

        // แสดงข้อความสำเร็จ
        toast.success('อัปเดทสถานะเรียบร้อยแล้ว');
        
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('เกิดข้อผิดพลาดในการอัปเดทสถานะ');
      }
    }}
  >
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
              </TabsContent>

              <TabsContent value="contact">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      เบอร์โทรศัพท์
                    </Label>
                    <Input defaultValue={selectedFraudster.phone || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      อีเมล
                    </Label>
                    <Input defaultValue={selectedFraudster.email || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Line ID
                    </Label>
                    <Input defaultValue={selectedFraudster.line_id || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      ที่อยู่
                    </Label>
                    <Textarea defaultValue={selectedFraudster.address || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Facebook className="mr-2 h-4 w-4" />
                      Facebook
                    </Label>
                    <Input defaultValue={selectedFraudster.facebook_profile || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Instagram className="mr-2 h-4 w-4" />
                      Instagram
                    </Label>
                    <Input defaultValue={selectedFraudster.instagram_profile || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right font-medium flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      เว็บไซต์
                    </Label>
                    <Input defaultValue={selectedFraudster.website_url || 'ไม่มีข้อมูล'} className="col-span-3" readOnly />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">บัญชีธนาคาร</h3>
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
                      {selectedFraudster.bank_name && selectedFraudster.bank_account ? (
                        <TableRow>
                          <TableCell>
  {selectedFraudster.bank_name === 'kbank' ? 'ธนาคารกสิกรไทย' :
   selectedFraudster.bank_name === 'scb' ? 'ธนาคารไทยพาณิชย์' :
   selectedFraudster.bank_name === 'bbl' ? 'ธนาคารกรุงเทพ' :
   selectedFraudster.bank_name === 'ktb' ? 'ธนาคารกรุงไทย' :
   selectedFraudster.bank_name === 'ttb' ? 'ธนาคารทหารไทยธนชาต' :
   selectedFraudster.bank_name === 'gsb' ? 'ธนาคารออมสิน' :
   selectedFraudster.bank_name === 'baac' ? 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร' :
   selectedFraudster.bank_name || 'ไม่มีข้อมูล'}
</TableCell>
                          <TableCell className="font-mono">
                            {selectedFraudster.bank_account || 'ไม่มีข้อมูล'}
                          </TableCell>
                          <TableCell>{selectedFraudster.account_holder || 'ไม่มีข้อมูล'}</TableCell>
                          <TableCell>
                            <Badge variant={selectedFraudster.status === "verified" ? "default" : "destructive"}>
                              {selectedFraudster.status === "verified" ? "ยืนยันแล้ว" : "ไม่ยืนยัน"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-4">
                            ไม่พบข้อมูลบัญชีธนาคาร
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="cases">
                {selectedFraudster && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">เคสการหลอกลวง (1 เคส)</h3>
                    </div>
                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">
                              {selectedFraudster.description || 'ไม่มีรายละเอียดการหลอกลวง'}
                            </CardTitle>
                            <Badge
                              variant={
                                selectedFraudster.status === "pending"
                                  ? "destructive"
                                  : selectedFraudster.status === "verified"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {selectedFraudster.status === "pending"
                                ? "รอตรวจสอบ"
                                : selectedFraudster.status === "verified"
                                  ? "ยืนยันแล้ว"
                                  : "ไม่อนุมัติ"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">ผู้ถูกหลอก:</span> {selectedFraudster.reporter_name || 'ไม่มีข้อมูล'}
                            </div>
                            <div>
                              <span className="font-medium">วันที่เกิดเหตุ:</span>{" "}
                              {selectedFraudster.incident_date
                                ? new Date(selectedFraudster.incident_date).toLocaleDateString("th-TH")
                                : 'ไม่มีข้อมูล'}
                            </div>
                            <div>
                              <span className="font-medium">ประเภทการโกง:</span> {selectedFraudster.report_type || 'ไม่มีข้อมูล'}
                            </div>
                            
                          </div>
                          <div className="mt-3">
                            <span className="font-medium">หลักฐาน:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {selectedFraudster.evidence_urls ? (
                                selectedFraudster.evidence_urls.split(',').map((evidence, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {evidence.trim()}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground">ไม่มีหลักฐาน</span>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
                        <CardTitle className="text-base">หลักฐานการโอนเงิน</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedFraudster.evidence_urls ? (
                          <div className="space-y-2">
                            {selectedFraudster.evidence_urls.split(',').map((url, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm truncate">{url.trim()}</span>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={url.trim()} target="_blank" rel="noopener noreferrer">
                                      ดาวน์โหลด
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-4">
                            ไม่มีหลักฐานการโอนเงิน
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">เอกสารประกอบ</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedFraudster.documents ? (
                          <div className="space-y-2">
                            {selectedFraudster.documents.split(',').map((doc, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm truncate">{doc.trim()}</span>
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={doc.trim()} target="_blank" rel="noopener noreferrer">
                                      ดาวน์โหลด
                                    </a>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-4">
                            ไม่มีเอกสารประกอบ
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

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