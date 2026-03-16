'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useToast } from '@/components/ToastProvider'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const { success } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    success('Thank you! We will get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
          <p className="text-gray-400">Have a question or feedback? We’d love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="glass rounded-xl p-6 border border-purple-500/20">
              <Mail className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Email</h3>
              <a href="mailto:support@alirail.com" className="text-gray-400 hover:text-white transition-colors">
                support@alirail.com
              </a>
            </div>
            <div className="glass rounded-xl p-6 border border-purple-500/20">
              <Phone className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Phone</h3>
              <p className="text-gray-400">139 (Railway Helpline)</p>
            </div>
            <div className="glass rounded-xl p-6 border border-purple-500/20">
              <MapPin className="w-8 h-8 text-purple-400 mb-3" />
              <h3 className="text-white font-semibold mb-1">Location</h3>
              <p className="text-gray-400">Indian Railways</p>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 border border-purple-500/20"
          >
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Send a message</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="Booking / Support / Other"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-600 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Your message..."
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send Message
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  )
}
