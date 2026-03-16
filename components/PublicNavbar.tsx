'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, Home, LogIn, UserPlus } from 'lucide-react'
import { useState } from 'react'

export default function PublicNavbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/login', label: 'Login', icon: LogIn },
    { href: '/signup', label: 'Sign up', icon: UserPlus },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-purple-950/80 backdrop-blur-xl border-b border-purple-400/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.png" alt="AliRail" width={140} height={40} className="h-9 w-auto object-contain invert" priority />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href}>
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </motion.span>
                </Link>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-800 text-gray-300"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-700 space-y-1"
          >
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                  <span
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                      isActive ? 'bg-blue-600/20 text-blue-300' : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </motion.div>
        )}
      </div>
    </nav>
  )
}
