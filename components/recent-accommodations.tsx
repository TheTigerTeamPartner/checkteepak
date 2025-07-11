"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, MapPin } from "lucide-react"
import { supabase } from "@/lib/supabase"

type AgentStatus = "verified" | "new" | "experienced"

interface Agent {
  id: string
  name: string
  location: string
  image_url: string
  status: AgentStatus
  rating: number
  review_count: number
  phone: string
  specialties: string[]
  created_at: string
  updated_at: string
  user_id: string
  user: {
    id: string
    email: string
  }
}

export function RecentAccommodations() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAgents()
  }, [])

  // ฟังก์ชันสำหรับแสดง status badge
  const getStatusBadge = (status: AgentStatus) => {
    switch (status) {
      case "verified":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3" />
            ยืนยันตัวตนแล้ว
          </Badge>
        )
      case "experienced":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            มืออาชีพ
          </Badge>
        )
      case "new":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            สมาชิกใหม่
          </Badge>
        )
      default:
        return null
    }
  }

  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(12)

      if (agentsError) {
        console.error('Error fetching agents:', agentsError)
        throw agentsError
      }

      if (agentsData && agentsData.length > 0) {
        const userIds = agentsData.map(agent => agent.user_id)
        const { data: usersData, error: usersError } = await supabase
          .from('users')
          .select('id, email')
          .in('id', userIds)

        if (usersError) {
          console.error('Error fetching users:', usersError)
          throw usersError
        }

        const combinedData = agentsData.map(agent => ({
          ...agent,
          user: usersData?.find(user => user.id === agent.user_id)
        }))

        
        setAgents(combinedData)
      } else {
        setAgents(agentsData || [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="pt-2 md:pt-4 px-2 md:px-4 flex justify-center">
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-full bg-gray-200"></div>
            </div>
            <CardContent className="p-2 md:p-4 text-center">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">เกิดข้อผิดพลาด: {error}</p>
        <button
          onClick={fetchAgents}
          className="mt-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
        >
          ลองอีกครั้ง
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
      {agents.map((agent) => (
        <Link href={`/agent/${agent.id}`} key={agent.id}>
          <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="pt-2 md:pt-4 px-2 md:px-4 flex justify-center">
              <div className="h-16 w-16 md:h-24 md:w-24 rounded-full overflow-hidden border-2 border-teal-100">
                <img
                  src={agent.image_url || "/placeholder.svg"}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <CardContent className="p-2 md:p-4 text-center">
              <h3 className="font-medium text-gray-900 mb-1 text-sm md:text-base truncate">{agent.name}</h3>
              <div className="flex items-center justify-center mb-2 scale-90 md:scale-100">
                <MapPin className="h-4 w-4 mr-1" />
                {agent.location}
              </div>
              {getStatusBadge(agent.status)}
              <div className="flex items-center justify-center mt-2">
                <span className="text-sm text-gray-600">
                  รีวิว: {agent.review_count} ครั้ง
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}