import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Booking from '@/lib/models/Booking'
import Train from '@/lib/models/Train'
import Notification from '@/lib/models/Notification'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const booking = await Booking.findById(id)
      .populate('trainId')
      .populate('userId', 'name email phone')
      .lean()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    const ownerId = booking.userId && typeof booking.userId === 'object' && '_id' in (booking.userId as object)
      ? String((booking.userId as { _id: unknown })._id)
      : String(booking.userId ?? '')
    if (payload.role !== 'admin' && ownerId !== payload.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json({ booking })
  } catch (err) {
    console.error('Booking GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const booking = await Booking.findById(id)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    if (payload.role !== 'admin' && booking.userId.toString() !== payload.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Already cancelled' }, { status: 400 })
    }

    const wasConfirmed = booking.status === 'confirmed'
    booking.status = 'cancelled'
    await booking.save()

    if (wasConfirmed && booking.seatNumber) {
      await Train.findByIdAndUpdate(booking.trainId, {
        $inc: { availableSeats: booking.passengerDetails?.length || 1 },
      })
    }

    await Notification.create({
      userId: booking.userId,
      message: `Booking ${booking.pnr} has been cancelled. Refund will be processed as per policy.`,
      type: 'cancellation',
      relatedId: booking._id,
    })

    return NextResponse.json({ message: 'Booking cancelled', booking })
  } catch (err) {
    console.error('Booking DELETE error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
