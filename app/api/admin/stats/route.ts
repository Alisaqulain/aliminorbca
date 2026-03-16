import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import Train from '@/lib/models/Train'
import Booking from '@/lib/models/Booking'
import Payment from '@/lib/models/Payment'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const [userCount, trainCount, bookingCount, totalRevenue] = await Promise.all([
      User.countDocuments({ role: 'passenger' }),
      Train.countDocuments({ status: 'active' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Payment.aggregate([{ $match: { paymentStatus: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ])

    const revenue = totalRevenue[0]?.total || 0

    const recentBookings = await Booking.find()
      .populate('trainId', 'trainName trainNumber')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean()

    return NextResponse.json({
      stats: {
        totalUsers: userCount,
        totalTrains: trainCount,
        totalBookings: bookingCount,
        totalRevenue: revenue,
      },
      recentBookings,
    })
  } catch (err) {
    console.error('Admin stats error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
