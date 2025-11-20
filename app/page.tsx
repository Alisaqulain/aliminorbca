'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Train, ArrowRight, CheckCircle, BarChart3, Shield, Zap, Globe2, Users, TrendingUp, Award, Clock, Sparkles, Star, Play, Award as AwardIcon, Target, Rocket } from 'lucide-react'
import AnimatedBackground from '@/components/AnimatedBackground'

export default function HomePage() {
  const router = useRouter()

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized booking engine processes transactions in milliseconds',
      stat: '99.9% Uptime',
      gradient: 'from-amber-400 via-orange-500 to-red-500',
      bgGradient: 'from-amber-50/80 to-orange-50/80',
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'ISO 27001 certified with end-to-end encryption and compliance',
      stat: 'Enterprise Grade',
      gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
      bgGradient: 'from-emerald-50/80 to-teal-50/80',
    },
    {
      icon: BarChart3,
      title: 'AI Analytics',
      description: 'AI-powered insights and predictive analytics for optimal travel planning',
      stat: 'Real-Time',
      gradient: 'from-violet-400 via-purple-500 to-fuchsia-500',
      bgGradient: 'from-violet-50/80 to-purple-50/80',
    },
    {
      icon: Globe2,
      title: 'Global Reach',
      description: 'Seamless connectivity across multiple regions and time zones',
      stat: '24/7 Support',
      gradient: 'from-rose-400 via-pink-500 to-rose-500',
      bgGradient: 'from-rose-50/80 to-pink-50/80',
    },
  ]

  const stats = [
    { value: '2.5M+', label: 'Active Users', trend: '+12%', color: 'text-violet-600', icon: Users },
    { value: '50K+', label: 'Daily Transactions', trend: '+8%', color: 'text-purple-600', icon: TrendingUp },
    { value: '99.9%', label: 'System Uptime', trend: 'SLA', color: 'text-emerald-600', icon: Award },
    { value: '4.8/5', label: 'Customer Rating', trend: 'Trusted', color: 'text-rose-600', icon: Star },
  ]

  const benefits = [
    'Enterprise-grade infrastructure',
    'Real-time inventory management',
    'Automated refund processing',
    'Multi-currency support',
    'API integration available',
    'Dedicated account management',
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Travel Manager',
      company: 'Tech Corp',
      content: 'The best railway booking platform we\'ve used. Fast, reliable, and intuitive.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      company: 'Global Logistics',
      content: 'AI-powered recommendations have saved us hours of planning time.',
      rating: 5,
    },
    {
      name: 'Emily Rodriguez',
      role: 'Business Traveler',
      company: 'Finance Inc',
      content: 'Seamless booking experience with excellent customer support.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Animated Train Background */}
      <AnimatedBackground />
      
      {/* Animated Gradient Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      {/* Subtle Pattern Overlay */}
      <div className="fixed inset-0 -z-10 opacity-[0.05] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50">
                <Train className="w-8 h-8 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                RailWay
              </span>
            </motion.div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/passenger/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors">
                Dashboard
              </Link>
              <Link href="/passenger/search" className="text-gray-300 hover:text-white font-medium transition-colors">
                Search Trains
              </Link>
              <Link href="/passenger/history" className="text-gray-300 hover:text-white font-medium transition-colors">
                My Tickets
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <motion.button
                onClick={() => router.push('/login')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 text-gray-300 font-medium hover:text-white transition-colors"
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={() => router.push('/passenger/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all"
              >
                Get Started
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 text-purple-200 text-sm font-semibold shadow-lg">
                <Sparkles className="w-4 h-4" />
                AI-Powered Railway Management Platform
              </div>
              
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight">
                Railway Reservation
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  System
                </span>
              </h1>
              
              <p className="text-2xl text-gray-300 leading-relaxed max-w-2xl font-light">
                Streamline your railway operations with our comprehensive booking platform. 
                Built for scale, designed for performance, trusted by millions.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  onClick={() => router.push('/passenger/dashboard')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  Explore Dashboard
                  <ArrowRight className="w-6 h-6" />
                </motion.button>
                <motion.button
                  onClick={() => router.push('/passenger/search')}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-slate-800/80 backdrop-blur-sm text-white font-semibold rounded-xl border-2 border-purple-500/30 hover:border-purple-400 hover:bg-slate-700/80 transition-all shadow-lg text-lg"
                >
                  <Play className="w-5 h-5 inline mr-2" />
                  Watch Demo
                </motion.button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-purple-500/20">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-500/20 backdrop-blur-sm rounded-xl mb-3 border border-purple-400/30">
                        <Icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <p className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                      <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                      <p className="text-xs text-emerald-400 font-semibold">{stat.trend}</p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-400/30 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-rose-400/10 rounded-3xl"></div>
                <div className="relative space-y-6">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                      className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-purple-400/20 hover:shadow-2xl transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Train className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-white text-lg">Train {i}</p>
                            <p className="text-sm text-gray-400">Route Information</p>
                          </div>
                        </div>
                        <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 rounded-lg text-xs font-bold border border-emerald-400/30 backdrop-blur-sm">
                          Available
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-300 font-medium">
                        <span>Delhi → Mumbai</span>
                        <span>•</span>
                        <span>16:30 - 08:30</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 lg:px-8 bg-slate-800/40 backdrop-blur-md relative border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 text-purple-200 text-sm font-semibold mb-4">
              <Target className="w-4 h-4" />
              Why Choose Us
            </div>
            <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
              Enterprise-Grade
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built with modern technology to deliver exceptional performance and reliability
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className={`relative bg-gradient-to-br ${feature.bgGradient} backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400/30 hover:border-transparent hover:shadow-2xl transition-all overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">{feature.description}</p>
                    <p className={`text-sm font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                      {feature.stat}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-rose-900/40 backdrop-blur-sm relative border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 backdrop-blur-sm border border-pink-400/30 text-pink-200 text-sm font-semibold mb-4">
                <Rocket className="w-4 h-4" />
                Platform Benefits
              </div>
              <h2 className="text-5xl sm:text-6xl font-extrabold text-white mb-6">
                Comprehensive Platform
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  for Modern Railways
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Our platform integrates seamlessly with existing infrastructure while providing 
                advanced capabilities for booking, management, and analytics.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-sm rounded-lg p-3 border border-purple-400/20"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-200 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border-2 border-purple-400/30 shadow-2xl">
                <div className="flex items-center justify-between pb-6 border-b-2 border-purple-500/30 mb-6">
                  <h3 className="text-xl font-bold text-white">System Performance</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                {[
                  { label: 'Response Time', value: '45ms', percent: 95, color: 'from-emerald-400 to-teal-500' },
                  { label: 'Uptime', value: '99.9%', percent: 99, color: 'from-purple-400 to-pink-500' },
                  { label: 'Throughput', value: '50K+', percent: 90, color: 'from-rose-400 to-pink-500' },
                ].map((metric, i) => (
                  <div key={i} className="space-y-3 mb-6 last:mb-0">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300 font-semibold">{metric.label}</span>
                      <span className="font-bold text-white text-lg">{metric.value}</span>
                    </div>
                    <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${metric.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: i * 0.2 }}
                        className={`h-full bg-gradient-to-r ${metric.color} rounded-full shadow-md`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6 lg:px-8 bg-slate-800/40 backdrop-blur-md border-y border-purple-500/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-extrabold text-white mb-4">
              Trusted by <span className="bg-gradient-to-r from-purple-400 to-rose-400 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-300">See what our customers say about us</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-br from-slate-800/80 to-purple-900/40 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400/30 hover:border-pink-400/50 shadow-xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-200 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3 pt-6 border-t border-purple-500/30">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.role} • {testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-4">
              Ready to Transform Your Railway Operations?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto">
              Join leading railway operators who trust our platform for their booking and management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <motion.button
                onClick={() => router.push('/passenger/dashboard')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-bold text-lg hover:shadow-2xl transition-all"
              >
                Start Free Trial
              </motion.button>
              <motion.button
                onClick={() => router.push('/passenger/search')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                Explore Features
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/90 backdrop-blur-md border-t border-purple-500/20 py-12 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Train className="w-7 h-7 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  RailWay
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Enterprise railway reservation and management platform. 
                Trusted by millions of travelers worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/passenger/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/passenger/search" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    Search Trains
                  </Link>
                </li>
                <li>
                  <Link href="/passenger/history" className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-2">
                    <ArrowRight className="w-3 h-3" />
                    My Tickets
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <span>Email: support@railway.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>Phone: +91 9457818861</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>24/7 Support Available</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/20 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm text-center md:text-left">
                &copy; 2025 RailWay. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <span>Developed by</span>
                <span className="font-semibold bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                  Ali Saqulain
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
