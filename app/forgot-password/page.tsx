"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createClientComponentClient()

  const handleSendReset = async () => {
    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/update-password", // เปลี่ยนเป็น domain จริงใน production
    })

    if (error) {
      setMessage("เกิดข้อผิดพลาด: " + error.message)
    } else {
      setMessage("ส่งลิงก์เปลี่ยนรหัสผ่านไปยังอีเมลของคุณแล้ว")
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">ลืมรหัสผ่าน</CardTitle>
          <p className="text-gray-600">เราจะส่งลิงก์เปลี่ยนรหัสผ่านไปที่อีเมลของคุณ</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && <p className="text-sm text-gray-700">{message}</p>}

          <div>
            <Label htmlFor="email">อีเมล</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <Button className="w-full" onClick={handleSendReset} disabled={loading}>
            {loading ? "กำลังส่ง..." : "ส่งลิงก์เปลี่ยนรหัสผ่าน"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
