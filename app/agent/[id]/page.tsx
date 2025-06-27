"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  CheckCircle,
  Shield,
  Globe,
  Facebook,
  Instagram,
  ExternalLink,
  Copy,
  AlertTriangle,
  CreditCard,
  User,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface AgentProfile {
  id: string
  name: string
  title: string
  location: string
  join_date: string
  verified: boolean
  profile_image: string
  cover_image: string
  bio: string
  specialties: string[]
  contact: {
    phone: string
    email: string
    line_id: string
  }
  social: {
    facebook: string
    instagram: string
    website: string
  }
  stats: {
    total_contacts: number
    response_rate: number
    avg_response_time: string
    successful_deals: number
    profile_views: number
  }
  status: "verified" | "experienced" | "new"
  certifications: {
    id: number
    name: string
    issuer: string
    date: string
    verified: boolean
  }[]
  banking: {
    id: number
    bank_name: string
    account_number: string
    account_name: string
    is_primary: boolean
  }[]
}

export default function AgentProfilePage() {
  const [agentData, setAgentData] = useState<AgentProfile | null>(null)
const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const params = useParams()
  const agentId = params.id

  useEffect(() => {
    console.log('Fetching agent with id:', agentId)
    
    if (!agentId) {
      setError('No agent ID provided')
      return
    }

    const fetchAgentData = async () => {
      try {
        setLoading(true)
        console.log('Fetching from Supabase...')
        
        const { data, error } = await supabase
          .from('agents')
          .select('*')
          .eq('id', agentId)
          .single()

        if (error) {
          console.error('Supabase error:', {
            message: error.message,
            details: error.details,
            code: error.code,
            hint: error.hint
          })
          setError(`Error: ${error.message}\nDetails: ${error.details}\nCode: ${error.code}`)
          return
        }

        if (!data) {
          setError(`No agent found with ID: ${agentId}`)
          return
        }

        console.log('Successfully fetched agent:', {
          id: data.id,
          name: data.name
        })
        setAgentData(data)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError(`Failed to fetch agent data: ${err instanceof Error ? err.message : 'Unknown error'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchAgentData()
  }, [agentId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!agentData) return <div>No agent found</div>

  const copyContact = (type: string, value: string) => {
    navigator.clipboard.writeText(value)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 lg:h-80 bg-gradient-to-r from-teal-500 via-blue-600 to-indigo-600 overflow-hidden">
        <img
          src={agentData?.cover_image || "/placeholder.svg"}
          alt="Cover"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/30 to-blue-600/30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 lg:-mt-24 relative z-10">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-8">
            <div className="relative mx-auto lg:mx-0">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-teal-50">
                <img
                  src={agentData?.profile_image || "/placeholder.svg"}
                  alt={agentData?.name || "Agent"}
                  className="w-full h-full object-cover"
                />
              </div>
              {agentData?.verified && (
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-green-500 rounded-full p-2 md:p-2.5 shadow-lg ring-4 ring-white">
                  <CheckCircle className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6">
                <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {agentData?.name}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-600 font-medium">{agentData?.title}</p>
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 text-sm md:text-base text-gray-500">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-teal-600" />
                      <span>{agentData?.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-teal-600" />
                      <span>สมาชิกตั้งแต่ {agentData?.join_date}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-3">
                    {agentData?.status === "verified" && (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 text-sm font-medium">
                        <Shield className="h-3 w-3 mr-1.5" />
                        ยืนยันตัวตนแล้ว
                      </Badge>
                    )}
                    {agentData?.status === "experienced" && (
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1.5 text-sm font-medium"
                      >
                        <CheckCircle className="h-3 w-3 mr-1.5" />
                        มืออาชีพ
                      </Badge>
                    )}
                    {agentData?.status === "new" && (
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 px-3 py-1.5 text-sm font-medium"
                      >
                        <User className="h-3 w-3 mr-1.5" />
                        สมาชิกใหม่
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 md:space-y-8">
          {/* 1. ข้อมูลพื้นฐาน */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-800">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-teal-600" />
                </div>
                ข้อมูลพื้นฐาน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-gray-700 leading-relaxed text-base md:text-lg">{agentData?.bio}</p>
              <div>
                <h4 className="font-semibold mb-3 text-gray-800 text-lg">ความเชี่ยวชาญ</h4>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {agentData?.specialties?.map((specialty, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 text-sm font-medium"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          {/* 2. ข้อมูลติดต่อ */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-800">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                </div>
                ข้อมูลติดต่อ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Phone className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">เบอร์โทรศัพท์</div>
                    <div className="text-sm md:text-base text-gray-600">{agentData?.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  {agentData?.status === "verified" ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ยืนยันแล้ว
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ไม่ได้ยืนยัน
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyContact("phone", agentData?.phone)}
                    className="hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Mail className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">อีเมล</div>
                    <div className="text-sm md:text-base text-gray-600">{agentData?.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  {agentData?.status === "verified" ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ยืนยันแล้ว
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ไม่ได้ยืนยัน
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyContact("email", agentData?.email)}
                    className="hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <MessageCircle className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Line ID</div>
                    <div className="text-sm md:text-base text-gray-600">{agentData?.line_id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  {agentData?.status === "verified" ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ยืนยันแล้ว
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ไม่ได้ยืนยัน
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyContact("line", agentData?.line_id)}
                    className="hover:bg-gray-100"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3. ช่องทางการตลาด */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-800">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Globe className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                ช่องทางการตลาด
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Facebook className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Facebook Page</div>
                    <div className="text-sm md:text-base text-gray-600">{agentData?.social_facebook}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  {agentData?.status === "verified" ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ยืนยันแล้ว
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ไม่ได้ยืนยัน
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" asChild className="hover:bg-blue-100">
                  <a href={agentData?.social_facebook} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-5 bg-gradient-to-r from-pink-50 to-pink-100 rounded-xl border border-pink-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Instagram className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Instagram</div>
                    <div className="text-sm md:text-base text-gray-600">{agentData?.instagram}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  {agentData?.status === "verified" ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ยืนยันแล้ว
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ไม่ได้ยืนยัน
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" asChild className="hover:bg-pink-100">
                  <a href={agentData?.instagram} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Globe className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">เว็บไซต์</div>
                    <div className="text-sm md:text-base text-gray-600">{agentData?.website}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 md:mt-0">
                  {agentData?.status === "verified" ? (
                    <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      ยืนยันแล้ว
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-red-600 border-red-600 bg-red-50">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ไม่ได้ยืนยัน
                    </Badge>
                  )}
                  <Button variant="outline" size="sm" asChild className="hover:bg-gray-100">
                  <a href={agentData?.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4. ช่องทางการเงิน */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-gray-800">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                </div>
                ข้อมูลการเงิน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {agentData?.banking?.map((account) => (
                <div
                  key={account.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-5 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <CreditCard className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{account.bankName}</div>
                      <div className="text-sm md:text-base text-gray-600">
                        {account.accountNumber} - {account.accountName}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 md:mt-0">
                    {account.isPrimary && (
                      <Badge variant="default" className="bg-teal-600 hover:bg-teal-700 text-white">
                        บัญชีหลัก
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyContact("account", account.accountNumber)}
                      className="hover:bg-green-100"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Warning Section */}
          {agentData?.status === "verified" && (
            <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
                    <AlertTriangle className="h-6 w-6 md:h-7 md:w-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-amber-800 mb-3 text-lg md:text-xl">ข้อควรระวัง</h3>
                    <p className="text-amber-700 text-sm md:text-base leading-relaxed">
                      แม้ว่าโปรไฟล์นี้จะผ่านการยืนยันตัวตนแล้ว แต่ควรตรวจสอบข้อมูลเพิ่มเติมก่อนทำธุรกรรม
                      และหลีกเลี่ยงการโอนเงินล่วงหน้าทั้งจำนวนโดยไม่มีหลักประกัน
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
