import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/server" // ใช้ Service Role Key

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            firstName, lastName, email, phone,
            password, confirmPassword,
            agreeTerms, agreeNewsletter
        } = body

        // 1. ตรวจสอบความถูกต้องของข้อมูล
        if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
            return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 })
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: "รหัสผ่านไม่ตรงกัน" }, { status: 400 })
        }

        if (!agreeTerms) {
            return NextResponse.json({ error: "กรุณายอมรับข้อกำหนดและเงื่อนไข" }, { status: 400 })
        }

        // 2. สมัครสมาชิกผ่าน Supabase Auth
        const { data: { user, session }, error: signUpError } = await supabaseServer.auth.signUp({
            email,
            password,
            options: {
                data: {
                    firstName,
                    lastName,
                    phone,
                    agreeNewsletter: agreeNewsletter ?? false
                }
            }
        })

        if (signUpError) {
            return NextResponse.json({ error: signUpError.message }, { status: 400 })
        }

        if (!user || !session) {
            return NextResponse.json({ error: "ไม่สามารถสร้างผู้ใช้ได้" }, { status: 500 })
        }

        // 3. บันทึกข้อมูลลง Table users
        const { error: insertError } = await supabaseServer.from("users").insert({
            id: user.id,
            email,
            name: `${firstName} ${lastName}`,  // รวมชื่อและนามสกุลเป็นช่องเดียว
            phone,
            //   subscribed_newsletter: agreeNewsletter ?? false,
            created_at: new Date().toISOString()
        })


        if (insertError) {
            console.error("❌ INSERT ERROR:", insertError)
            return NextResponse.json({ error: "สมัครสำเร็จแต่บันทึกข้อมูลไม่สำเร็จ" }, { status: 500 })
        }

        // 4. ตั้งค่า cookie สำหรับ session
        const cookieStore = cookies()
        cookieStore.set("sb-access-token", session.access_token, { path: "/" })
        cookieStore.set("sb-refresh-token", session.refresh_token, { path: "/" })

        // 5. Redirect ไปหน้าเลือกแพ็กเกจ
        return NextResponse.redirect(new URL("/select-package", request.url))

    } catch (error: any) {
        console.error("❌ REGISTER ERROR:", error)
        return NextResponse.json(
            { error: error.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก" },
            { status: 500 }
        )
    }
}
