'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Download, ArrowLeft, Train, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { bookingsApi } from '@/lib/api'
import { format } from 'date-fns'

interface BookingData {
  _id: string
  pnr: string
  status: string
  journeyDate: string
  seatNumber?: string
  coach?: string
  classType?: string
  totalAmount: number
  passengerDetails: { name: string; age: number; gender: string }[]
  trainId?: { trainName: string; trainNumber: string; source: string; destination: string; departureTime: string; arrivalTime: string }
}

export default function TicketPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const ticketRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      setError('Invalid ticket')
      return
    }
    setLoading(true)
    setError(null)
    bookingsApi.get(id).then(({ data, error: err }) => {
      setLoading(false)
      if (err || !data?.booking) {
        setError(err || 'Ticket not found')
        setBooking(null)
        return
      }
      setBooking(data.booking as BookingData)
    }).catch(() => {
      setLoading(false)
      setError('Failed to load ticket')
      setBooking(null)
    })
  }, [id])

  useEffect(() => {
    if (!booking?.pnr) return
    import('qrcode').then((QRModule) => {
      const qr = QRModule.default ?? QRModule
      if (typeof qr?.toDataURL === 'function') {
        qr.toDataURL(booking.pnr, { width: 160, margin: 2 }).then(setQrDataUrl)
      }
    }).catch(() => {})
  }, [booking?.pnr])

  const handleDownloadPDF = async () => {
    const { jsPDF } = await import('jspdf')
    if (!ticketRef.current || !booking) return
    const doc = new jsPDF()
    const train = booking.trainId as { trainName: string; trainNumber: string; source: string; destination: string; departureTime: string; arrivalTime: string } | undefined
    doc.setFontSize(18)
    doc.text('Railway Ticket', 20, 20)
    doc.setFontSize(12)
    doc.text(`PNR: ${booking.pnr}`, 20, 30)
    doc.text(`Train: ${train?.trainName || 'N/A'} (${train?.trainNumber || ''})`, 20, 38)
    doc.text(`From: ${train?.source || ''} To: ${train?.destination || ''}`, 20, 46)
    doc.text(`Date: ${format(new Date(booking.journeyDate), 'dd MMM yyyy')}`, 20, 54)
    doc.text(`Seat: ${booking.coach || '-'}/${booking.seatNumber || '-'} | Class: ${booking.classType || '-'}`, 20, 62)
    doc.text(`Passengers: ${booking.passengerDetails?.map((p: { name: string }) => p.name).join(', ') || '-'}`, 20, 70)
    doc.text(`Amount: ₹${booking.totalAmount}`, 20, 78)
    doc.save(`ticket-${booking.pnr}.pdf`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
        <Navbar userType="passenger" />
        <div className="animate-pulse text-gray-400">Loading ticket...</div>
      </div>
    )
  }

  if (error || !booking) {
    const isUnauth = error?.toLowerCase().includes('unauthorized') || error?.toLowerCase().includes('request failed')
    const isServerError = error?.toLowerCase().includes('server error') || error?.toLowerCase().includes('failed to load')
    const title = isUnauth
      ? 'Please log in to view this ticket'
      : isServerError
        ? 'Something went wrong'
        : 'Ticket not found'
    const subtitle = isUnauth
      ? 'Sign in to see your bookings and tickets.'
      : isServerError
        ? 'Please try again in a moment. If it continues, check My Tickets and try from there.'
        : 'This ticket doesn’t exist or the link is wrong. You can view your tickets or book a new one.'
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
        <Navbar userType="passenger" />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <p className="text-xl text-white mb-2">{title}</p>
          <p className="text-gray-400 mb-8">{subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {isUnauth ? (
              <Link href="/login" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
                Log in
              </Link>
            ) : (
              <>
                <Link href="/passenger/history" className="btn-secondary inline-flex items-center gap-2 py-3 px-6">
                  <ArrowLeft className="w-5 h-5" />
                  My Tickets
                </Link>
                <Link href="/passenger/search" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
                  Book a ticket now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  const train = booking.trainId as { trainName: string; trainNumber: string; source: string; destination: string; departureTime: string; arrivalTime: string } | undefined

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/passenger/history" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
            Back to My Tickets
          </Link>
          <button onClick={handleDownloadPDF} className="btn-primary flex items-center gap-2 py-2 px-4">
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>

        <motion.div
          ref={ticketRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl shadow-xl p-8 border-2 border-gray-600 bg-gray-800/80"
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Train className="w-8 h-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-white">E-Ticket</h1>
              </div>
              <p className="text-sm text-gray-400 mb-1">PNR Number</p>
              <p className="text-xl font-mono font-bold text-white mb-4">{booking.pnr}</p>
              <div className="space-y-2 text-gray-300">
                <p><span className="font-semibold text-white">Train:</span> {train?.trainName} ({train?.trainNumber})</p>
                <p><span className="font-semibold text-white">Route:</span> {train?.source} → {train?.destination}</p>
                <p><span className="font-semibold text-white">Date:</span> {format(new Date(booking.journeyDate), 'dd MMM yyyy')}</p>
                <p><span className="font-semibold text-white">Departure:</span> {train?.departureTime} | <span className="font-semibold text-white">Arrival:</span> {train?.arrivalTime}</p>
                <p><span className="font-semibold text-white">Seat:</span> {booking.coach || '-'} / {booking.seatNumber || 'WL'} | {booking.classType || '-'}</p>
                <p><span className="font-semibold text-white">Amount:</span> ₹{booking.totalAmount}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="font-semibold text-white mb-2">Passengers</p>
                <ul className="list-disc list-inside text-gray-400">
                  {booking.passengerDetails?.map((p, i) => (
                    <li key={i}>{p.name} ({p.age}y, {p.gender})</li>
                  ))}
                </ul>
              </div>
            </div>
            {qrDataUrl && (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-400 mb-2">Scan for verification</p>
                <img src={qrDataUrl} alt="PNR QR" className="w-40 h-40 rounded-lg border-2 border-gray-600 bg-white" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
