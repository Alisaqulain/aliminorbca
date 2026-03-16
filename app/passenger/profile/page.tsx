'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, Save, Edit2, Lock, Ticket, Download } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import FormInput from '@/components/FormInput'
import { useAuth } from '@/contexts/AuthContext'
import { authApi, bookingsApi } from '@/lib/api'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [saving, setSaving] = useState(false)
  const [bookingCount, setBookingCount] = useState(0)

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, phone: user.phone || '' })
    }
  }, [user])

  useEffect(() => {
    bookingsApi.list().then(({ data }) => {
      if (data?.bookings) setBookingCount((data.bookings as unknown[]).length)
    })
  }, [])

  const handleSave = async () => {
    setErrors({})
    if (!formData.name.trim()) {
      setErrors({ name: 'Name is required' })
      return
    }
    setSaving(true)
    const { data, error } = await authApi.updateProfile({ name: formData.name.trim(), phone: formData.phone || undefined })
    setSaving(false)
    if (error) {
      setErrors({ form: error })
      return
    }
    if (data?.user) await refreshUser()
    setIsEditing(false)
  }

  const handleChangePassword = async () => {
    setErrors({})
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setErrors({ password: 'Current and new password required' })
      return
    }
    if (passwordData.newPassword.length < 6) {
      setErrors({ password: 'New password must be at least 6 characters' })
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ password: 'New passwords do not match' })
      return
    }
    setSaving(true)
    const { error } = await authApi.changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })
    setSaving(false)
    if (error) {
      setErrors({ password: error })
      return
    }
    setShowPasswordForm(false)
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />
      <AIChatAssistant />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your personal information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="glass dark:bg-gray-800/50 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{formData.name || user.name}</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  {formData.email || user.email}
                </div>
                {(formData.phone || user.phone) && (
                  <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4" />
                    {formData.phone || user.phone}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="glass dark:bg-gray-800/50 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                {!isEditing ? (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <Edit2 className="w-5 h-5" />
                    Edit
                  </motion.button>
                ) : (
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => setIsEditing(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {saving ? 'Saving...' : 'Save'}
                    </motion.button>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  error={errors.name}
                />
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  error={errors.email}
                />
                <FormInput
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  error={errors.phone}
                />
              </div>
              {errors.form && <p className="text-red-600 text-sm mt-2">{errors.form}</p>}
            </div>

            <div className="glass dark:bg-gray-800/50 rounded-2xl p-6 mt-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Change Password
              </h2>
              {!showPasswordForm ? (
                <button onClick={() => setShowPasswordForm(true)} className="btn-secondary">
                  Change Password
                </button>
              ) : (
                <div className="space-y-4">
                  <input
                    type="password"
                    placeholder="Current password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((p) => ({ ...p, newPassword: e.target.value }))}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))}
                    className="input-field"
                  />
                  {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
                  <div className="flex gap-3">
                    <button onClick={() => setShowPasswordForm(false)} className="btn-secondary">
                      Cancel
                    </button>
                    <button onClick={handleChangePassword} disabled={saving} className="btn-primary">
                      {saving ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass dark:bg-gray-800/50 rounded-2xl p-6 mt-6 border border-gray-200 dark:border-gray-700"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/passenger/history"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <Ticket className="w-5 h-5" />
                  Booking History ({bookingCount})
                </Link>
                <Link
                  href="/passenger/search"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Book a Train
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
