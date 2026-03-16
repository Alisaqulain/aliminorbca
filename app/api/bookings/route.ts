import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Booking from '@/lib/models/Booking'
import Train from '@/lib/models/Train'
import Payment from '@/lib/models/Payment'
import Notification from '@/lib/models/Notification'
import { getUserFromRequest } from '@/lib/auth'
import { generatePNR } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const isAdmin = payload.role === 'admin'
    const query = isAdmin ? {} : { userId: payload.id }
    const bookings = await Booking.find(query)
      .populate('trainId', 'trainNumber trainName source destination departureTime arrivalTime')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ bookings })
  } catch (err) {
    console.error('Bookings GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { trainId, journeyDate, passengerDetails, classType, seatNumber, coach } = body

    if (!trainId || !journeyDate || !passengerDetails?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    const train = await Train.findById(trainId)
    if (!train) {
      return NextResponse.json({ error: 'Train not found' }, { status: 404 })
    }
    if (train.status !== 'active') {
      return NextResponse.json({ error: 'Train not available' }, { status: 400 })
    }

    const pricePerClass = train.pricePerClass || {
      sleeper: train.price * 0.8,
      ac3: train.price,
      ac2: train.price * 1.4,
      ac1: train.price * 2,
    }
    const priceKey = (classType || 'ac3').toLowerCase() as keyof typeof pricePerClass
    const unitPrice = pricePerClass[priceKey] ?? train.price
    const totalAmount = unitPrice * passengerDetails.length

    const journeyDateObj = new Date(journeyDate)
    journeyDateObj.setHours(0, 0, 0, 0)
    const dateEnd = new Date(journeyDateObj)
    dateEnd.setHours(23, 59, 59, 999)

    const bookedAgg = await Booking.aggregate([
      {
        $match: {
          trainId: train._id,
          journeyDate: { $gte: journeyDateObj, $lte: dateEnd },
          status: 'confirmed',
        },
      },
      { $unwind: '$passengerDetails' },
      { $count: 'total' },
    ])
    const bookedCount = bookedAgg[0]?.total ?? 0
    const totalSeats = train.totalSeats ?? 720
    const availableSeats = Math.max(0, totalSeats - bookedCount)
    const passengerCount = passengerDetails.length
    const isWaitlist = availableSeats < passengerCount
    const waitlistAgg = await Booking.countDocuments({
      trainId,
      journeyDate: { $gte: journeyDateObj, $lte: dateEnd },
      status: 'waiting',
    })
    const waitlistPosition = isWaitlist ? waitlistAgg + 1 : undefined

    const getCoachAndSeat = (seatIndex: number): { coach: string; seat: string } => {
      const coachNum = Math.floor(seatIndex / 72) + 1
      const seatNum = (seatIndex % 72) + 1
      return { coach: `S${coachNum}`, seat: String(seatNum) }
    }

    let assignedCoach: string | undefined
    let assignedSeat: string | undefined
    if (!isWaitlist && passengerCount > 0) {
      const first = getCoachAndSeat(bookedCount)
      assignedCoach = first.coach
      assignedSeat = passengerCount === 1 ? first.seat : `${first.seat}-${getCoachAndSeat(bookedCount + passengerCount - 1).seat}`
    }

    const pnr = generatePNR()
    const booking = await Booking.create({
      userId: payload.id,
      trainId,
      seatNumber: assignedSeat ?? (isWaitlist ? undefined : seatNumber || '1'),
      coach: assignedCoach ?? (isWaitlist ? undefined : coach || 'S1'),
      classType: classType || 'ac3',
      passengerDetails,
      journeyDate: journeyDateObj,
      status: isWaitlist ? 'waiting' : 'confirmed',
      pnr,
      totalAmount,
      waitlistPosition,
    })

    await Notification.create({
      userId: payload.id,
      message: isWaitlist
        ? `Booking ${pnr} added to waitlist at position ${waitlistPosition}. You will be notified when confirmed.`
        : `Booking confirmed! PNR: ${pnr}. Complete payment to get your ticket.`,
      type: 'booking',
      relatedId: booking._id,
    })

    return NextResponse.json({
      booking: {
        ...booking.toObject(),
        train,
        isWaitlist,
        waitlistPosition,
      },
      totalAmount,
      paymentRequired: true,
    })
  } catch (err) {
    console.error('Bookings POST error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
