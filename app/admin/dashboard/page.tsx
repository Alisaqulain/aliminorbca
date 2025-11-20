'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Train, Users, DollarSign, TrendingUp, AlertCircle, Sparkles, BarChart3, Calendar } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const stats = [
  { label: 'Total Trains', value: '156', change: '+12%', icon: Train, color: 'blue' },
  { label: 'Active Bookings', value: '2,458', change: '+8%', icon: Users, color: 'green' },
  { label: 'Revenue (Monthly)', value: '₹45.2M', change: '+15%', icon: DollarSign, color: 'purple' },
  { label: 'Growth Rate', value: '18.5%', change: '+3.2%', icon: TrendingUp, color: 'indigo' },
]

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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">AI-powered analytics and insights</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">AI Enabled</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
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
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
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
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI Insights & Predictions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`glass rounded-xl p-5 border-2 ${
                  insight.type === 'anomaly'
                    ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-red-50'
                    : insight.type === 'prediction'
                    ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50'
                    : 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {insight.type === 'anomaly' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                    {insight.type === 'prediction' && <TrendingUp className="w-5 h-5 text-blue-600" />}
                    {insight.type === 'recommendation' && <BarChart3 className="w-5 h-5 text-purple-600" />}
                    <h3 className="font-bold text-gray-900">{insight.title}</h3>
                  </div>
                  <span className="px-2 py-1 bg-white/80 rounded text-xs font-semibold text-gray-700">
                    {insight.confidence}%
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{insight.message}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
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
                  <span className="text-xs font-semibold text-gray-600">{insight.confidence}% confidence</span>
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
              <h2 className="text-2xl font-bold text-gray-900">Revenue & Predictions</h2>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">AI Forecast</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Routes</h2>
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
                <Tooltip />
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}

