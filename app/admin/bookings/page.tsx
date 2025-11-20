'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'

const bookings = [
  {
    id: '1',
    pnr: 'PNR123456',
    passengerName: 'John Doe',
    trainName: 'Rajdhani Express',
    trainNumber: '12301',
    from: 'New Delhi',
    to: 'Mumbai Central',
    date: '2024-01-15',
    status: 'confirmed',
    amount: 2500,
    bookingDate: '2024-01-10',
    aiInsight: 'High-value booking - VIP passenger',
  },
  {
    id: '2',
    pnr: 'PNR789012',
    passengerName: 'Jane Smith',
    trainName: 'Shatabdi Express',
    trainNumber: '12001',
    from: 'Mumbai Central',
    to: 'Pune Junction',
    date: '2024-01-20',
    status: 'pending',
    amount: 1800,
    bookingDate: '2024-01-12',
    aiInsight: 'Potential cancellation risk - monitor',
  },
  {
    id: '3',
    pnr: 'PNR345678',
    passengerName: 'Bob Johnson',
    trainName: 'Duronto Express',
    trainNumber: '12213',
    from: 'Bangalore City',
    to: 'Chennai Central',
    date: '2024-01-18',
    status: 'cancelled',
    amount: 1200,
    bookingDate: '2024-01-08',
    aiInsight: 'Cancelled - refund processed',
  },
]

export default function ManageBookingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all')

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch =
      booking.pnr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.passengerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.trainName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar userType="admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Bookings</h1>
              <p className="text-gray-600">AI-powered booking insights and management</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export
            </motion.button>
          </div>
        </motion.div>

        {/* AI Insights Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: 'Total Bookings', value: '2,458', icon: CheckCircle, color: 'blue' },
            { label: 'Pending', value: '124', icon: Clock, color: 'yellow' },
            { label: 'Cancelled', value: '89', icon: XCircle, color: 'red' },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by PNR, passenger name, or train..."
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              {['all', 'confirmed', 'pending', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as any)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">PNR</th>
                  <th className="px-6 py-4 text-left font-semibold">Passenger</th>
                  <th className="px-6 py-4 text-left font-semibold">Train</th>
                  <th className="px-6 py-4 text-left font-semibold">Route</th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">AI Insight</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((booking, index) => (
                  <motion.tr
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-gray-900">{booking.pnr}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">{booking.passengerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{booking.trainName}</p>
                        <p className="text-gray-500">{booking.trainNumber}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-gray-900">{booking.from}</p>
                      <p className="text-gray-500">→ {booking.to}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{booking.date}</td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-900">₹{booking.amount}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-gray-600 max-w-[150px] truncate">
                          {booking.aiInsight}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </motion.button>
                        {booking.status === 'pending' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors"
                          >
                            Approve
                          </motion.button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {filteredBookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-gray-600">No bookings found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

