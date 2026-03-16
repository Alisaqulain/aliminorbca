'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Ticket } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-900/50 border border-green-600/50 flex items-center justify-center"
        >
          <CheckCircle className="w-14 h-14 text-green-400" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Payment Successful
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-8"
        >
          Your ticket has been confirmed. You can view and download it from My Tickets.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          {bookingId && (
            <Link
              href={`/ticket/${bookingId}`}
              className="btn-primary py-3 px-6 flex items-center justify-center gap-2"
            >
              <Ticket className="w-5 h-5" />
              View Ticket
            </Link>
          )}
          <Link
            href="/passenger/history"
            className="btn-secondary py-3 px-6 flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            My Tickets
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
