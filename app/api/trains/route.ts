import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Train from '@/lib/models/Train'
import Booking from '@/lib/models/Booking'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const source = searchParams.get('source')?.trim()
    const destination = searchParams.get('destination')?.trim()
    const date = searchParams.get('date')?.trim()
    const passengers = Math.max(1, parseInt(searchParams.get('passengers') || '1', 10) || 1)
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const query: Record<string, unknown> = { status: 'active' }
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    if (source) query.source = new RegExp(escapeRegex(source), 'i')
    if (destination) query.destination = new RegExp(escapeRegex(destination), 'i')
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice)
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice)
    }

    const trains = await Train.find(query).sort({ departureTime: 1 }).lean()
    const journeyDate = date ? new Date(date) : null

    const dateStart = journeyDate ? new Date(journeyDate) : null
    if (dateStart) dateStart.setHours(0, 0, 0, 0)
    const dateEnd = journeyDate ? new Date(journeyDate) : null
    if (dateEnd) dateEnd.setHours(23, 59, 59, 999)

    const trainsWithAvailability = await Promise.all(
      trains.map(async (t) => {
        let availableSeats = Number(t.totalSeats) || 0
        if (dateStart && dateEnd) {
          const bookedCount = await Booking.aggregate([
            {
              $match: {
                trainId: t._id,
                journeyDate: { $gte: dateStart, $lte: dateEnd },
                status: 'confirmed',
              },
            },
            { $group: { _id: null, total: { $sum: { $size: '$passengerDetails' } } } },
          ])
          const booked = bookedCount[0]?.total || 0
          availableSeats = Math.max(0, (Number(t.totalSeats) || 0) - booked)
        }
        return {
          ...t,
          availableSeats,
          hasEnoughSeats: !date || availableSeats >= passengers,
        }
      })
    )

    const filtered = date && passengers > 0
      ? trainsWithAvailability.filter((t: { hasEnoughSeats?: boolean }) => t.hasEnoughSeats)
      : trainsWithAvailability

    return NextResponse.json({ trains: filtered })
  } catch (err) {
    console.error('Trains GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      totalSeats,
      price,
      pricePerClass,
      runningDays,
    } = body

    if (!trainNumber || !trainName || !source || !destination || !departureTime || !arrivalTime || !totalSeats || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()
    const train = await Train.create({
      trainNumber,
      trainName,
      source,
      destination,
      departureTime,
      arrivalTime,
      totalSeats,
      availableSeats: totalSeats,
      price,
      pricePerClass: pricePerClass || { sleeper: price * 0.8, ac3: price, ac2: price * 1.4, ac1: price * 2 },
      status: 'active',
      runningDays: runningDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    })

    return NextResponse.json({ train })
  } catch (err) {
    console.error('Trains POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
