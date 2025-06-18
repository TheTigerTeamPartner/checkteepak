# Check Teepak - ระบบตรวจสอบความน่าเชื่อถือของนายหน้าอสังหาริมทรัพย์

## 📋 คำอธิบายโปรเจค

Check Teepak เป็นแพลตฟอร์มสำหรับตรวจสอบความน่าเชื่อถือของนายหน้าอสังหาริมทรัพย์และที่พัก เพื่อป้องกันการถูกหลอกลวงในการซื้อ-ขาย เช่า-ให้เช่า อสังหาริมทรัพย์

## 🚀 การติดตั้งและใช้งาน

### 1. Clone โปรเจค
\`\`\`bash
git clone <repository-url>
cd check-teepak
npm install
\`\`\`

### 2. ตั้งค่า Supabase

#### 2.1 สร้าง Supabase Project
1. ไปที่ [supabase.com](https://supabase.com)
2. สร้าง account และ project ใหม่
3. ไปที่ Settings > API เพื่อดู API keys

#### 2.2 ตั้งค่า Database
1. ไปที่ SQL Editor ใน Supabase Dashboard
2. Copy และ run ไฟล์ `mock.sql` เพื่อสร้างตารางและข้อมูลทดสอบ

#### 2.3 ตั้งค่า Authentication
1. ไปที่ Authentication > Settings
2. เปิดใช้งาน Email authentication
3. ตั้งค่า Site URL เป็น `http://localhost:3000` (สำหรับ development)

#### 2.4 ตั้งค่า Storage (ถ้าต้องการอัพโหลดไฟล์)
1. ไปที่ Storage
2. สร้าง bucket ชื่อ `uploads`
3. ตั้งค่า public access ตามต้องการ

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` และเพิ่มข้อมูลต่อไปนี้:

\`\`\`env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration (ถ้าใช้)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Email Configuration (ถ้าต้องการส่งอีเมล)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS Configuration (ถ้าต้องการส่ง SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
\`\`\`

### 4. รันโปรเจค

\`\`\`bash
# Development mode
npm run dev

# Build for production
npm run build
npm start
\`\`\`

## 📁 โครงสร้างโปรเจค

\`\`\`
check-teepak/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # User dashboard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
├── public/               # Static assets
└── mock.sql              # Database mock data
\`\`\`

## 🔧 การพัฒนาต่อ

### เชื่อมต่อกับ Supabase
1. ติดตั้ง Supabase client: `npm install @supabase/supabase-js`
2. สร้างไฟล์ `lib/supabase.ts` สำหรับ configuration
3. เพิ่ม API calls ใน components ที่มี TODO comments

### เพิ่มฟีเจอร์ใหม่
- Authentication system
- File upload สำหรับเอกสารยืนยันตัวตน
- Payment integration สำหรับระบบสมาชิก
- Real-time notifications
- Advanced search และ filtering

## 📊 ข้อมูลทดสอบ

หลังจากรัน `mock.sql` แล้ว จะมีข้อมูลทดสอบดังนี้:
- ผู้ใช้งาน 5 คน (1 admin, 4 users)
- นายหน้า 4 คน (สถานะต่างๆ)
- ที่พัก 4 แห่ง
- รายงาน 2 รายการ
- สมาชิก 2 คน

## 🔒 Security

- Row Level Security (RLS) เปิดใช้งานแล้ว
- Basic policies สำหรับการเข้าถึงข้อมูล
- Environment variables สำหรับข้อมูลสำคัญ

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 ติดต่อ

หากมีคำถามหรือต้องการความช่วยเหลือ กรุณาติดต่อทีมพัฒนา
