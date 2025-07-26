"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Upload, Clock, FileText, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type OverallVerificationStatus = "idle" | "processing" | "submitted_for_review"

interface DocumentItem {
  id: string
  name: string
  file: File | null
}

interface DocumentUploadBoxProps {
  doc: DocumentItem
  onFileChange: (id: string, file: File | null) => void
  isDisabled: boolean // To disable input during overall processing or if submitted
}

function DocumentUploadBox({ doc, onFileChange, isDisabled }: DocumentUploadBoxProps) {
  const handleInternalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileChange(doc.id, event.target.files[0])
    } else {
      onFileChange(doc.id, null)
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor={`file-upload-${doc.id}`} className="text-base font-medium cursor-pointer">
        {doc.name}
      </label>
      <div
        className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg min-h-[120px] transition-colors ${
          isDisabled ? "border-gray-200 bg-gray-100" : "border-gray-300 hover:border-gray-400 bg-gray-50"
        }`}
      >
        <input
          id={`file-upload-${doc.id}`}
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleInternalFileChange}
          accept="image/png, image/jpeg, image/jpg"
          disabled={isDisabled}
        />
        {doc.file ? (
          <div className="flex flex-col items-center gap-2">
            <FileText className="h-8 w-8 text-gray-500" />
            <p className="text-sm font-medium text-gray-700 text-center break-all">{doc.file.name}</p>
            {!isDisabled && ( // Only show change button if not disabled
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:bg-blue-50"
                onClick={() => onFileChange(doc.id, null)}
              >
                เปลี่ยนไฟล์
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-500" />
            <p className="text-sm font-medium text-gray-700">คลิกเพื่อเลือกไฟล์</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, JPEG (สูงสุด 10MB)</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DocumentUploadForm() {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: "idCard", name: "บัตรประชาชน", file: null },
    { id: "houseReg", name: "สำเนาทะเบียนบ้าน", file: null },
    { id: "bankStatement", name: "สำเนาบัญชี", file: null },
    { id: "landDeed", name: "สำเนาโฉนดที่ดิน", file: null },
  ])

  const [overallVerificationStatus, setOverallVerificationStatus] = useState<OverallVerificationStatus>("idle")
  const [overallStatusMessage, setOverallStatusMessage] = useState("")

  const uploadedCount = useMemo(() => documents.filter((doc) => doc.file !== null).length, [documents])
  const allDocumentsSelected = useMemo(() => uploadedCount === documents.length, [uploadedCount, documents.length])

  const isOverallProcessing = useMemo(() => overallVerificationStatus === "processing", [overallVerificationStatus])
  const isSubmittedForReview = useMemo(
    () => overallVerificationStatus === "submitted_for_review",
    [overallVerificationStatus],
  )

  const handleFileChange = useCallback((id: string, file: File | null) => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) =>
        doc.id === id
          ? {
              ...doc,
              file,
            }
          : doc,
      ),
    )
    // Reset overall status if any file is changed
    setOverallVerificationStatus("idle")
    setOverallStatusMessage("")
  }, [])

  const simulateSubmission = useCallback(() => {
    return new Promise<void>((resolve) => {
      // Simulate a short delay for "uploading" all files
      setTimeout(() => {
        resolve()
      }, 1500) // Simulate 1.5 seconds for submission
    })
  }, [])

  const handleClearAll = () => {
    setDocuments((prevDocs) =>
      prevDocs.map((doc) => ({
        ...doc,
        file: null,
      })),
    )
    setOverallVerificationStatus("idle")
    setOverallStatusMessage("")
  }

  const handleVerifyDocuments = async () => {
    if (!allDocumentsSelected) {
      setOverallStatusMessage("กรุณาอัปโหลดเอกสารให้ครบทุกประเภทก่อนดำเนินการยืนยัน")
      setOverallVerificationStatus("idle")
      return
    }

    setOverallVerificationStatus("processing")
    setOverallStatusMessage("กำลังดำเนินการส่งเอกสารทั้งหมด...")

    await simulateSubmission()

    setOverallVerificationStatus("submitted_for_review")
    setOverallStatusMessage("เอกสารทั้งหมดถูกส่งแล้ว รอการตรวจสอบจากผู้ดูแลระบบ")
  }

  const getOverallStatusDisplay = (status: OverallVerificationStatus) => {
    switch (status) {
      case "processing":
        return (
          <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-blue-50 border-blue-200">
            <Badge className="bg-blue-100 text-blue-700 border-blue-300 px-4 py-2 rounded-full text-base font-semibold flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" /> กำลังดำเนินการ...
            </Badge>
            <p className="text-sm text-center text-blue-700">{overallStatusMessage}</p>
          </div>
        )
      case "submitted_for_review":
        return (
          <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 px-4 py-2 rounded-full text-base font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 animate-spin" /> รออนุมัติ
            </Badge>
            <p className="text-sm text-center text-yellow-700">{overallStatusMessage}</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl shadow-lg bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold">ยืนยันเอกสาร</CardTitle>
          <CardDescription>กรุณาอัปโหลดเอกสารที่จำเป็นทั้งหมดเพื่อยืนยันตัวตน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {getOverallStatusDisplay(overallVerificationStatus)}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documents.map((doc) => (
              <DocumentUploadBox
                key={doc.id}
                doc={doc}
                onFileChange={handleFileChange}
                isDisabled={isOverallProcessing || isSubmittedForReview}
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <p className="text-base font-medium">
              อัปโหลดแล้ว: {uploadedCount} / {documents.length} เอกสาร
            </p>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleClearAll}
                className="w-full sm:w-auto bg-transparent"
                disabled={isOverallProcessing || isSubmittedForReview}
              >
                ล้างทั้งหมด
              </Button>
              <Button
                onClick={handleVerifyDocuments}
                disabled={!allDocumentsSelected || isOverallProcessing || isSubmittedForReview}
                className="w-full sm:w-auto"
              >
                {isOverallProcessing ? "กำลังดำเนินการ..." : "ยืนยันเอกสาร"}
              </Button>
            </div>
          </div>

          {!allDocumentsSelected && overallVerificationStatus === "idle" && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm mt-4">
              <span className="font-semibold">หมายเหตุ:</span> กรุณาอัปโหลดเอกสารให้ครบทุกประเภทก่อนดำเนินการยืนยัน
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
