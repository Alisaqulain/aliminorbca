'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, Menu, X, Bell, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { notificationsApi } from '@/lib/api'

interface NavbarProps {
  userType?: 'passenger' | 'admin'
}

export default function Navbar({ userType = 'passenger' }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<{ _id: string; message: string; readStatus: boolean; createdAt: string }[]>([])
  const profileRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuth()

  const passengerLinksLoggedIn = [
    { href: '/passenger/dashboard', label: 'Dashboard' },
    { href: '/passenger/search', label: 'Search Trains' },
    { href: '/passenger/history', label: 'My Tickets' },
    { href: '/passenger/profile', label: 'Profile' },
  ]
  const passengerLinksGuest = [
    { href: '/passenger/search', label: 'Search Trains' },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/trains', label: 'Manage Trains' },
    { href: '/admin/bookings', label: 'Manage Bookings' },
    { href: '/admin/reports', label: 'Reports' },
    { href: '/admin/users', label: 'Users' },
  ]

  const links =
    userType === 'passenger'
      ? (user ? passengerLinksLoggedIn : passengerLinksGuest)
      : adminLinks

  useEffect(() => {
    if (user && userType === 'passenger') {
      notificationsApi.list().then(({ data }) => {
        if (data?.unreadCount != null) setUnreadCount(data.unreadCount)
        if (data?.notifications) setNotifications((data.notifications as typeof notifications) || [])
      })
    }
  }, [user, userType])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setProfileOpen(false)
    setMobileMenuOpen(false)
    await logout()
    router.push('/')
  }

  const isActive = (href: string) => pathname === href || (href !== '/passenger/dashboard' && href !== '/admin/dashboard' && pathname.startsWith(href))

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-purple-400/20 bg-purple-950/80 backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href={userType === 'passenger' ? (user ? '/passenger/dashboard' : '/') : '/admin/dashboard'}
            className="flex items-center gap-2 shrink-0"
          >
            <Image
              src="/logo.png"
              alt="AliRail"
              width={140}
              height={40}
              className="h-9 w-auto object-contain invert"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.span
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {link.label}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Right: notifications + profile when logged in; Login/Signup when guest */}
          <div className="hidden md:flex items-center gap-2">
            {userType === 'passenger' && user && (
              <div className="relative" ref={notifRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setNotifOpen((o) => !o)}
                  className="relative p-2.5 rounded-xl text-gray-300 hover:bg-gray-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </motion.button>
                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-gray-800 border border-gray-700 shadow-xl"
                    >
                      <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center">
                        <span className="font-semibold text-gray-900 dark:text-white">Notifications</span>
                        <Link href="/notifications" onClick={() => setNotifOpen(false)} className="text-sm text-blue-600 dark:text-blue-400">
                          View all
                        </Link>
                      </div>
                      <div className="divide-y dark:divide-gray-700">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-sm text-gray-400">No notifications</p>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div key={n._id} className="p-3 text-sm text-gray-300">
                              {n.message}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Profile dropdown (only when logged in) or Login/Signup */}
            {user ? (
            <div className="relative" ref={profileRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-600 bg-gray-800/50 hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <span className="max-w-[120px] truncate text-sm font-medium text-gray-200">
                  {user?.name || 'User'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </motion.button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-gray-800 border border-gray-700 shadow-xl py-1"
                  >
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                    </div>
                    <Link
                      href={userType === 'passenger' ? '/passenger/profile' : '/admin/dashboard'}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            ) : (
              <>
                <Link href="/login">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
                  >
                    Login
                  </motion.span>
                </Link>
                <Link href="/signup">
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="block px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-500 transition-all"
                  >
                    Sign up
                  </motion.span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl text-gray-300 hover:bg-gray-800"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-gray-700"
            >
              <div className="py-4 space-y-1">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}>
                    <div
                      className={`px-4 py-3 rounded-lg font-semibold ${
                        isActive(link.href)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      {link.label}
                    </div>
                  </Link>
                ))}
                {userType === 'passenger' && user && (
                  <Link href="/notifications" onClick={() => setMobileMenuOpen(false)}>
                    <div className="px-4 py-3 rounded-lg font-semibold text-gray-300 hover:bg-gray-800 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadCount}</span>
                      )}
                    </div>
                  </Link>
                )}
                {user ? (
                  <div className="pt-2 mt-2 border-t border-gray-700">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-3 text-red-400 font-semibold"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 mt-2 border-t border-gray-700 flex gap-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 px-4 py-3 rounded-lg font-semibold text-center text-gray-300 hover:bg-gray-800">
                      Login
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex-1 px-4 py-3 rounded-lg font-semibold text-center bg-blue-600 text-white hover:bg-blue-500">
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
