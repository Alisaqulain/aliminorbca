'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: 'passenger' | 'admin'
  phone?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string, options?: { requireAdmin?: boolean; redirectTo?: string }) => Promise<{ error?: string }>
  signup: (data: { name: string; email: string; password: string; phone?: string }) => Promise<{ error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    const { data } = await authApi.me()
    if (data?.user) {
      setUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role as 'passenger' | 'admin',
        phone: data.user.phone,
      })
    } else {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    authApi.me().then(({ data }) => {
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role as 'passenger' | 'admin',
          phone: data.user.phone,
        })
      }
      setLoading(false)
    })
  }, [])

  const login = useCallback(
    async (email: string, password: string, options?: { requireAdmin?: boolean; redirectTo?: string }) => {
      const { data, error } = await authApi.login({ email, password })
      if (error) return { error }
      if (data?.user) {
        const role = (data.user as User).role
        if (options?.requireAdmin && role !== 'admin') return { error: 'Admin access only' }
        setUser({
          id: (data.user as User).id,
          name: (data.user as User).name,
          email: (data.user as User).email,
          role,
          phone: (data.user as User).phone,
        })
        const target = options?.redirectTo && options.redirectTo.startsWith('/') ? options.redirectTo : null
        if (role === 'admin') router.push(target && target.startsWith('/admin') ? target : '/admin/dashboard')
        else router.push(target && target.startsWith('/passenger') ? target : '/passenger/dashboard')
        return {}
      }
      return { error: 'Login failed' }
    },
    [router]
  )

  const signup = useCallback(
    async (signupData: { name: string; email: string; password: string; phone?: string }) => {
      const { data, error } = await authApi.signup(signupData)
      if (error) return { error }
      if (data?.user) {
        setUser({
          id: (data.user as User).id,
          name: (data.user as User).name,
          email: (data.user as User).email,
          role: (data.user as User).role || 'passenger',
          phone: (data.user as User).phone,
        })
        router.push('/passenger/dashboard')
        return {}
      }
      return { error: 'Signup failed' }
    },
    [router]
  )

  const logout = useCallback(async () => {
    await authApi.logout()
    setUser(null)
    router.push('/')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
