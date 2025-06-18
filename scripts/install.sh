#!/bin/bash

echo "🚀 เริ่มติดตั้ง Check Teepak..."

# ตรวจสอบ Node.js version
echo "📋 ตรวจสอบ Node.js version..."
node_version=$(node --version)
echo "Node.js version: $node_version"

# ตรวจสอบ npm version
npm_version=$(npm --version)
echo "npm version: $npm_version"

# ลบไฟล์เก่า
echo "🧹 ลบไฟล์เก่า..."
rm -rf node_modules
rm -f package-lock.json
rm -f yarn.lock
rm -f pnpm-lock.yaml

# ล้าง npm cache
echo "🗑️ ล้าง npm cache..."
npm cache clean --force

# ติดตั้ง dependencies
echo "📦 ติดตั้ง dependencies..."
npm install

# ตรวจสอบการติดตั้ง
if [ $? -eq 0 ]; then
    echo "✅ ติดตั้งสำเร็จ!"
    echo "🎉 สามารถรัน 'npm run dev' เพื่อเริ่มใช้งาน"
else
    echo "❌ การติดตั้งล้มเหลว"
    echo "💡 ลองใช้คำสั่ง: npm install --legacy-peer-deps"
fi
