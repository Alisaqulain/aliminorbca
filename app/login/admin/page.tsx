'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, ArrowRight } from 'lucide-react'
import FormInput from '@/components/FormInput'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLoginSecretPage() {
  const { login } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      setErrors({ form: 'Email and password required' })
      return
    }
    setIsSubmitting(true)
    const { error } = await login(formData.email, formData.password, { requireAdmin: true })
    setIsSubmitting(false)
    if (error) setErrors({ form: error })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name] || errors.form) setErrors({})
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800 border border-gray-700 rounded-3xl shadow-xl p-8 sm:p-10">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Admin</h1>
            <p className="text-gray-400 text-sm">Sign in to access the dashboard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.form && (
              <p className="text-sm text-red-400 bg-red-900/30 px-3 py-2 rounded-lg border border-red-800">{errors.form}</p>
            )}
            <FormInput
              label="Email"
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />
            <FormInput
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </form>
          <p className="mt-6 text-center">
            <a href="/login" className="text-sm text-gray-400 hover:text-white">← Back to login</a>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
