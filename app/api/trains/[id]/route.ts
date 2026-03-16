import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Train from '@/lib/models/Train'
import Booking from '@/lib/models/Booking'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const train = await Train.findById(id).lean()
    if (!train) {
      return NextResponse.json({ error: 'Train not found' }, { status: 404 })
    }

    const journeyDate = req.nextUrl.searchParams.get('date')
    let bookedSeats: string[] = []
    if (journeyDate) {
      const bookings = await Booking.find({
        trainId: id,
        journeyDate: new Date(journeyDate),
        status: { $in: ['confirmed', 'waiting'] },
      }).select('seatNumber coach')
      bookedSeats = bookings.map((b) => `${b.coach}-${b.seatNumber}`).filter(Boolean)
    }

    return NextResponse.json({ train, bookedSeats })
  } catch (err) {
    console.error('Train GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    await connectDB()

    const train = await Train.findByIdAndUpdate(id, { $set: body }, { new: true })
    if (!train) {
      return NextResponse.json({ error: 'Train not found' }, { status: 404 })
    }
    return NextResponse.json({ train })
  } catch (err) {
    console.error('Train PUT error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const train = await Train.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true })
    if (!train) {
      return NextResponse.json({ error: 'Train not found' }, { status: 404 })
    }
    return NextResponse.json({ message: 'Train cancelled' })
  } catch (err) {
    console.error('Train DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
