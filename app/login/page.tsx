"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Mock authentication - ในระบบจริงจะส่งข้อมูลไป API
    console.log("Login attempt:", formData)

    // ตรวจสอบข้อมูลล็อกอิน (Mock)
    if (formData.email === "admin@checkteepak.com" && formData.password === "admin123") {
      alert("เข้าสู่ระบบสำเร็จ! กำลังเข้าสู่แดชบอร์ดผู้ดูแลระบบ...")
      window.location.href = "/dashboard"
    } else if (formData.email === "somchai@example.com" && formData.password === "somchai123") {
      alert("เข้าสู่ระบบสำเร็จ! กำลังเข้าสู่แดชบอร์ดสมาชิกยืนยัน...")
      window.location.href = "/dashboard"
    } else {
      alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">เข้าสู่ระบบ</CardTitle>
          <p className="text-gray-600">เข้าสู่ระบบเพื่อใช้งานฟีเจอร์เพิ่มเติม</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">อีเมล</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">รหัสผ่าน</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">จดจำการเข้าสู่ระบบ</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-teal-600 hover:underline">
                ลืมรหัสผ่าน?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              เข้าสู่ระบบ
            </Button>
          </form>

          <Separator />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-teal-600 hover:underline font-medium">
                สมัครสมาชิก
              </Link>
            </p>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full">
              เข้าสู่ระบบด้วย Google
            </Button>
            <Button variant="outline" className="w-full">
              เข้าสู่ระบบด้วย Facebook
            </Button>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">บัญชีทดสอบ:</h3>
            <div className="space-y-2 text-sm">
              <div>
                <strong>ผู้ดูแลระบบ:</strong>
                <br />
                อีเมล: admin@checkteepak.com
                <br />
                รหัสผ่าน: admin123
              </div>
              <div>
                <strong>สมาชิกยืนยัน:</strong>
                <br />
                อีเมล: somchai@example.com
                <br />
                รหัสผ่าน: somchai123
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
