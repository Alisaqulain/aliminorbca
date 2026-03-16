'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Shield, ShieldOff, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { adminApi } from '@/lib/api'
import { format } from 'date-fns'

interface UserRow {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  isBlocked?: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    adminApi.users().then(({ data }) => {
      if (data?.users) setUsers(data.users as UserRow[])
      setLoading(false)
    })
  }, [])

  const handleBlock = async (userId: string, isBlocked: boolean) => {
    setActionId(userId)
    const { data } = await adminApi.blockUser(userId, isBlocked)
    setActionId(null)
    if (data?.user) {
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isBlocked } : u)))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="admin" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <Users className="w-8 h-8" />
            User Management
          </h1>
          <p className="text-gray-400 mt-1">View and manage passenger accounts</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b border-gray-700">
                  <tr>
                    <th className="text-left py-4 px-4 font-semibold">Name</th>
                    <th className="text-left py-4 px-4 font-semibold">Email</th>
                    <th className="text-left py-4 px-4 font-semibold">Phone</th>
                    <th className="text-left py-4 px-4 font-semibold">Joined</th>
                    <th className="text-left py-4 px-4 font-semibold">Status</th>
                    <th className="text-right py-4 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800/30">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="py-4 px-4 font-medium text-white">{user.name}</td>
                      <td className="py-4 px-4 text-gray-300">{user.email}</td>
                      <td className="py-4 px-4 text-gray-300">{user.phone || '-'}</td>
                      <td className="py-4 px-4 text-gray-400">{format(new Date(user.createdAt), 'dd MMM yyyy')}</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-900/50 text-red-300 border border-red-500/50' : 'bg-green-900/50 text-green-300 border border-green-500/50'}`}>
                          {user.isBlocked ? 'Blocked' : 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        {actionId === user._id ? (
                          <Loader2 className="w-5 h-5 animate-spin inline text-blue-600" />
                        ) : user.isBlocked ? (
                          <button
                            onClick={() => handleBlock(user._id, false)}
                            className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1 ml-auto"
                          >
                            <Shield className="w-4 h-4" />
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(user._id, true)}
                            className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1 ml-auto"
                          >
                            <ShieldOff className="w-4 h-4" />
                            Block
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {users.length === 0 && (
              <div className="text-center py-12 text-gray-400">No users found.</div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
