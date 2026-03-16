import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import Train from '@/lib/models/Train'
import { hashPassword } from '@/lib/auth'

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed disabled in production' }, { status: 403 })
  }
  try {
    await connectDB()
    const hashedAdmin = await hashPassword('admin123')
    const hashedPassenger = await hashPassword('passenger123')

    await User.deleteMany({})
    await User.create([
      { name: 'Admin User', email: 'admin@railway.com', password: hashedAdmin, role: 'admin', isBlocked: false },
      { name: 'Test Passenger', email: 'passenger@test.com', password: hashedPassenger, role: 'passenger', phone: '9876543210', isBlocked: false },
    ])

    const trains = [
      { trainNumber: '12301', trainName: 'Rajdhani Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '16:30', arrivalTime: '08:30', totalSeats: 100, availableSeats: 100, price: 1800, pricePerClass: { sleeper: 1200, ac3: 1800, ac2: 2500, ac1: 3500 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      { trainNumber: '12001', trainName: 'Shatabdi Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '06:00', arrivalTime: '14:30', totalSeats: 80, availableSeats: 80, price: 2200, pricePerClass: { sleeper: 1500, ac3: 2200, ac2: 3000, ac1: 4200 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      { trainNumber: '12213', trainName: 'Duronto Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '20:15', arrivalTime: '10:45', totalSeats: 120, availableSeats: 120, price: 1700, pricePerClass: { sleeper: 1100, ac3: 1700, ac2: 2400, ac1: 3300 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    ]
    await Train.deleteMany({})
    await Train.insertMany(trains)

    return NextResponse.json({
      message: 'Seed complete',
      users: { admin: 'admin@railway.com / admin123', passenger: 'passenger@test.com / passenger123' },
    })
  } catch (err) {
    console.error('Seed error:', err)
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 })
  }
}
