'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Train, Users, DollarSign, TrendingUp, AlertCircle, Sparkles, BarChart3, Download } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { adminApi } from '@/lib/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

function formatStat(value: number, isCurrency = false): string {
  if (isCurrency) return '₹' + (value >= 1e6 ? (value / 1e6).toFixed(1) + 'M' : value >= 1e3 ? (value / 1e3).toFixed(1) + 'K' : value)
  return String(value)
}

const revenueData = [
  { month: 'Jan', revenue: 38000, bookings: 1200, predicted: 40000 },
  { month: 'Feb', revenue: 42000, bookings: 1350, predicted: 44000 },
  { month: 'Mar', revenue: 45000, bookings: 1500, predicted: 48000 },
  { month: 'Apr', revenue: 48000, bookings: 1650, predicted: 52000 },
  { month: 'May', revenue: 52000, bookings: 1800, predicted: 56000 },
  { month: 'Jun', revenue: 55000, bookings: 1950, predicted: 60000 },
]

const routeData = [
  { name: 'Mumbai-Delhi', value: 35, color: '#0ea5e9' },
  { name: 'Bangalore-Chennai', value: 25, color: '#6366f1' },
  { name: 'Kolkata-Delhi', value: 20, color: '#8b5cf6' },
  { name: 'Others', value: 20, color: '#a855f7' },
]

const aiInsights = [
  {
    type: 'prediction',
    title: 'Revenue Forecast',
    message: 'AI predicts 12% revenue increase next month based on booking trends',
    confidence: 92,
  },
  {
    type: 'anomaly',
    title: 'Anomaly Detected',
    message: 'Unusual booking pattern detected on Mumbai-Pune route. Consider capacity adjustment.',
    confidence: 85,
  },
  {
    type: 'recommendation',
    title: 'Capacity Optimization',
    message: 'Recommend adding 2 extra coaches to Rajdhani Express (12301) for next month',
    confidence: 88,
  },
]

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const [stats, setStats] = useState({
    totalTrains: 0,
    totalBookings: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [recentBookings, setRecentBookings] = useState<unknown[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.stats().then(({ data }) => {
      if (data?.stats) {
        const s = data.stats as { totalTrains?: number; totalBookings?: number; totalUsers?: number; totalRevenue?: number }
        setStats({
          totalTrains: s.totalTrains ?? 0,
          totalBookings: s.totalBookings ?? 0,
          totalUsers: s.totalUsers ?? 0,
          totalRevenue: s.totalRevenue ?? 0,
        })
      }
      if (data?.recentBookings) setRecentBookings(data.recentBookings as unknown[])
      setLoading(false)
    })
  }, [])

  const statsCards = [
    { label: 'Total Trains', value: formatStat(stats.totalTrains), change: '', icon: Train, color: 'blue' },
    { label: 'Total Bookings', value: formatStat(stats.totalBookings), change: '', icon: Users, color: 'green' },
    { label: 'Total Revenue', value: formatStat(stats.totalRevenue, true), change: '', icon: DollarSign, color: 'purple' },
    { label: 'Total Users', value: formatStat(stats.totalUsers), change: '', icon: TrendingUp, color: 'indigo' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
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
              <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
              <p className="text-gray-400">AI-powered analytics and insights</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI Enabled</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  {stat.change ? (
                    <span className="px-2 py-1 bg-green-900/50 text-green-300 rounded text-xs font-semibold border border-green-500/30">
                      {stat.change}
                    </span>
                  ) : null}
                </div>
                <p className="text-3xl font-bold text-white mb-1">{loading ? '—' : stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">AI Insights & Predictions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`rounded-xl p-5 border-2 bg-gray-800/80 ${
                  insight.type === 'anomaly'
                    ? 'border-orange-500/50'
                    : insight.type === 'prediction'
                    ? 'border-blue-500/50'
                    : 'border-purple-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {insight.type === 'anomaly' && <AlertCircle className="w-5 h-5 text-orange-400" />}
                    {insight.type === 'prediction' && <TrendingUp className="w-5 h-5 text-blue-400" />}
                    {insight.type === 'recommendation' && <BarChart3 className="w-5 h-5 text-purple-400" />}
                    <h3 className="font-bold text-white">{insight.title}</h3>
                  </div>
                  <span className="px-2 py-1 bg-gray-700 rounded text-xs font-semibold text-gray-200">
                    {insight.confidence}%
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{insight.message}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${insight.confidence}%` }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={`h-full ${
                        insight.type === 'anomaly'
                          ? 'bg-orange-500'
                          : insight.type === 'prediction'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-400">{insight.confidence}% confidence</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Revenue & Predictions</h2>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <span className="text-sm text-gray-400">AI Forecast</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 5" name="AI Predicted" />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Route Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Popular Routes</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={routeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {routeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Booking Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass rounded-2xl p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Booking Trends</h2>
            <button
              onClick={() => {
                const csv = 'Month,Revenue,Bookings,Predicted\n' + revenueData.map((d) => `${d.month},${d.revenue},${d.bookings},${d.predicted}`).join('\n')
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `booking-trends-${new Date().toISOString().slice(0, 10)}.csv`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
              title="Download CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #4b5563', borderRadius: '8px', color: '#fff' }} />
              <Bar dataKey="bookings" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}

