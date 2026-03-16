import type { Metadata } from 'next'
import './globals.css'
import ToastProvider from '@/components/ToastProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Railway Reservation System',
  description: 'Modern railway ticket booking platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 text-gray-100">
        <AuthProvider>
          <ToastProvider>
            <main className="flex-1">{children}</main>
            <Footer />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

