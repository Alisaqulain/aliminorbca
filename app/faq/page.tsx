'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'

const faqs = [
  {
    q: 'How do I book a train ticket?',
    a: 'Go to Search Trains, enter source and destination, select date and class, then choose a train and complete the booking. You can pay via the secure payment flow.',
  },
  {
    q: 'Can I cancel or modify my booking?',
    a: 'Cancellation and modification policies depend on the train and time before departure. Check your ticket details and the cancellation rules shown at booking.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We support card payments and other methods available on our payment gateway. All transactions are encrypted and secure.',
  },
  {
    q: 'How do I find my PNR or ticket?',
    a: 'Log in and go to My Tickets. You can view all your bookings and download or print your ticket. You can also open a ticket by ID from the link in your confirmation.',
  },
  {
    q: 'Is there an AI assistant?',
    a: 'Yes. Use the chat assistant on supported pages to get instant answers about trains, bookings, and general help.',
  },
  {
    q: 'Who do I contact for support?',
    a: 'Use the Contact page to send a message, or email support@alirail.com. For railway emergencies, call 139 (Railway Helpline).',
  },
]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <HelpCircle className="w-12 h-12 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-400">Quick answers to common questions about AliRail.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-xl border border-purple-500/20 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  className="shrink-0 text-purple-400"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-purple-500/20"
                  >
                    <p className="px-6 py-4 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <p className="text-gray-400 text-sm mb-2">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-white transition-colors font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            Contact Us
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
