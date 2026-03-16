'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

function PaymentFailureContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') || 'Payment could not be completed.'

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center"
        >
          <XCircle className="w-14 h-14 text-red-600" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900 mb-2"
        >
          Payment Failed
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8"
        >
          {error}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/passenger/history"
            className="btn-primary py-3 px-6 inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to My Tickets
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default function PaymentFailurePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PaymentFailureContent />
    </Suspense>
  )
}
