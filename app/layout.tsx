import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

