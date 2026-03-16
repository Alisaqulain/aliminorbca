'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, CheckCheck } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { notificationsApi } from '@/lib/api'
import { format } from 'date-fns'

interface Notification {
  _id: string
  message: string
  readStatus: boolean
  type?: string
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    const { data } = await notificationsApi.list()
    if (data) {
      setNotifications(data.notifications as Notification[])
      setUnreadCount(data.unreadCount)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const markAsRead = async (id: string) => {
    await notificationsApi.markRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, readStatus: true } : n))
    )
    setUnreadCount((c) => Math.max(0, c - 1))
  }

  const markAllRead = async () => {
    await notificationsApi.markRead(undefined, true)
    setNotifications((prev) => prev.map((n) => ({ ...n, readStatus: true })))
    setUnreadCount(0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
        <Navbar userType="passenger" />
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-gray-100">
      <Navbar userType="passenger" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-8 h-8 text-blue-400" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-blue-400 hover:text-white font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {notifications.length === 0 ? (
            <div className="rounded-xl p-8 text-center border border-gray-600 bg-gray-800/80 text-gray-300">
              <Bell className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-lg font-medium text-white mb-1">No notifications yet</p>
              <p className="text-sm text-gray-400">Booking and payment updates will appear here.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-4 flex items-start gap-3 border border-gray-600 bg-gray-800/80 text-gray-100 ${!n.readStatus ? 'border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium">{n.message}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {format(new Date(n.createdAt), 'dd MMM yyyy, HH:mm')}
                  </p>
                </div>
                {!n.readStatus && (
                  <button
                    onClick={() => markAsRead(n._id)}
                    className="p-2 rounded-lg hover:bg-blue-900/30 text-blue-400 flex-shrink-0"
                    title="Mark as read"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
