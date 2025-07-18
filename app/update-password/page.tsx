"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const hash = window.location.hash
  
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const access_token = params.get("access_token")
      const refresh_token = params.get("refresh_token")
  
      if (access_token && refresh_token) {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(({ error }) => {
          if (error) {
            setMessage("ลิงก์หมดอายุ หรือไม่ถูกต้อง กรุณาลองรีเซ็ตใหม่")
          }
        })
      }
    }
  }, [])


  const handleUpdate = async () => {
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setMessage("เกิดข้อผิดพลาด: " + error.message)
    } else {
      setMessage("เปลี่ยนรหัสผ่านสำเร็จ กำลังพาไปยังหน้าเข้าสู่ระบบ...")
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ตั้งรหัสผ่านใหม่</CardTitle>
          <p className="text-gray-600">โปรดกรอกรหัสผ่านใหม่ของคุณ</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && <p className="text-sm text-gray-700">{message}</p>}

          <div>
            <Label htmlFor="password">รหัสผ่านใหม่</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleUpdate} disabled={loading || !password}>
            {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
