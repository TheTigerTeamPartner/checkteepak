import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function VerificationLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      {/* การ์ดแสดงความคืบหน้า */}
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-[200px] mb-2" />
          <Skeleton className="h-4 w-[300px]" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-[50px]" />
            </div>
            <Skeleton className="h-2 w-full" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Skeleton className="h-6 w-6 rounded-full mb-1" />
                  <Skeleton className="h-4 w-8 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* แท็บแสดงรายการยืนยัน */}
      <div>
        <Skeleton className="h-10 w-[600px] mb-6" />

        <div className="space-y-4">
          <Skeleton className="h-6 w-[150px] mb-4" />

          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-[150px] mb-2" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-[80px]" />
                    <Skeleton className="h-8 w-[100px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Skeleton className="h-6 w-[150px] my-4" />

          {[1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                      <Skeleton className="h-5 w-[150px] mb-2" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-[80px]" />
                    <Skeleton className="h-8 w-[100px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
