'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Calendar, Users, ArrowRight, Train, Clock, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import SmartSearch from '@/components/SmartSearch'
import { format } from 'date-fns'
import { trainsApi } from '@/lib/api'

interface TrainRow {
  _id: string
  trainName: string
  trainNumber: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  availableSeats: number
  price: number
  pricePerClass?: { sleeper?: number; ac3?: number; ac2?: number; ac1?: number }
}

function getDuration(dep: string, arr: string) {
  const [dh, dm] = (dep || '00:00').split(':').map(Number)
  const [ah, am] = (arr || '00:00').split(':').map(Number)
  let h = ah - dh
  let m = am - dm
  if (m < 0) { m += 60; h-- }
  if (h < 0) h += 24
  return `${h}h ${m}m`
}

export default function TrainSearchPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [passengers, setPassengers] = useState(1)
  const [trains, setTrains] = useState<TrainRow[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [setupDone, setSetupDone] = useState(false)

  useEffect(() => {
    if (setupDone) return
    fetch('/api/setup')
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && (d.stationsAdded > 0 || d.trainsAdded > 0)) setSetupDone(true)
      })
      .catch(() => {})
    setSetupDone(true)
  }, [setupDone])

  const handleSearch = async () => {
    if (!from || !to) return
    if (from.toLowerCase().trim() === to.toLowerCase().trim()) return
    setIsSearching(true)
    const { data } = await trainsApi.list({
      source: from.trim(),
      destination: to.trim(),
      date,
      passengers,
    })
    setIsSearching(false)
    if (data?.trains) setTrains(data.trains as TrainRow[])
    else setTrains([])
  }

  const popularRoutes = [
    { from: 'New Delhi', to: 'Mumbai Central', popularity: 95 },
    { from: 'Bangalore City', to: 'Chennai Central', popularity: 88 },
    { from: 'Kolkata Howrah', to: 'New Delhi', popularity: 82 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />
      <AIChatAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Search Trains</h1>
          <p className="text-gray-400">Find your perfect journey with AI-powered search</p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 sm:p-8 mb-8 border border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                From Station
              </label>
              <SmartSearch
                value={from}
                onChange={setFrom}
                placeholder="Enter source station"
                excludeValue={to}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                To Station
              </label>
              <SmartSearch
                value={to}
                onChange={setTo}
                placeholder="Enter destination station"
                excludeValue={from}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Date of Journey
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-800 focus:border-blue-500 focus:outline-none text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Passengers
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(Math.min(6, Math.max(1, parseInt(e.target.value) || 1)))}
                  min={1}
                  max={6}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-600 bg-gray-800 focus:border-blue-500 focus:outline-none text-white"
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
          className="glass rounded-2xl p-6 mb-8 border border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Popular Routes</h2>
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
                className="p-4 bg-gray-800 rounded-xl border-2 border-gray-600 hover:border-blue-500 transition-all text-left"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-white">
                    {route.from} → {route.to}
                  </p>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-semibold text-green-400">{route.popularity}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400">Click to select this route</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* No results message */}
        {!isSearching && from && to && trains.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-8 border border-gray-700 text-center"
          >
            <Train className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No trains found</h2>
            <p className="text-gray-400 mb-2">No trains available for {from} → {to} on this date.</p>
            <p className="text-sm text-gray-500">Try different stations or another date. If the database is empty, open Search Trains once to auto-seed.</p>
          </motion.div>
        )}

        {/* Search Results */}
        {trains.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Available Trains ({trains.length})
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI-sorted by popularity</span>
              </div>
            </div>

            {trains.map((train, index) => {
              const fare = train.pricePerClass || { sleeper: train.price * 0.8, ac3: train.price, ac2: train.price * 1.4, ac1: train.price * 2 }
              const duration = getDuration(train.departureTime, train.arrivalTime)
              const isPopular = (train.availableSeats || 0) < 20
              return (
              <motion.div
                key={train._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass rounded-2xl p-6 border-2 border-gray-700 hover:border-blue-500 transition-all"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-white">{train.trainName}</h3>
                          {isPopular && (
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-semibold flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">Train No: {train.trainNumber}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">From</p>
                        <p className="font-semibold text-white">{train.source}</p>
                        <p className="text-sm text-blue-400">{train.departureTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">To</p>
                        <p className="font-semibold text-white">{train.destination}</p>
                        <p className="text-sm text-indigo-400">{train.arrivalTime}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Duration</p>
                        <p className="font-semibold text-white flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Available Seats</p>
                        <p className="font-semibold text-white">{train.availableSeats ?? 0}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Object.entries(fare).map(([classType, price]) => (
                        <div key={classType} className="px-3 py-1 bg-gray-700 rounded-lg text-sm">
                          <span className="text-gray-400">{classType.toUpperCase()}:</span>{' '}
                          <span className="font-semibold text-white">₹{price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Link href={`/passenger/booking?trainId=${train._id}&date=${date}&classType=ac3&passengers=${passengers}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn-primary px-8 py-4 flex items-center gap-2"
                      >
                        Book Now <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )})}
          </motion.div>
        )}
      </div>
    </div>
  )
}

