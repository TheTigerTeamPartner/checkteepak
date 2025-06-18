export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">กำลังค้นหา...</h2>
            <p className="text-gray-600">กำลังตรวจสอบข้อมูลในระบบ</p>
          </div>
        </div>
      </div>
    </div>
  )
}
