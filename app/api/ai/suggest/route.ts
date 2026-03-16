import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Train from '@/lib/models/Train'
import Booking from '@/lib/models/Booking'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { source, destination, preference } = body // preference: 'cheapest' | 'fastest' | 'available'

    if (!source || !destination) {
      return NextResponse.json({ error: 'Source and destination required' }, { status: 400 })
    }

    await connectDB()

    let trains = await Train.find({
      source: new RegExp(source, 'i'),
      destination: new RegExp(destination, 'i'),
      status: 'active',
    }).lean()

    const withDuration = trains.map((t) => {
      const [dh, dm] = (t.departureTime || '00:00').split(':').map(Number)
      const [ah, am] = (t.arrivalTime || '00:00').split(':').map(Number)
      let h = ah - dh
      let m = am - dm
      if (m < 0) {
        m += 60
        h--
      }
      if (h < 0) h += 24
      const durationMin = h * 60 + m
      return { ...t, durationMin, duration: `${h}h ${m}m` }
    })

    if (preference === 'cheapest') {
      withDuration.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else if (preference === 'fastest') {
      withDuration.sort((a, b) => a.durationMin - b.durationMin)
    } else {
      withDuration.sort((a, b) => (b.availableSeats || 0) - (a.availableSeats || 0))
    }

    const suggestions = withDuration.slice(0, 5).map((t) => ({
      trainId: t._id,
      trainName: t.trainName,
      trainNumber: t.trainNumber,
      source: t.source,
      destination: t.destination,
      departureTime: t.departureTime,
      arrivalTime: t.arrivalTime,
      duration: (t as { duration?: string }).duration,
      price: t.price,
      availableSeats: t.availableSeats,
      reason: preference === 'cheapest' ? 'Best price' : preference === 'fastest' ? 'Shortest duration' : 'Good availability',
    }))

    return NextResponse.json({ suggestions })
  } catch (err) {
    console.error('AI suggest error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
