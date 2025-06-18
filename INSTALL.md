# คู่มือการติดตั้ง Check Teepak

## 🚨 แก้ไขปัญหาการติดตั้ง

### ปัญหา: @radix-ui/react-sheet ไม่พบ (404 Error)

**สาเหตุ**: แพ็คเกจ `@radix-ui/react-sheet` ไม่มีอยู่จริงใน npm registry

**วิธีแก้ไข**: ใช้ Sheet component ที่สร้างขึ้นเองแทน

## 📋 ขั้นตอนการติดตั้งที่ถูกต้อง

### 1. ลบไฟล์เก่า (ถ้ามี)
\`\`\`bash
rm -rf node_modules
rm package-lock.json
rm yarn.lock
rm pnpm-lock.yaml
\`\`\`

### 2. ติดตั้ง Dependencies
\`\`\`bash
npm install
\`\`\`

หรือถ้าใช้ yarn:
\`\`\`bash
yarn install
\`\`\`

หรือถ้าใช้ pnpm:
\`\`\`bash
pnpm install
\`\`\`

### 3. ตรวจสอบการติดตั้ง
\`\`\`bash
npm run dev
\`\`\`

## 🔧 หากยังพบปัญหา

### วิธีที่ 1: ใช้ npm แทน pnpm
\`\`\`bash
npm install --legacy-peer-deps
\`\`\`

### วิธีที่ 2: ล้าง cache
\`\`\`bash
npm cache clean --force
npm install
\`\`\`

### วิธีที่ 3: ใช้ Node.js เวอร์ชันที่แนะนำ
- Node.js 18.17.0 หรือใหม่กว่า
- npm 9.0.0 หรือใหม่กว่า

ตรวจสอบเวอร์ชัน:
\`\`\`bash
node --version
npm --version
\`\`\`

## 📦 Dependencies ที่ใช้

### Production Dependencies
- **Next.js 14.2.16** - React framework
- **React 18.2.0** - UI library
- **Tailwind CSS 3.4.0** - CSS framework
- **Radix UI** - Headless UI components
- **Supabase** - Backend as a Service
- **Lucide React** - Icon library

### Development Dependencies
- **TypeScript 5.3.3** - Type checking
- **ESLint 9.0.0** - Code linting
- **PostCSS & Autoprefixer** - CSS processing

## 🎯 การตรวจสอบว่าติดตั้งสำเร็จ

1. **ไม่มี error ในการติดตั้ง**
2. **สามารถรัน `npm run dev` ได้**
3. **เปิด http://localhost:3000 ได้**
4. **ไม่มี console errors ใน browser**

## 📞 ขอความช่วยเหลือ

หากยังพบปัญหา กรุณาแจ้ง:
1. เวอร์ชัน Node.js และ npm
2. ระบบปฏิบัติการ
3. Error message ที่แสดง
4. ขั้นตอนที่ทำมา
