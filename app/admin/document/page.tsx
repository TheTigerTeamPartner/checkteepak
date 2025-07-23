"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  approval_status: 'pending' | 'approved' | 'rejected';
  approval_history: {
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    reason?: string;
  }[];
}

export default function VerifyProfilePage() {
  const [pendingProfiles, setPendingProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPendingProfiles()
  }, [])

  const fetchPendingProfiles = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('approval_status', 'pending')

      if (error) throw error
      setPendingProfiles(data || [])
    } catch (error) {
      console.error('Error fetching pending profiles:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดึงข้อมูลผู้ใช้ที่รอการยืนยันได้",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          approval_status: 'approved',
          approval_history: {
            status: 'approved',
            created_at: new Date().toISOString(),
            reason: 'อนุมัติโดยผู้ดูแลระบบ'
          }
        })
        .eq('id', userId)

      if (error) throw error
      toast({
        title: "สำเร็จ",
        description: "อนุมัติข้อมูลเรียบร้อยแล้ว"
      })
      fetchPendingProfiles()
    } catch (error) {
      console.error('Error approving profile:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอนุมัติข้อมูลได้",
        variant: "destructive"
      })
    }
  }

  const handleReject = async (userId: string) => {
    try {
      const reason = prompt("กรุณาใส่เหตุผลการปฏิเสธ:")
      if (!reason) return

      const { error } = await supabase
        .from('users')
        .update({
          approval_status: 'rejected',
          approval_history: {
            status: 'rejected',
            created_at: new Date().toISOString(),
            reason
          }
        })
        .eq('id', userId)

      if (error) throw error
      toast({
        title: "สำเร็จ",
        description: "ปฏิเสธข้อมูลเรียบร้อยแล้ว"
      })
      fetchPendingProfiles()
    } catch (error) {
      console.error('Error rejecting profile:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถปฏิเสธข้อมูลได้",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">กำลังโหลด...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">รายการข้อมูลที่รอการยืนยัน</h1>

      {pendingProfiles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          ไม่มีข้อมูลที่รอการยืนยัน
        </div>
      ) : (
        <div className="space-y-4">
          {pendingProfiles.map((profile) => (
            <Card key={profile.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {profile.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">ข้อมูลพื้นฐาน</h3>
                    <p>ชื่อ: {profile.name}</p>
                    <p>อีเมล: {profile.email}</p>
                    <p>เบอร์โทร: {profile.phone}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleReject(profile.id)}
                      className="bg-red-50 text-red-600 hover:bg-red-100"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      ปฏิเสธ
                    </Button>
                    <Button
                      onClick={() => handleApprove(profile.id)}
                      className="bg-green-50 text-green-600 hover:bg-green-100"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      อนุมัติ
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
