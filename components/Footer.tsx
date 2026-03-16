'use client'

import Link from 'next/link'
import { Train, Mail, MapPin, Phone } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { user } = useAuth()

  return (
    <footer className="mt-auto border-t border-purple-500/20 bg-gray-900/80 backdrop-blur-sm text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Train className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold text-white">AliRail</span>
            </Link>
            <p className="text-sm text-gray-400 max-w-md mb-4">
              AI-powered railway reservation system. Book trains, manage tickets, and travel with ease across India.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} AliRail. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">Home</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/passenger/search" className="text-gray-400 hover:text-white transition-colors text-sm">Search Trains</Link></li>
              {user && (
                <>
                  <li><Link href="/passenger/history" className="text-gray-400 hover:text-white transition-colors text-sm">My Tickets</Link></li>
                  <li><Link href="/passenger/profile" className="text-gray-400 hover:text-white transition-colors text-sm">Profile</Link></li>
                  <li><Link href="/notifications" className="text-gray-400 hover:text-white transition-colors text-sm">Notifications</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-purple-400" /> support@alirail.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-purple-400" /> 139 (Railway Helpline)</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-purple-400" /> Indian Railways</li>
            </ul>
          </div>
        </div>

        {/* Developer Credit */}
        <div className="mt-10 pt-8 border-t border-gray-700/80 text-center">
          <p className="text-sm text-gray-500">
            Developed by <span className="font-semibold text-white">Ali Saqulain</span>
            <span className="mx-2 text-gray-600">|</span>
            <span className="text-gray-400">Roll No. 237322010017</span>
          </p>
          <p className="text-xs text-gray-600 mt-1">BCA Project · Railway Reservation System</p>
        </div>
      </div>
    </footer>
  )
}
