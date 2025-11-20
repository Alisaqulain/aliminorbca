'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Calendar, MapPin, Clock, Train, AlertCircle, CheckCircle, Sparkles, TrendingUp } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import { useToast } from '@/components/ToastProvider'

const tickets = [
  {
    id: '1',
    pnr: 'PNR123456',
    trainName: 'Rajdhani Express',
    trainNumber: '12301',
    from: 'New Delhi',
    to: 'Mumbai Central',
    date: '2024-01-15',
    time: '16:30',
    status: 'upcoming',
    class: 'AC 2 Tier',
    passengers: 1,
    amount: 2500,
    daysUntil: 5,
    isUrgent: true,
  },
  {
    id: '2',
    pnr: 'PNR789012',
    trainName: 'Shatabdi Express',
    trainNumber: '12001',
    from: 'Mumbai Central',
    to: 'Pune Junction',
    date: '2024-01-20',
    time: '06:00',
    status: 'upcoming',
    class: 'AC 3 Tier',
    passengers: 2,
    amount: 3600,
    daysUntil: 10,
    isUrgent: false,
  },
  {
    id: '3',
    pnr: 'PNR345678',
    trainName: 'Duronto Express',
    trainNumber: '12213',
    from: 'Bangalore City',
    to: 'Chennai Central',
    date: '2023-12-20',
    time: '14:00',
    status: 'completed',
    class: 'Sleeper',
    passengers: 1,
    amount: 1200,
    daysUntil: null,
    isUrgent: false,
  },
  {
    id: '4',
    pnr: 'PNR901234',
    trainName: 'Garib Rath',
    trainNumber: '12215',
    from: 'Kolkata Howrah',
    to: 'New Delhi',
    date: '2023-11-15',
    time: '18:00',
    status: 'completed',
    class: 'AC 3 Tier',
    passengers: 1,
    amount: 1800,
    daysUntil: null,
    isUrgent: false,
  },
]

const aiSuggestions = [
  {
    ticketId: '1',
    type: 'related',
    message: 'Similar route available: Mumbai → Goa (15% discount)',
    action: 'View Offer',
  },
  {
    ticketId: '1',
    type: 'reminder',
    message: 'Your journey is in 5 days. Consider booking return tickets now.',
    action: 'Book Return',
  },
]

export default function TicketHistoryPage() {
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')
  const { success } = useToast()
  const filteredTickets = filter === 'all' 
    ? tickets 
    : tickets.filter(t => t.status === filter)

  const handleDownload = (pnr: string) => {
    // Simulate download
    success(`Ticket downloaded successfully! PNR: ${pnr}`)
  }

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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">View and manage all your bookings</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-4 mb-6"
        >
          <div className="flex flex-wrap gap-3">
            {['all', 'upcoming', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI Highlights Banner */}
        {filteredTickets.some(t => t.isUrgent) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl flex items-center gap-3"
          >
            <AlertCircle className="w-6 h-6 text-orange-600" />
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                <span className="text-orange-600">AI Alert:</span> You have urgent upcoming journeys
              </p>
              <p className="text-sm text-gray-600">
                {filteredTickets.filter(t => t.isUrgent).length} trip{filteredTickets.filter(t => t.isUrgent).length > 1 ? 's' : ''} within 7 days
              </p>
            </div>
          </motion.div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map((ticket, index) => {
            const suggestions = aiSuggestions.filter(s => s.ticketId === ticket.id)
            
            return (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`glass rounded-2xl p-6 border-2 transition-all ${
                  ticket.isUrgent
                    ? 'border-orange-300 bg-gradient-to-r from-orange-50/50 to-red-50/50'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Ticket Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{ticket.trainName}</h3>
                          {ticket.isUrgent && (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              Urgent
                            </span>
                          )}
                          {ticket.status === 'completed' && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500">Train No: {ticket.trainNumber} • PNR: {ticket.pnr}</p>
                      </div>
                      {ticket.daysUntil !== null && (
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Days until journey</p>
                          <p className={`text-2xl font-bold ${ticket.daysUntil <= 7 ? 'text-orange-600' : 'text-blue-600'}`}>
                            {ticket.daysUntil}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">From</p>
                          <p className="font-semibold">{ticket.from}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-gray-500">To</p>
                          <p className="font-semibold">{ticket.to}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-semibold">{ticket.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-semibold">{ticket.time}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Class:</span>{' '}
                        <span className="font-semibold text-gray-900">{ticket.class}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Passengers:</span>{' '}
                        <span className="font-semibold text-gray-900">{ticket.passengers}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount:</span>{' '}
                        <span className="font-semibold text-gray-900">₹{ticket.amount}</span>
                      </div>
                    </div>

                    {/* AI Suggestions */}
                    {suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                      >
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900 mb-1">AI Suggestion</p>
                            {suggestions.map((s, idx) => (
                              <div key={idx} className="mb-2 last:mb-0">
                                <p className="text-sm text-gray-700">{s.message}</p>
                                <button className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1">
                                  {s.action} →
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end gap-3">
                    <motion.button
                      onClick={() => handleDownload(ticket.pnr)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-secondary flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Download
                    </motion.button>
                    {ticket.status === 'upcoming' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
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

        {filteredTickets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Train className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No tickets found</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

