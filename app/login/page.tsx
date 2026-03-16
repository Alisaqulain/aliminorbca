'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import FormInput from '@/components/FormInput'
import PublicNavbar from '@/components/PublicNavbar'
import { useAuth } from '@/contexts/AuthContext'

function LoginForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/passenger/dashboard'
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    const { error } = await login(formData.email, formData.password, { redirectTo: redirect })
    setIsSubmitting(false)
    if (error) {
      setErrors({ form: error })
      return
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <PublicNavbar />
      <div className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-xl p-8 sm:p-10">
            <div className="flex justify-center mb-6">
              <Image src="/logo.png" alt="AliRail" width={140} height={48} className="h-11 w-auto object-contain invert" />
            </div>
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Welcome back</h1>
              <p className="text-gray-400 text-sm">Sign in to book trains and manage tickets</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.form && (
                <div className="rounded-xl bg-red-900/30 border border-red-700 px-4 py-3 text-sm text-red-300">
                  {errors.form}
                </div>
              )}
              <FormInput
                label="Email Address"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <FormInput
                label="Password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 text-blue-500 rounded border-gray-600 bg-gray-700 focus:ring-blue-500" />
                  Remember me
                </label>
                <Link href="#" className="text-blue-400 hover:text-blue-300 font-medium">Forgot password?</Link>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Sign in <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold">Sign up</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function LoginFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
      <PublicNavbar />
      <div className="w-full max-w-md px-4">
        <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-xl p-8 sm:p-10 animate-pulse">
          <div className="h-11 bg-gray-700 rounded mx-auto mb-6 w-32" />
          <div className="h-8 bg-gray-700 rounded mb-2 w-3/4 mx-auto" />
          <div className="h-4 bg-gray-700 rounded w-1/2 mx-auto mb-8" />
          <div className="space-y-4">
            <div className="h-12 bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-700 rounded-xl" />
            <div className="h-12 bg-gray-700 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  )
}
