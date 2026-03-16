'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Train, Target, Award, Users, Zap, Shield, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function AboutPage() {
  const values = [
    { icon: Zap, title: 'Innovation', desc: 'We leverage AI and modern tech to make booking faster and smarter.' },
    { icon: Shield, title: 'Trust', desc: 'Secure payments and reliable service you can count on every journey.' },
    { icon: Users, title: 'People First', desc: 'Every feature we build is designed around the traveler\'s experience.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">About AliRail</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AI-powered railway reservation for India. We make train travel simple, fast, and secure.
          </p>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-8 md:p-10 mb-12 border border-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <Train className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-gray-300 leading-relaxed mb-4">
            AliRail connects millions of travelers with Indian Railways through a modern, AI-enhanced platform.
            We aim to reduce booking friction, offer smart recommendations, and deliver a seamless experience
            from search to ticket.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Built as a BCA project by <span className="text-white font-semibold">Ali Saqulain</span>, this system
            demonstrates enterprise-grade features: real-time availability, secure payments, admin analytics,
            and an AI chat assistant for passenger support.
          </p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-purple-400" />
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ y: -4 }}
                className="glass rounded-xl p-6 border border-purple-500/20"
              >
                <v.icon className="w-10 h-10 text-purple-400 mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-8 border border-purple-500/20"
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Project Info</h2>
          </div>
          <p className="text-gray-400 text-sm">
            BCA Project · Railway Reservation System · Roll No. 237322010017
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 text-purple-400 hover:text-white transition-colors font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.section>
      </div>
    </div>
  )
}
