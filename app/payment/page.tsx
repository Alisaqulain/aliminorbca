'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CreditCard, Wallet, Smartphone, Loader2, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { paymentsApi, bookingsApi } from '@/lib/api'

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const bookingId = searchParams.get('bookingId')
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [method, setMethod] = useState<'card' | 'upi' | 'wallet'>('card')

  useEffect(() => {
    if (!bookingId) {
      router.replace('/passenger/history')
      return
    }
    bookingsApi.get(bookingId).then(({ data }) => {
      if (data?.booking) {
        const b = data.booking as { totalAmount?: number }
        setAmount(b.totalAmount || 0)
      }
      setLoading(false)
    })
  }, [bookingId, router])

  const handlePay = async () => {
    if (!bookingId || amount <= 0) return
    setPaying(true)
    const { data, error } = await paymentsApi.create({
      bookingId,
      amount,
      paymentMethod: method,
    })
    setPaying(false)
    if (error) {
      router.push(`/payment/failure?error=${encodeURIComponent(error)}`)
      return
    }
    if (data?.success) {
      router.push(`/payment/success?bookingId=${bookingId}`)
    } else {
      router.push('/payment/failure')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />
      <div className="max-w-lg mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-2xl font-bold gradient-text mb-2">Complete Payment</h1>
          <p className="text-gray-600 mb-6">Amount to pay: <span className="font-bold text-xl text-green-600">₹{amount}</span></p>

          <div className="space-y-3 mb-6">
            {[
              { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
              { id: 'upi', label: 'UPI', icon: Smartphone },
              { id: 'wallet', label: 'Wallet', icon: Wallet },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setMethod(id as 'card' | 'upi' | 'wallet')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  method === id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className="w-6 h-6 text-blue-600" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>

          <p className="text-sm text-gray-500 mb-6">
            This is a simulated payment. In production, integrate Razorpay or Stripe.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePay}
            disabled={paying}
            className="w-full btn-primary py-4 flex items-center justify-center gap-2"
          >
            {paying ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
            ) : (
              <>Pay ₹{amount} <ArrowRight className="w-5 h-5" /></>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
