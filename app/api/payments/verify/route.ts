import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Payment from '@/lib/models/Payment'
import Booking from '@/lib/models/Booking'
import Notification from '@/lib/models/Notification'
import { getUserFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { paymentId, razorpayPaymentId, razorpayOrderId } = body

    if (!paymentId) {
      return NextResponse.json({ error: 'Missing paymentId' }, { status: 400 })
    }

    await connectDB()

    const payment = await Payment.findOne({ _id: paymentId, userId: payload.id })
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // In production: verify with Razorpay/Stripe here
    payment.paymentStatus = 'completed'
    if (razorpayPaymentId) payment.razorpayPaymentId = razorpayPaymentId
    if (razorpayOrderId) payment.razorpayOrderId = razorpayOrderId
    await payment.save()

    await Booking.findByIdAndUpdate(payment.bookingId, {
      $set: { paymentId: payment._id, status: 'confirmed' },
    })

    await Notification.create({
      userId: payload.id,
      message: `Payment of ₹${payment.amount} completed. Your ticket is confirmed.`,
      type: 'booking',
      relatedId: payment.bookingId,
    })

    return NextResponse.json({
      success: true,
      payment: { id: payment._id, status: 'completed' },
    })
  } catch (err) {
    console.error('Payment verify error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
