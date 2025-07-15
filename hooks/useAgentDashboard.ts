"use client"

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface AgentProfile {
  user_id?: string // ใช้ user_id ตรงกับฐานข้อมูล
  name: string
  phone_number: string
  line_id: string
  bio: string
}

export function useAgentDashboard(userId: string) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [agent, setAgent] = useState<Partial<AgentProfile>>({
    name: '',
    phone_number: '',
    line_id: '',
    bio: ''
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      const {
        data: { user },
        error
      } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/login')
        return
      }

      if (user.id !== userId) {
        router.push(`/dashboard/${user.id}`)
        return
      }

      setUser(user)
      setAuthorized(true)

      try {
        const response = await fetch(`/api/agents?userId=${user.id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.data) {
            setAgent(result.data)
          }
        } else if (response.status === 404) {
          // โปรไฟล์ยังไม่มี ให้คงค่าเริ่มต้น
          setAgent({
            name: '',
            phone_number: '',
            line_id: '',
            bio: ''
          })
        } else {
          throw new Error("ไม่สามารถโหลดข้อมูล agent ได้")
        }
      } catch (err) {
        console.error("Error loading agent:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [supabase, userId, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAgent((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!user) {
      setMessage('ต้องเข้าสู่ระบบก่อน')
      return
    }

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...agent, user_id: user.id }) // ใช้ user_id ให้ตรงกับฐานข้อมูล
      })

      const result = await response.json()

      if (response.ok) {
        setMessage('บันทึกข้อมูลเรียบร้อยแล้ว')
        setAgent(result.data) // update state ด้วยข้อมูลที่ได้กลับมา (ถ้ามี)
      } else {
        setMessage(`เกิดข้อผิดพลาด: ${result.error || 'ไม่ทราบสาเหตุ'}`)
      }
    } catch (err) {
      console.error('Error submitting agent profile:', err)
      setMessage('เกิดข้อผิดพลาดในการส่งข้อมูล')
    }
  }

  return {
    user,
    agent,
    loading,
    message,
    authorized,
    handleInputChange,
    handleSubmit,
    setAgent
  }
}
