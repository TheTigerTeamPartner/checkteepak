import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollText, Shield, Users, AlertTriangle, FileText, Settings, Ban } from "lucide-react"
import React from 'react'

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ScrollText className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">ข้อกำหนดการใช้งาน</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ข้อตกลงทางกฎหมายระหว่างผู้ให้บริการและผู้ใช้งาน กรุณาอ่านและทำความเข้าใจก่อนใช้บริการ
          </p>
          <Badge variant="outline" className="mt-4">
            อัปเดตล่าสุด: 15 กรกฎาคม 2025
          </Badge>
        </div>

        <div className="space-y-6">
          {/* การยอมรับข้อกำหนด */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                1. การยอมรับข้อกำหนด
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                การเข้าใช้งานเว็บไซต์หรือบริการของเรา ถือว่าท่านได้อ่าน เข้าใจ และยอมรับข้อกำหนดและเงื่อนไขการใช้งานทั้งหมดแล้ว
              </p>
              <p className="text-gray-700 leading-relaxed">หากท่านไม่ยอมรับข้อกำหนดเหล่านี้ กรุณาหยุดการใช้งานบริการของเราทันที</p>
            </CardContent>
          </Card>

          {/* สิทธิและหน้าที่ของผู้ใช้ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                2. สิทธิและหน้าที่ของผู้ใช้
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">สิทธิของผู้ใช้:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>ใช้บริการตามวัตถุประสงค์ที่กำหนด</li>
                  <li>เข้าถึงข้อมูลและฟีเจอร์ที่เปิดให้บริการ</li>
                  <li>ได้รับการปกป้องข้อมูลส่วนบุคคลตามนโยบายความเป็นส่วนตัว</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">หน้าที่ของผู้ใช้:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>ใช้บริการอย่างถูกต้องและเหมาะสม</li>
                  <li>ไม่ละเมิดกฎหมายหรือสิทธิของผู้อื่น</li>
                  <li>รักษาความปลอดภัยของบัญชีผู้ใช้</li>
                  <li>ให้ข้อมูลที่ถูกต้องและเป็นจริง</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* ข้อจำกัดการใช้งาน */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-600" />
                3. ข้อจำกัดการใช้งาน
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">ผู้ใช้ห้ามดำเนินการดังต่อไปนี้:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>ใช้บริการเพื่อกิจกรรมที่ผิดกฎหมายหรือไม่เหมาะสม</li>
                <li>พยายามเข้าถึงระบบโดยไม่ได้รับอนุญาต (แฮ็กกิ้ง)</li>
                <li>เผยแพร่เนื้อหาที่ไม่เหมาะสม ลามก หรือหมิ่นประมาท</li>
                <li>รบกวนหรือขัดขวางการใช้งานของผู้อื่น</li>
                <li>ส่งสแปมหรือข้อความที่ไม่พึงประสงค์</li>
                <li>ละเมิดลิขสิทธิ์หรือทรัพย์สินทางปัญญา</li>
              </ul>
            </CardContent>
          </Card>

          {/* ความเป็นส่วนตัว */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                4. ความเป็นส่วนตัวและการปกป้องข้อมูล
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                เราให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้ ข้อมูลส่วนบุคคลของท่านจะถูกเก็บรวบรวม ใช้งาน
                และปกป้องตามนโยบายความเป็นส่วนตัวของเรา
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">การใช้ข้อมูล:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800 ml-4">
                  <li>ปรับปรุงและพัฒนาบริการ</li>
                  <li>ติดต่อสื่อสารกับผู้ใช้</li>
                  <li>ป้องกันการใช้งานที่ผิดกฎหมาย</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* ความรับผิดชอบ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                5. ข้อจำกัดความรับผิดชอบ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                บริการของเราให้บริการ "ตามสภาพที่เป็น" เราไม่รับประกันว่าบริการจะไม่มีข้อผิดพลาดหรือจะทำงานได้อย่างต่อเนื่อง
              </p>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-orange-800 font-medium">
                  เราไม่รับผิดชอบต่อความเสียหายใดๆ ที่เกิดจากการใช้งานบริการ รวมถึงแต่ไม่จำกัดเพียง:
                </p>
                <ul className="list-disc list-inside space-y-1 text-orange-700 ml-4 mt-2">
                  <li>การสูญเสียข้อมูล</li>
                  <li>การหยุดชะงักของบริการ</li>
                  <li>ความเสียหายทางธุรกิจ</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* การเปลี่ยนแปลงข้อกำหนด */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                6. การเปลี่ยนแปลงข้อกำหนด
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                เราขอสงวนสิทธิ์ในการปรับปรุงหรือเปลี่ยนแปลงข้อกำหนดการใช้งานได้ตลอดเวลา โดยจะแจ้งให้ผู้ใช้ทราบล่วงหน้า
              </p>
              <div className="bg-indigo-50 p-4 rounded-lg">
                <p className="text-indigo-800">การใช้งานบริการต่อไปหลังจากมีการเปลี่ยนแปลงข้อกำหนด ถือว่าท่านยอมรับข้อกำหนดใหม่แล้ว</p>
              </div>
            </CardContent>
          </Card>

          {/* การยกเลิกบริการ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5 text-red-600" />
                7. การยกเลิกหรือระงับบริการ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">เราขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีผู้ใช้ในกรณีดังต่อไปนี้:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>การละเมิดข้อกำหนดการใช้งาน</li>
                <li>การใช้บริการในทางที่ผิดกฎหมาย</li>
                <li>การกระทำที่เป็นอันตรายต่อระบบหรือผู้ใช้อื่น</li>
                <li>การไม่ใช้งานบัญชีเป็นระยะเวลานาน</li>
              </ul>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-800 font-medium">การยกเลิกบัญชีอาจส่งผลให้ข้อมูลและเนื้อหาของท่านถูกลบออกจากระบบอย่างถาวร</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
