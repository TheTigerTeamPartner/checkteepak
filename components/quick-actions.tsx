import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      title: "แจ้งที่พักโกง",
      description: "รายงานที่พักที่มีปัญหาหรือหลอกลวง",
      href: "/report",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <ShieldAlert className="h-6 w-6" />,
      title: "แจ้งเหตุโกง",
      description: "รายงานเหตุการณ์หลอกลวงที่เกิดขึ้น",
      href: "/report",
      color: "bg-orange-100 text-orange-600",
    },
  ]

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link href={action.href} key={index} className="block">
            <div
              className={`rounded-lg p-6 flex items-start gap-4 transition-all hover:shadow-md ${action.color.split(" ")[0]}/10 border border-${action.color.split(" ")[0]}/20`}
            >
              <div className={`p-3 rounded-full ${action.color}`}>{action.icon}</div>
              <div>
                <h3 className="font-medium text-lg mb-1">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
