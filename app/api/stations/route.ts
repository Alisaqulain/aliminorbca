import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Station from '@/lib/models/Station'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim() || ''

    if (!q || q.length < 2) {
      const all = await Station.find().sort({ name: 1 }).limit(50).lean()
      return NextResponse.json({ stations: all })
    }

    const stations = await Station.find({
      $or: [
        { name: new RegExp(q, 'i') },
        { code: new RegExp(q, 'i') },
        { city: new RegExp(q, 'i') },
      ],
    })
      .sort({ name: 1 })
      .limit(20)
      .lean()

    return NextResponse.json({ stations })
  } catch (err) {
    console.error('Stations GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
