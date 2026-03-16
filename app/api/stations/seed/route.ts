import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Station from '@/lib/models/Station'
import { INDIAN_STATIONS } from '@/lib/data/indian-stations'

export async function POST() {
  try {
    await connectDB()
    for (const s of INDIAN_STATIONS) {
      await Station.findOneAndUpdate(
        { code: s.code },
        { $set: { name: s.name, code: s.code, city: s.city, state: s.state } },
        { upsert: true, new: true }
      )
    }
    const count = await Station.countDocuments()
    return NextResponse.json({ message: 'Stations seeded', count })
  } catch (err) {
    console.error('Stations seed error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
