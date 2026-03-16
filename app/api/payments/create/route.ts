import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Payment from '@/lib/models/Payment'
import Booking from '@/lib/models/Booking'
import Notification from '@/lib/models/Notification'
import { getUserFromRequest } from '@/lib/auth'
import { generateTransactionId } from '@/lib/utils'

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { bookingId, amount, paymentMethod } = body

    if (!bookingId || !amount) {
      return NextResponse.json({ error: 'Missing bookingId or amount' }, { status: 400 })
    }

    await connectDB()

    const booking = await Booking.findOne({ _id: bookingId, userId: payload.id })
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }
    if (booking.status === 'cancelled') {
      return NextResponse.json({ error: 'Booking is cancelled' }, { status: 400 })
    }

    const transactionId = generateTransactionId()
    const payment = await Payment.create({
      userId: payload.id,
      bookingId,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'pending',
      transactionId,
    })

    // Simulate immediate success for demo (no Razorpay/Stripe). In production, return client secret / order_id.
    payment.paymentStatus = 'completed'
    payment.razorpayPaymentId = 'sim_' + transactionId
    await payment.save()

    await Booking.findByIdAndUpdate(bookingId, {
      $set: { paymentId: payment._id, status: 'confirmed' },
    })

    await Notification.create({
      userId: payload.id,
      message: `Payment of ₹${payment.amount} successful. Your ticket is confirmed.`,
      type: 'booking',
      relatedId: booking._id,
    })

    return NextResponse.json({
      payment: {
        id: payment._id,
        transactionId,
        amount: payment.amount,
        status: 'completed',
      },
      success: true,
    })
  } catch (err) {
    console.error('Payment create error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
