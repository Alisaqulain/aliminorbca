import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Booking from '@/lib/models/Booking'
import Payment from '@/lib/models/Payment'
import Train from '@/lib/models/Train'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30' // days

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Number(period))

    const [revenueByDay, bookingsByTrain, popularRoutes] = await Promise.all([
      Payment.aggregate([
        { $match: { paymentStatus: 'completed', createdAt: { $gte: startDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Booking.aggregate([
        { $match: { status: 'confirmed', createdAt: { $gte: startDate } } },
        { $group: { _id: '$trainId', count: { $sum: 1 } } },
        { $lookup: { from: 'trains', localField: '_id', foreignField: '_id', as: 'train' } },
        { $unwind: '$train' },
        { $project: { trainName: '$train.trainName', trainNumber: '$train.trainNumber', count: 1 } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Booking.aggregate([
        { $match: { status: 'confirmed', createdAt: { $gte: startDate } } },
        { $lookup: { from: 'trains', localField: 'trainId', foreignField: '_id', as: 'train' } },
        { $unwind: '$train' },
        { $group: { _id: { source: '$train.source', destination: '$train.destination' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ])

    const occupancy = await Train.aggregate([
      { $match: { status: 'active' } },
      { $project: { trainName: 1, trainNumber: 1, totalSeats: 1, availableSeats: 1 } },
      { $addFields: { booked: { $subtract: ['$totalSeats', '$availableSeats'] } } },
      { $addFields: { occupancyRate: { $multiply: [{ $divide: ['$booked', '$totalSeats'] }, 100] } } },
      { $sort: { occupancyRate: -1 } },
      { $limit: 10 },
    ])

    return NextResponse.json({
      revenueByDay,
      bookingsByTrain,
      popularRoutes,
      occupancy,
    })
  } catch (err) {
    console.error('Admin reports error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
