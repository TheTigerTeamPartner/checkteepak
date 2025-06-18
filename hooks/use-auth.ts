"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, signIn, signOut, signUp } from "@/lib/auth"
import type { User } from "@/types"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const result = await signIn(email, password)
    setLoading(false)
    return result
  }

  const register = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    const result = await signUp(email, password, fullName)
    setLoading(false)
    return result
  }

  const logout = async () => {
    setLoading(true)
    const result = await signOut()
    setLoading(false)
    return result
  }

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.user_type === "admin",
  }
}
