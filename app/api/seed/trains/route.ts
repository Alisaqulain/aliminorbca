import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Train from '@/lib/models/Train'
import { SAMPLE_TRAINS } from '@/lib/data/sample-trains'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const force = searchParams.get('force') === '1' || searchParams.get('force') === 'true'
    const existing = await Train.countDocuments()
    if (existing > 0 && !force) {
      return NextResponse.json({ message: 'Trains already exist. Use ?force=1 to replace.', count: existing })
    }
    if (force && existing > 0) {
      await Train.deleteMany({})
    }
    await Train.insertMany(SAMPLE_TRAINS)
    return NextResponse.json({ message: 'Sample trains seeded', count: SAMPLE_TRAINS.length })
  } catch (err) {
    console.error('Trains seed error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
