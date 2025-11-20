'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Train, User, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface NavbarProps {
  userType?: 'passenger' | 'admin'
}

export default function Navbar({ userType = 'passenger' }: NavbarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const passengerLinks = [
    { href: '/passenger/dashboard', label: 'Dashboard' },
    { href: '/passenger/search', label: 'Search Trains' },
    { href: '/passenger/history', label: 'My Tickets' },
    { href: '/passenger/profile', label: 'Profile' },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/trains', label: 'Manage Trains' },
    { href: '/admin/bookings', label: 'Manage Bookings' },
    { href: '/admin/reports', label: 'Reports' },
  ]

  const links = userType === 'passenger' ? passengerLinks : adminLinks

  return (
    <nav className="glass border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={userType === 'passenger' ? '/passenger/dashboard' : '/admin/dashboard'} className="flex items-center space-x-2">
            <Train className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold gradient-text">RailWay</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    pathname === link.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <User className="w-5 h-5 text-gray-700" />
            </motion.button>
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 font-semibold transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                <div
                  className={`px-4 py-2 rounded-lg font-semibold ${
                    pathname === link.href
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {link.label}
                </div>
              </Link>
            ))}
            <div className="pt-4 border-t">
              <Link href="/" className="flex items-center gap-2 px-4 py-2 text-red-600 font-semibold">
                <LogOut className="w-5 h-5" />
                Logout
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}

