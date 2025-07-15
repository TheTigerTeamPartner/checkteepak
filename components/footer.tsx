import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Logo" className="w-auto h-9" />
              <span className="font-bold text-xl hidden sm:inline-block">เช็คที่พัก</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              ระบบตรวจสอบความน่าเชื่อถือของที่พักในไทย เพื่อความปลอดภัยในการท่องเที่ยวของคุณ
            </p>
            <div className="flex space-x-4">
              <a href="/coming-soon" className="text-gray-400 hover:text-teal-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="/coming-soon" className="text-gray-400 hover:text-teal-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="/coming-soon" className="text-gray-400 hover:text-teal-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">บริการของเรา</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-teal-600 text-sm">
                  ค้นหาที่พัก
                </Link>
              </li>
              <li>
                <Link href="/report" className="text-gray-600 hover:text-teal-600 text-sm">
                  แจ้งที่พักโกง
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-gray-600 hover:text-teal-600 text-sm">
                  ยืนยันตัวตนเจ้าของที่พัก
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="text-gray-600 hover:text-teal-600 text-sm">
                  คำถามที่พบบ่อย
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">ข้อมูลเพิ่มเติม</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-teal-600 text-sm">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="text-gray-600 hover:text-teal-600 text-sm">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
              <li>
                <Link href="/rule" className="text-gray-600 hover:text-teal-600 text-sm">
                  ข้อกำหนดการใช้งาน
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="text-gray-600 hover:text-teal-600 text-sm">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-4">ติดต่อ</h3>
            <address className="not-italic">
              <p className="text-gray-600 text-sm mb-2">อีเมล: checkteepuk@gmail.com</p>
              <p className="text-gray-600 text-sm mb-2">โทร: 02-123-4567</p>
              <p className="text-gray-600 text-sm">
                ที่อยู่: 123 อาคารเช็คที่พัก ถนนสุขุมวิท
                <br />
                แขวงคลองเตย เขตคลองเตย
                <br />
                กรุงเทพฯ 10110
              </p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-6">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} เช็คที่พัก (Check Teepak) สงวนลิขสิทธิ์
          </p>
        </div>
      </div>
    </footer>
  )
}
