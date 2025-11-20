'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Train, Calendar, MapPin, Clock, TrendingUp, Sparkles, ArrowRight, Ticket } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const upcomingJourneys = [
  {
    id: '1',
    trainName: 'Rajdhani Express',
    trainNumber: '12301',
    from: 'New Delhi',
    to: 'Mumbai Central',
    date: '2024-01-15',
    time: '16:30',
    status: 'Confirmed',
    pnr: 'PNR123456',
  },
  {
    id: '2',
    trainName: 'Shatabdi Express',
    trainNumber: '12001',
    from: 'Mumbai Central',
    to: 'Pune Junction',
    date: '2024-01-20',
    time: '06:00',
    status: 'Confirmed',
    pnr: 'PNR789012',
  },
]

const aiRecommendations = [
  {
    id: '1',
    from: 'Mumbai Central',
    to: 'Goa',
    reason: 'Based on your frequent bookings',
    discount: '15% off',
    popularity: 92,
  },
  {
    id: '2',
    from: 'New Delhi',
    to: 'Jaipur',
    reason: 'Popular weekend destination',
    discount: '10% off',
    popularity: 85,
  },
]

const frequentRoutes = [
  { route: 'Mumbai → Delhi', count: 12, lastBooked: '2 weeks ago' },
  { route: 'Mumbai → Pune', count: 8, lastBooked: '1 week ago' },
  { route: 'Delhi → Bangalore', count: 5, lastBooked: '3 weeks ago' },
]

const chartData = [
  { month: 'Jan', bookings: 4, revenue: 12000 },
  { month: 'Feb', bookings: 6, revenue: 18000 },
  { month: 'Mar', bookings: 8, revenue: 24000 },
  { month: 'Apr', bookings: 5, revenue: 15000 },
  { month: 'May', bookings: 7, revenue: 21000 },
  { month: 'Jun', bookings: 9, revenue: 27000 },
]

export default function PassengerDashboard() {
  const [selectedTab, setSelectedTab] = useState<'journeys' | 'recommendations'>('journeys')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar userType="passenger" />
      <AIChatAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-gray-600">Here's your personalized dashboard</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Upcoming Trips', value: '2', icon: Calendar, color: 'blue' },
            { label: 'Total Bookings', value: '24', icon: Ticket, color: 'indigo' },
            { label: 'Saved Routes', value: '5', icon: MapPin, color: 'purple' },
            { label: 'Loyalty Points', value: '1,250', icon: TrendingUp, color: 'green' },
          ].map((stat, index) => {
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
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="glass rounded-2xl p-6">
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setSelectedTab('journeys')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedTab === 'journeys'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Upcoming Journeys
                </button>
                <button
                  onClick={() => setSelectedTab('recommendations')}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                    selectedTab === 'recommendations'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  AI Recommendations
                </button>
              </div>

              {/* Journeys Tab */}
              {selectedTab === 'journeys' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {upcomingJourneys.map((journey, index) => (
                    <motion.div
                      key={journey.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {journey.trainName}
                          </h3>
                          <p className="text-sm text-gray-500">Train No: {journey.trainNumber}</p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {journey.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">From</p>
                            <p className="font-semibold">{journey.from}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-indigo-600" />
                          <div>
                            <p className="text-sm text-gray-500">To</p>
                            <p className="font-semibold">{journey.to}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{journey.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{journey.time}</span>
                          </div>
                        </div>
                        <Link href={`/passenger/tickets/${journey.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                          >
                            View Details <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Recommendations Tab */}
              {selectedTab === 'recommendations' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">AI-Powered:</span> Personalized recommendations based on your travel history
                    </p>
                  </div>
                  {aiRecommendations.map((rec, index) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 hover:border-blue-500 transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {rec.from} → {rec.to}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            {rec.reason}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            {rec.discount}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-600">{rec.popularity}% popular</span>
                        </div>
                        <Link href="/passenger/search">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-primary"
                          >
                            Book Now
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Booking History Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#0ea5e9" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/passenger/search">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary text-left flex items-center justify-between"
                  >
                    Search Trains <Train className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/passenger/history">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-secondary text-left flex items-center justify-between"
                  >
                    Ticket History <Ticket className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Frequent Routes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Frequent Routes
              </h2>
              <div className="space-y-3">
                {frequentRoutes.map((route, index) => (
                  <motion.div
                    key={route.route}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <p className="font-semibold text-gray-900">{route.route}</p>
                    <p className="text-sm text-gray-500">
                      {route.count} bookings • Last: {route.lastBooked}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

