'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Calendar, TrendingUp, Sparkles, FileText, BarChart3 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useToast } from '@/components/ToastProvider'
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const monthlyData = [
  { month: 'Jan', bookings: 1200, revenue: 3800000, passengers: 1450 },
  { month: 'Feb', bookings: 1350, revenue: 4200000, passengers: 1620 },
  { month: 'Mar', bookings: 1500, revenue: 4500000, passengers: 1800 },
  { month: 'Apr', bookings: 1650, revenue: 4800000, passengers: 1980 },
  { month: 'May', bookings: 1800, revenue: 5200000, passengers: 2160 },
  { month: 'Jun', bookings: 1950, revenue: 5500000, passengers: 2340 },
]

const routeData = [
  { name: 'Mumbai-Delhi', bookings: 850, revenue: 2800000 },
  { name: 'Bangalore-Chennai', bookings: 620, revenue: 1800000 },
  { name: 'Kolkata-Delhi', bookings: 480, revenue: 1500000 },
  { name: 'Mumbai-Pune', bookings: 320, revenue: 900000 },
  { name: 'Others', bookings: 280, revenue: 800000 },
]

const classData = [
  { name: 'AC First', value: 15, color: '#0ea5e9' },
  { name: 'AC 2 Tier', value: 25, color: '#6366f1' },
  { name: 'AC 3 Tier', value: 35, color: '#8b5cf6' },
  { name: 'Sleeper', value: 25, color: '#a855f7' },
]

const aiInsights = [
  {
    title: 'Revenue Growth Trend',
    insight: 'AI predicts 15% revenue increase next month based on seasonal patterns and booking trends',
    confidence: 92,
    recommendation: 'Consider increasing capacity on high-demand routes',
  },
  {
    title: 'Peak Booking Periods',
    insight: 'Analysis shows 40% of bookings occur on weekends. Optimize schedules accordingly',
    confidence: 88,
    recommendation: 'Add extra trains on Friday-Sunday routes',
  },
  {
    title: 'Passenger Demographics',
    insight: 'Young professionals (25-35) account for 45% of bookings. Target marketing campaigns',
    confidence: 85,
    recommendation: 'Launch promotional offers for this demographic',
  },
]

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  const { success } = useToast()

  const handleGenerateReport = () => {
    success('Generating comprehensive AI-powered report...')
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
              <p className="text-gray-600">AI-powered insights and automated reports</p>
            </div>
            <motion.button
              onClick={handleGenerateReport}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Generate Report
            </motion.button>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-700">Period:</span>
            {['week', 'month', 'year'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all capitalize ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI-Generated Insights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-xl p-5 border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{insight.title}</h3>
                  <span className="px-2 py-1 bg-white/80 rounded text-xs font-semibold text-gray-700">
                    {insight.confidence}%
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{insight.insight}</p>
                <div className="p-3 bg-white/80 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Recommendation:</p>
                  <p className="text-xs text-gray-700">{insight.recommendation}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Revenue Trend</h2>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">AI Forecast</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${(value as number / 100000).toFixed(1)}L`} />
                <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Bookings by Class */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass rounded-2xl p-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6">Bookings by Class</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={classData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {classData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Route Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-6">Route Performance</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={routeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="bookings" fill="#0ea5e9" name="Bookings" />
              <Bar yAxisId="right" dataKey="revenue" fill="#6366f1" name="Revenue (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          {[
            { label: 'Total Bookings', value: '9,450', change: '+18%', icon: BarChart3 },
            { label: 'Total Revenue', value: '₹28M', change: '+15%', icon: TrendingUp },
            { label: 'Avg. per Booking', value: '₹2,960', change: '+5%', icon: FileText },
            { label: 'Growth Rate', value: '18.5%', change: '+3.2%', icon: Sparkles },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-8 h-8 text-blue-600" />
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

