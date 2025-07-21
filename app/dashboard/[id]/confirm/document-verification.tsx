"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, X, FileImage } from "lucide-react"

interface DocumentUpload {
  id: string
  name: string
  file: File | null
  preview: string | null
}

export default function DocumentVerification() {
  const [documents, setDocuments] = useState<DocumentUpload[]>([
    { id: "national-id", name: "บัตรประชาชน", file: null, preview: null },
    { id: "house-registration", name: "สำเนาทะเบียนบ้าน", file: null, preview: null },
    { id: "bank-account", name: "สำเนาบัญชี", file: null, preview: null },
    { id: "land-title", name: "สำเนาโฉนดที่ดิน", file: null, preview: null },
  ])

  const handleFileUpload = (documentId: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setDocuments((prev) =>
        prev.map((doc) => (doc.id === documentId ? { ...doc, file, preview: e.target?.result as string } : doc)),
      )
    }
    reader.readAsDataURL(file)
  }

  const removeFile = (documentId: string) => {
    setDocuments((prev) => prev.map((doc) => (doc.id === documentId ? { ...doc, file: null, preview: null } : doc)))
  }

  const handleSubmit = () => {
    const uploadedDocs = documents.filter((doc) => doc.file)
    console.log("Uploaded documents:", uploadedDocs)
    // Handle form submission here
  }

  const allDocumentsUploaded = documents.every((doc) => doc.file)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">ยืนยันเอกสาร</CardTitle>
            <CardDescription className="text-gray-600">กรุณาอัปโหลดเอกสารที่จำเป็นทั้งหมดเพื่อยืนยันตัวตน</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {documents.map((document) => (
                <div key={document.id} className="space-y-2">
                  <Label htmlFor={document.id} className="text-sm font-medium text-gray-700">
                    {document.name}
                  </Label>

                  {!document.preview ? (
                    <div className="relative">
                      <Input
                        id={document.id}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(document.id, file)
                        }}
                      />
                      <Label
                        htmlFor={document.id}
                        className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:bg-gray-100"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="mt-2 text-sm text-gray-500">คลิกเพื่ือเลือกไฟล์</span>
                        <span className="text-xs text-gray-400">PNG, JPG, JPEG (สูงสุด 10MB)</span>
                      </Label>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="relative h-32 overflow-hidden rounded-lg border">
                        <img
                          src={document.preview || "/placeholder.svg"}
                          alt={document.name}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <FileImage className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full p-0"
                        onClick={() => removeFile(document.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="mt-1 text-xs text-gray-500 truncate">{document.file?.name}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
                <div className="text-sm text-gray-600">
                  อัปโหลดแล้ว: {documents.filter((doc) => doc.file).length} / {documents.length} เอกสาร
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setDocuments((prev) => prev.map((doc) => ({ ...doc, file: null, preview: null })))}
                  >
                    ล้างทั้งหมด
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!allDocumentsUploaded}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    ยืนยันเอกสาร
                  </Button>
                </div>
              </div>
            </div>

            {!allDocumentsUploaded && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                <div className="flex items-start">
                  <div className="text-sm text-amber-800">
                    <strong>หมายเหตุ:</strong> กรุณาอัปโหลดเอกสารให้ครบทุกประเภทก่อนดำเนินการยืนยัน
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
