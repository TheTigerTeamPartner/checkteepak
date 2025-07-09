import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Users, Shield, Search, Award, Building, Clock, ChevronRight } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "คุณสมศักดิ์ นวัตกรรม",
      role: "ผู้ก่อตั้งและซีอีโอ",
      image: "/placeholder.svg?height=200&width=200",
      description: "อดีตผู้บริหารด้านเทคโนโลยีจากบริษัทท่องเที่ยวชั้นนำ มีประสบการณ์ในวงการท่องเที่ยวกว่า 15 ปี",
    },
    {
      name: "คุณนภา วิเคราะห์",
      role: "ผู้อำนวยการฝ่ายข้อมูล",
      image: "/placeholder.svg?height=200&width=200",
      description: "ผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูลและระบบความปลอดภัย เคยทำงานกับหน่วยงานภาครัฐด้านการป้องกันการฉ้อโกง",
    },
    {
      name: "คุณวิชัย พัฒนา",
      role: "หัวหน้าทีมพัฒนา",
      image: "/placeholder.svg?height=200&width=200",
      description: "วิศวกรซอฟต์แวร์มากประสบการณ์ เชี่ยวชาญด้านการพัฒนาแพลตฟอร์มออนไลน์และระบบตรวจสอบความน่าเชื่อถือ",
    },
  ]

  const milestones = [
    {
      year: "2564",
      title: "ก่อตั้งบริษัท",
      description: "เริ่มต้นจากทีมเล็กๆ ที่มีความตั้งใจแก้ปัญหาการหลอกลวงในธุรกิจที่พัก",
    },
    {
      year: "2565",
      title: "เปิดตัวเว็บไซต์",
      description: "เปิดให้บริการเว็บไซต์เช็คที่พักเวอร์ชันแรก พร้อมฐานข้อมูลเริ่มต้น 1,000 รายการ",
    },
    {
      year: "2565",
      title: "ร่วมมือกับพันธมิตร",
      description: "เริ่มความร่วมมือกับสมาคมโรงแรมไทยและผู้ประกอบการที่พักชั้นนำ",
    },
    {
      year: "2566",
      title: "ขยายฐานข้อมูล",
      description: "ฐานข้อมูลเพิ่มขึ้นเป็น 10,000 รายการ ครอบคลุมที่พักทั่วประเทศไทย",
    },
    {
      year: "2566",
      title: "เปิดตัวแอปพลิเคชัน",
      description: "เปิดตัวแอปพลิเคชันมือถือทั้งระบบ iOS และ Android",
    },
    {
      year: "2567",
      title: "ปัจจุบัน",
      description: "มีผู้ใช้งานกว่า 500,000 คน และช่วยป้องกันการหลอกลวงได้มากกว่า 5,000 กรณี",
    },
  ]

  const services = [
    {
      icon: <Search className="h-10 w-10 text-teal-600" />,
      title: "ตรวจสอบที่พัก",
      description: "ค้นหาและตรวจสอบความน่าเชื่อถือของที่พักก่อนจอง เพื่อความมั่นใจในการเดินทาง",
    },
    {
      icon: <Shield className="h-10 w-10 text-teal-600" />,
      title: "แจ้งเตือนภัย",
      description: "รับการแจ้งเตือนเมื่อมีรายงานการหลอกลวงใหม่ที่เกี่ยวข้องกับที่พักที่คุณสนใจ",
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-teal-600" />,
      title: "รับรองที่พัก",
      description: "บริการตรวจสอบและรับรองที่พักสำหรับผู้ประกอบการที่ต้องการสร้างความน่าเชื่อถือ",
    },
    {
      icon: <Users className="h-10 w-10 text-teal-600" />,
      title: "ชุมชนนักเดินทาง",
      description: "แลกเปลี่ยนประสบการณ์และข้อมูลกับนักเดินทางคนอื่นๆ ในชุมชนของเรา",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-teal-500 to-blue-500 rounded-xl overflow-hidden mb-16">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=600&width=1200')] opacity-10 bg-cover bg-center" />
        <div className="relative px-6 py-16 md:py-24 md:px-12 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">เกี่ยวกับเช็คที่พัก</h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            เราเป็นแพลตฟอร์มที่มุ่งมั่นสร้างความปลอดภัยในการท่องเที่ยวและการจองที่พักในประเทศไทย ด้วยระบบตรวจสอบความน่าเชื่อถือที่ทันสมัย
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-white text-teal-600 hover:bg-white/90">
              ติดต่อเรา
            </Button>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-200 border-none">พันธกิจของเรา</Badge>
            <h2 className="text-3xl font-bold mb-6">สร้างการท่องเที่ยวที่ปลอดภัยสำหรับทุกคน</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              เช็คที่พักเกิดขึ้นจากประสบการณ์ตรงของผู้ก่อตั้งที่เคยถูกหลอกลวงจากการจองที่พักออนไลน์
              เราจึงมุ่งมั่นที่จะสร้างแพลตฟอร์มที่ช่วยให้นักท่องเที่ยวสามารถตรวจสอบความน่าเชื่อถือของที่พักก่อนการจอง
              เพื่อลดความเสี่ยงและสร้างความมั่นใจในการเดินทาง
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 p-2 rounded-full mt-1">
                  <Shield className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">ป้องกันการหลอกลวง</h3>
                  <p className="text-gray-600">เราช่วยป้องกันการหลอกลวงด้วยระบบตรวจสอบที่ทันสมัย และฐานข้อมูลที่อัปเดตตลอดเวลา</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 p-2 rounded-full mt-1">
                  <Users className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">สร้างชุมชนที่แข็งแกร่ง</h3>
                  <p className="text-gray-600">เราสร้างชุมชนที่สมาชิกช่วยกันแชร์ข้อมูลและประสบการณ์ เพื่อปกป้องซึ่งกันและกัน</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-teal-100 p-2 rounded-full mt-1">
                  <Award className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">ส่งเสริมผู้ประกอบการที่ดี</h3>
                  <p className="text-gray-600">
                    เรามอบการรับรองให้กับผู้ประกอบการที่มีความน่าเชื่อถือ เพื่อส่งเสริมธุรกิจที่ดำเนินการอย่างโปร่งใส
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="พันธกิจของเช็คที่พัก"
                width={600}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg w-48">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-teal-600" />
                <span className="font-bold text-gray-900">ปกป้องแล้ว</span>
              </div>
              <div className="text-2xl font-bold text-teal-600">500,000+</div>
              <div className="text-sm text-gray-600">นักท่องเที่ยว</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mb-16 bg-gray-50 rounded-xl p-8">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">วิธีการทำงาน</Badge>
          <h2 className="text-3xl font-bold mb-4">ระบบตรวจสอบของเรา</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เช็คที่พักใช้เทคโนโลยีล้ำสมัยและการตรวจสอบโดยมนุษย์ควบคู่กัน เพื่อให้ข้อมูลที่แม่นยำและเชื่อถือได้
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Search className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">รวบรวมข้อมูล</h3>
            <p className="text-gray-600">
              เราเก็บข้อมูลจากหลายแหล่ง ทั้งจากผู้ใช้งาน พันธมิตร และการค้นหาของทีมงาน เพื่อสร้างฐานข้อมูลที่ครอบคลุม
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">วิเคราะห์และตรวจสอบ</h3>
            <p className="text-gray-600">
              ทีมผู้เชี่ยวชาญของเราวิเคราะห์ข้อมูลและตรวจสอบความถูกต้อง โดยใช้ทั้งเทคโนโลยี AI และการตรวจสอบโดยมนุษย์
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">ให้ผลการตรวจสอบ</h3>
            <p className="text-gray-600">
              เราแสดงผลการตรวจสอบในรูปแบบที่เข้าใจง่าย พร้อมระดับความน่าเชื่อถือและคำแนะนำสำหรับผู้ใช้งาน
            </p>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-200 border-none">บริการของเรา</Badge>
          <h2 className="text-3xl font-bold mb-4">บริการที่เรานำเสนอ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เช็คที่พักมีบริการหลากหลายเพื่อช่วยให้การท่องเที่ยวของคุณปลอดภัยและมั่นใจยิ่งขึ้น
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/services">
            <Button className="bg-teal-600 hover:bg-teal-700">
              ดูบริการทั้งหมด
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">ทีมงานของเรา</Badge>
          <h2 className="text-3xl font-bold mb-4">ผู้ก่อตั้งและทีมงานหลัก</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            ทีมงานของเราประกอบด้วยผู้เชี่ยวชาญจากหลากหลายสาขา ที่มีความมุ่งมั่นในการสร้างการท่องเที่ยวที่ปลอดภัย
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white shadow-lg">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-teal-600 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600">{member.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">ร่วมเป็นส่วนหนึ่งของทีมเรา</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            เรากำลังมองหาผู้ที่มีความสามารถและมีความมุ่งมั่นในการสร้างความเปลี่ยนแปลงให้กับวงการท่องเที่ยวไทย
          </p>
          <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
            ดูตำแหน่งงานที่เปิดรับ
          </Button>
        </div>
      </section>

      {/* Our Journey */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-teal-100 text-teal-800 hover:bg-teal-200 border-none">เส้นทางของเรา</Badge>
          <h2 className="text-3xl font-bold mb-4">ประวัติความเป็นมา</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เช็คที่พักเริ่มต้นจากความตั้งใจที่จะแก้ปัญหาการหลอกลวงในธุรกิจที่พัก และเติบโตขึ้นเป็นแพลตฟอร์มที่ได้รับความไว้วางใจ
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-teal-200 transform md:-translate-x-1/2"></div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? "" : "md:flex-row-reverse"}`}
              >
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <div
                    className={`bg-white p-6 rounded-lg shadow-sm ${index % 2 === 0 ? "md:mr-8" : "md:ml-8"} relative`}
                  >
                    <div className="absolute top-6 bg-teal-500 text-white text-sm font-bold py-1 px-3 rounded">
                      {milestone.year}
                    </div>
                    <h3 className="text-xl font-bold mb-2 mt-8">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>

                <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-teal-500 rounded-full border-4 border-white transform -translate-x-1/2 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>

                <div className="md:w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">พันธมิตรของเรา</Badge>
          <h2 className="text-3xl font-bold mb-4">ร่วมมือกับองค์กรชั้นนำ</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            เราทำงานร่วมกับพันธมิตรที่หลากหลายเพื่อสร้างระบบนิเวศการท่องเที่ยวที่ปลอดภัยและยั่งยืน
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-24">
              <Image
                src={`/placeholder.svg?height=60&width=120&text=Partner+${i}`}
                alt={`พันธมิตร ${i}`}
                width={120}
                height={60}
                className="max-h-full max-w-full"
              />
            </div>
          ))}
        </div>
      </section>


    </div>
  )
}
