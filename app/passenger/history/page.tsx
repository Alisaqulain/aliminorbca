'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Download, Calendar, MapPin, Clock, Train, AlertCircle, CheckCircle, Ticket, CreditCard } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import { useToast } from '@/components/ToastProvider'
import { bookingsApi } from '@/lib/api'
import { format, differenceInDays } from 'date-fns'

interface BookingItem {
  _id: string
  pnr: string
  status: string
  journeyDate: string
  classType?: string
  totalAmount: number
  passengerDetails?: { name: string }[]
  paymentId?: string
  trainId?: string | { trainName?: string; trainNumber?: string; source?: string; destination?: string; departureTime?: string }
}

export default function TicketHistoryPage() {
  const router = useRouter()
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'cancelled' | 'waiting'>('all')
  const [bookings, setBookings] = useState<BookingItem[]>([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  useEffect(() => {
    bookingsApi
      .list()
      .then(({ data }) => {
        if (data?.bookings) setBookings(Array.isArray(data.bookings) ? (data.bookings as BookingItem[]) : [])
      })
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredTickets = filter === 'all'
    ? bookings
    : bookings.filter((b) => b.status === filter)

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return
    const { error } = await bookingsApi.cancel(id)
    if (error) {
      showError(error)
      return
    }
    success('Booking cancelled')
    setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b)))
  }

  const needsPayment = (b: BookingItem) => b.status === 'confirmed' && !b.paymentId
  const isUrgent = (b: BookingItem) => {
    if (b.status !== 'confirmed' && b.status !== 'waiting') return false
    try {
      const days = differenceInDays(new Date(b.journeyDate), new Date())
      return days >= 0 && days <= 7
    } catch {
      return false
    }
  }

  const getTrain = (b: BookingItem) => {
    const t = b.trainId
    if (!t) return null
    return typeof t === 'object' ? t : null
  }

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
          <h1 className="text-4xl font-bold text-white mb-2">My Tickets</h1>
          <p className="text-gray-400">View and manage all your bookings</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-wrap gap-3">
            {['all', 'confirmed', 'waiting', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {loading && (
          <div className="text-center py-8 text-gray-400">Loading bookings...</div>
        )}

        {/* AI Highlights Banner */}
        {!loading && filteredTickets.some((t) => isUrgent(t)) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 p-4 bg-orange-900/30 border-2 border-orange-500/50 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6 text-orange-400" />
            <div className="flex-1">
              <p className="font-semibold text-white">
                <span className="text-orange-400">AI Alert:</span> You have urgent upcoming journeys
              </p>
              <p className="text-sm text-gray-400">
                {filteredTickets.filter((t) => isUrgent(t)).length} trip(s) within 7 days
              </p>
            </div>
          </motion.div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {!loading &&
            filteredTickets.map((ticket, index) => {
              const train = getTrain(ticket)
              let daysUntil = 0
              try {
                daysUntil = differenceInDays(new Date(ticket.journeyDate), new Date())
              } catch {
                daysUntil = 0
              }
              return (
                <motion.div
                  key={ticket._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`glass rounded-2xl p-6 border-2 transition-all ${
                    isUrgent(ticket)
                      ? 'border-orange-500/50 bg-orange-900/20'
                      : 'border-gray-600 hover:border-blue-500 bg-gray-800/50'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="text-2xl font-bold text-white">{train?.trainName || 'Train'}</h3>
                            {isUrgent(ticket) && (
                              <span className="px-3 py-1 bg-orange-900/50 text-orange-300 rounded-full text-xs font-semibold flex items-center gap-1 border border-orange-500/30">
                                <AlertCircle className="w-3 h-3" />
                                Urgent
                              </span>
                            )}
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              ticket.status === 'confirmed' ? 'bg-green-900/50 text-green-300 border border-green-500/30' :
                              ticket.status === 'cancelled' ? 'bg-gray-700 text-gray-400' :
                              'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <p className="text-gray-400">Train No: {train?.trainNumber ?? '-'} • PNR: {ticket.pnr}</p>
                        </div>
                        {ticket.status !== 'cancelled' && daysUntil >= 0 && (
                          <div className="text-right">
                            <p className="text-sm text-gray-400">Days until journey</p>
                            <p className={`text-2xl font-bold ${daysUntil <= 7 ? 'text-orange-400' : 'text-blue-400'}`}>
                              {daysUntil}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-sm text-gray-400">From</p>
                            <p className="font-semibold text-white">{train?.source ?? '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-indigo-400" />
                          <div>
                            <p className="text-sm text-gray-400">To</p>
                            <p className="font-semibold text-white">{train?.destination ?? '-'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Date</p>
                            <p className="font-semibold text-white">{format(new Date(ticket.journeyDate), 'dd MMM yyyy')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-400">Time</p>
                            <p className="font-semibold text-white">{train?.departureTime ?? '-'}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Class:</span>{' '}
                          <span className="font-semibold text-white">{ticket.classType || '-'}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Passengers:</span>{' '}
                          <span className="font-semibold text-white">{ticket.passengerDetails?.length ?? 0}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Amount:</span>{' '}
                          <span className="font-semibold text-white">₹{ticket.totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex lg:flex-col items-center lg:items-end gap-3">
                      <Link href={`/ticket/${ticket._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-secondary flex items-center gap-2"
                        >
                          <Ticket className="w-5 h-5" />
                          View Ticket
                        </motion.button>
                      </Link>
                      {needsPayment(ticket) && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push(`/payment?bookingId=${ticket._id}`)}
                          className="btn-primary flex items-center gap-2"
                        >
                          <CreditCard className="w-5 h-5" />
                          Pay Now
                        </motion.button>
                      )}
                      {ticket.status === 'confirmed' && ticket.paymentId && (
                        <a href={`/ticket/${ticket._id}`} className="btn-secondary flex items-center gap-2 py-2 px-4">
                          <Download className="w-5 h-5" />
                          Download
                        </a>
                      )}
                      {ticket.status !== 'cancelled' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleCancel(ticket._id)}
                          className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg font-semibold hover:bg-red-900/50 border border-red-500/30 transition-colors"
                        >
                          Cancel
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
        </div>

        {!loading && filteredTickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Train className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-xl text-gray-400">No tickets found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

