'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, Users, ArrowRight, Train, Clock, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import SmartSearch from '@/components/SmartSearch'
import { format } from 'date-fns'

const mockTrains = [
  {
    id: '1',
    name: 'Rajdhani Express',
    number: '12301',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departure: '16:30',
    arrival: '08:30',
    duration: '16h 0m',
    availableSeats: 45,
    fare: { sleeper: 1200, ac3: 1800, ac2: 2500, ac1: 3500 },
    popularity: 95,
    isPopular: true,
  },
  {
    id: '2',
    name: 'Shatabdi Express',
    number: '12001',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departure: '06:00',
    arrival: '14:30',
    duration: '8h 30m',
    availableSeats: 12,
    fare: { sleeper: 1500, ac3: 2200, ac2: 3000, ac1: 4200 },
    popularity: 88,
    isPopular: true,
  },
  {
    id: '3',
    name: 'Duronto Express',
    number: '12213',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departure: '20:15',
    arrival: '10:45',
    duration: '14h 30m',
    availableSeats: 78,
    fare: { sleeper: 1100, ac3: 1700, ac2: 2400, ac1: 3300 },
    popularity: 75,
    isPopular: false,
  },
]

export default function TrainSearchPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [passengers, setPassengers] = useState(1)
  const [trains, setTrains] = useState(mockTrains)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!from || !to) return
    setIsSearching(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSearching(false)
  }

  const popularRoutes = [
    { from: 'New Delhi', to: 'Mumbai Central', popularity: 95 },
    { from: 'Bangalore City', to: 'Chennai Central', popularity: 88 },
    { from: 'Kolkata Howrah', to: 'New Delhi', popularity: 82 },
  ]

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Trains</h1>
          <p className="text-gray-600">Find your perfect journey with AI-powered search</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 sm:p-8 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                From Station
              </label>
              <SmartSearch
                value={from}
                onChange={setFrom}
                placeholder="Enter source station"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                To Station
              </label>
              <SmartSearch
                value={to}
                onChange={setTo}
                placeholder="Enter destination"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Journey
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Passengers
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  min={1}
                  max={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <motion.button
            onClick={handleSearch}
            disabled={isSearching || !from || !to}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full sm:w-auto btn-primary px-8 py-4 flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Search Trains
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Popular Routes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Popular Routes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {popularRoutes.map((route, index) => (
              <motion.button
                key={`${route.from}-${route.to}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => {
                  setFrom(route.from)
                  setTo(route.to)
                }}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-500 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">
                    {route.from} → {route.to}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-600">{route.popularity}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">Click to select this route</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Search Results */}
        {trains.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Available Trains ({trains.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI-sorted by popularity</span>
              </div>
            </div>

            {trains.map((train, index) => (
              <motion.div
                key={train.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-2xl p-6 border-2 border-gray-200 hover:border-blue-500 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Train Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{train.name}</h3>
                          {train.isPopular && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500">Train No: {train.number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Popularity</p>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${train.popularity}%` }}
                              transition={{ delay: 0.6 + index * 0.1 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                            />
                          </div>
                          <span className="text-sm font-semibold text-blue-600">{train.popularity}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">From</p>
                        <p className="font-semibold text-gray-900">{train.from}</p>
                        <p className="text-sm text-blue-600">{train.departure}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">To</p>
                        <p className="font-semibold text-gray-900">{train.to}</p>
                        <p className="text-sm text-indigo-600">{train.arrival}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Duration</p>
                        <p className="font-semibold text-gray-900 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {train.duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Available Seats</p>
                        <p className="font-semibold text-gray-900">{train.availableSeats}</p>
                      </div>
                    </div>

                    {/* Fare Info */}
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(train.fare).map(([classType, fare]) => (
                        <div
                          key={classType}
                          className="px-3 py-1 bg-gray-100 rounded-lg text-sm"
                        >
                          <span className="text-gray-500">{classType.toUpperCase()}:</span>{' '}
                          <span className="font-semibold text-gray-900">₹{fare}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center">
                    <Link href={`/passenger/trains/${train.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary px-8 py-4 flex items-center gap-2"
                      >
                        View Details <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

