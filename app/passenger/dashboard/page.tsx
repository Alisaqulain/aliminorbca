'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Train, Calendar, MapPin, Clock, TrendingUp, ArrowRight, Ticket, Search, Download, Filter, MoreVertical, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import AnimatedBackground from '@/components/AnimatedBackground'
import { bookingsApi } from '@/lib/api'
import { format } from 'date-fns'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface BookingItem {
  _id: string
  pnr: string
  status: string
  journeyDate: string
  classType?: string
  coach?: string
  seatNumber?: string
  trainId?: { trainName?: string; trainNumber?: string; source?: string; destination?: string; departureTime?: string }
}

const aiRecommendations = [
  {
    id: '1',
    from: 'Mumbai Central',
    to: 'Goa',
    reason: 'Based on your frequent bookings',
    discount: '15%',
    popularity: 92,
    price: '₹1,200',
  },
  {
    id: '2',
    from: 'New Delhi',
    to: 'Jaipur',
    reason: 'Popular weekend destination',
    discount: '10%',
    popularity: 85,
    price: '₹850',
  },
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
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [chartMetric, setChartMetric] = useState<'bookings' | 'revenue'>('bookings')

  const handleDownloadTrends = () => {
    const headers = 'Month,Bookings,Revenue (₹)\n'
    const rows = chartData.map((d) => `${d.month},${d.bookings},${d.revenue}`).join('\n')
    const csv = headers + rows
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `booking-trends-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    bookingsApi.list().then(({ data }) => {
      if (data?.bookings && Array.isArray(data.bookings)) {
        setBookings(data.bookings as BookingItem[])
      }
      setBookingsLoading(false)
    }).catch(() => setBookingsLoading(false))
  }, [])

  const upcomingBookings = bookings.filter((b) => b.status !== 'cancelled')
  const upcomingJourneys = upcomingBookings.map((b) => {
    const t = b.trainId
    return {
      id: b._id,
      trainName: t?.trainName ?? 'Train',
      trainNumber: t?.trainNumber ?? '-',
      from: t?.source ?? '-',
      to: t?.destination ?? '-',
      date: b.journeyDate,
      time: t?.departureTime ?? '--:--',
      status: b.status,
      pnr: b.pnr,
      class: b.classType ?? '-',
      coach: b.coach ?? '-',
      seat: b.seatNumber ?? 'WL',
    }
  })

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar userType="passenger" />
        <AIChatAssistant />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-300">Overview of your bookings and travel information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
            { label: 'Upcoming Trips', value: String(upcomingJourneys.length), icon: Calendar, change: upcomingJourneys.length ? 'View your tickets' : 'Book a trip', color: 'purple', gradient: 'from-purple-500 to-pink-500' },
            { label: 'Total Bookings', value: String(bookings.length), icon: Ticket, change: bookings.length ? 'All time' : 'No bookings yet', color: 'pink', gradient: 'from-pink-500 to-rose-500' },
            { label: 'Saved Routes', value: '5', icon: MapPin, change: '2 active', color: 'violet', gradient: 'from-violet-500 to-purple-500' },
            { label: 'Loyalty Points', value: '1,250', icon: TrendingUp, change: '+150 points', color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 hover:border-pink-400/50 hover:shadow-xl transition-all relative overflow-hidden group"
              >
                <div className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-gray-300 mb-1">{stat.label}</p>
                  <p className="text-xs font-medium text-emerald-400">{stat.change}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-purple-400/30 shadow-xl">
              <div className="border-b border-purple-500/30 bg-gradient-to-r from-purple-900/30 to-pink-900/30">
                <div className="flex gap-1 p-2">
                  <button
                    onClick={() => setSelectedTab('journeys')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedTab === 'journeys'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    Upcoming Journeys
                  </button>
                  <button
                    onClick={() => setSelectedTab('recommendations')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      selectedTab === 'recommendations'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    Recommendations
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Journeys Tab */}
                {selectedTab === 'journeys' && (
                  <div className="space-y-4">
                    {bookingsLoading ? (
                      <div className="text-center py-8 text-gray-400">Loading your bookings...</div>
                    ) : upcomingJourneys.length === 0 ? (
                      <div className="text-center py-10">
                        <Ticket className="w-14 h-14 text-gray-500 mx-auto mb-4" />
                        <p className="text-lg text-white mb-2">No upcoming journeys</p>
                        <p className="text-gray-400 mb-6">Book a ticket to see your trips here</p>
                        <Link href="/passenger/search" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
                          <Search className="w-5 h-5" />
                          Book a ticket now
                        </Link>
                      </div>
                    ) : (
                    upcomingJourneys.map((journey, index) => (
                      <motion.div
                        key={journey.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-purple-400/30 rounded-xl p-5 hover:border-pink-400/50 hover:shadow-xl transition-all bg-gradient-to-br from-slate-800/80 to-purple-900/40 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">
                                {journey.trainName}
                              </h3>
                              <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-400/30 backdrop-blur-sm">
                                {journey.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">Train No: {journey.trainNumber} • PNR: {journey.pnr}</p>
                          </div>
                          <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                            <MoreVertical className="w-5 h-5 text-gray-400" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-slate-700/40 backdrop-blur-sm rounded-lg p-3 border border-purple-400/20">
                            <p className="text-xs text-gray-400 mb-1">From</p>
                            <p className="text-sm font-semibold text-white">{journey.from}</p>
                            <p className="text-xs text-purple-300 font-medium mt-1">{journey.time}</p>
                          </div>
                          <div className="bg-slate-700/40 backdrop-blur-sm rounded-lg p-3 border border-purple-400/20">
                            <p className="text-xs text-gray-400 mb-1">To</p>
                            <p className="text-sm font-semibold text-white">{journey.to}</p>
                            <p className="text-xs text-pink-300 font-medium mt-1">{format(new Date(journey.date), 'dd MMM yyyy')}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-purple-500/30">
                          <div className="flex items-center gap-4 text-sm text-gray-300">
                            <span className="font-medium">{journey.class}</span>
                            <span>•</span>
                            <span>Coach {journey.coach}</span>
                            <span>•</span>
                            <span>Seat {journey.seat}</span>
                          </div>
                          <Link href={`/ticket/${journey.id}`}>
                            <button className="text-sm font-medium text-purple-300 hover:text-pink-300 flex items-center gap-1 group">
                              View Ticket <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    )))}
                  </div>
                )}

                {/* Recommendations Tab */}
                {selectedTab === 'recommendations' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">AI-Powered:</span> Personalized recommendations based on your travel history
                      </p>
                    </div>
                    {aiRecommendations.map((rec, index) => (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-purple-400/30 rounded-xl p-5 bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur-sm hover:border-pink-400/50 hover:shadow-xl transition-all"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {rec.from} → {rec.to}
                            </h3>
                            <p className="text-sm text-gray-300">{rec.reason}</p>
                          </div>
                          <div className="text-right">
                            <span className="px-2.5 py-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 rounded-lg text-xs font-medium border border-emerald-400/30 backdrop-blur-sm">
                              {rec.discount} off
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-purple-500/30">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">{rec.popularity}% popular</span>
                            <span className="text-sm text-white font-semibold ml-2">from {rec.price}</span>
                          </div>
                          <Link href="/passenger/search">
                            <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                              Book Now
                            </button>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Trends Chart */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-purple-400/30 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Booking Trends</h2>
                  <p className="text-sm text-gray-400 mt-1">Last 6 months · Showing: {chartMetric === 'bookings' ? 'Bookings' : 'Revenue (₹)'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setChartMetric((m) => (m === 'bookings' ? 'revenue' : 'bookings'))}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                    title={chartMetric === 'bookings' ? 'Show revenue' : 'Show bookings'}
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDownloadTrends}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                    title="Download as CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                      <stop offset="50%" stopColor="#ec4899" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(v) => chartMetric === 'revenue' ? `₹${(v / 1000).toFixed(0)}k` : v} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1e293b', 
                      border: '1px solid #7c3aed',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#fff',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)'
                    }}
                    formatter={(value: number) => chartMetric === 'revenue' ? `₹${value.toLocaleString()}` : value}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={chartMetric} 
                    stroke={chartMetric === 'bookings' ? '#a855f7' : '#0ea5e9'}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={chartMetric === 'bookings' ? 'url(#colorBookings)' : 'url(#colorRevenue)'}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-purple-400/30 shadow-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/passenger/search">
                  <button className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-between">
                    <span>Search Trains</span>
                    <Search className="w-4 h-4" />
                  </button>
                </Link>
                <Link href="/passenger/history">
                  <button className="w-full px-4 py-3 bg-slate-700/50 border-2 border-purple-400/30 text-white rounded-lg font-medium hover:border-pink-400/50 hover:bg-slate-700/70 transition-all flex items-center justify-between">
                    <span>Ticket History</span>
                    <Ticket className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl border border-purple-400/30 shadow-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { action: 'Ticket booked', train: 'Rajdhani Express', date: '2 days ago', color: 'from-purple-500 to-pink-500' },
                  { action: 'Payment completed', train: 'Shatabdi Express', date: '5 days ago', color: 'from-pink-500 to-rose-500' },
                  { action: 'Route saved', train: 'Mumbai → Delhi', date: '1 week ago', color: 'from-violet-500 to-purple-500' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-purple-500/30 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 bg-gradient-to-br ${activity.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <Train className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white">{activity.action}</p>
                      <p className="text-xs text-gray-400 truncate">{activity.train}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
