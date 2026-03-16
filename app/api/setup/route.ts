import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Station from '@/lib/models/Station'
import Train from '@/lib/models/Train'
import { INDIAN_STATIONS } from '@/lib/data/indian-stations'
import { SAMPLE_TRAINS } from '@/lib/data/sample-trains'

/**
 * GET /api/setup – Seed stations and trains if DB is empty.
 * Call once (e.g. from search page) so search works for all Indian stations.
 */
export async function GET() {
  try {
    await connectDB()
    let stationsAdded = 0
    let trainsAdded = 0
    const stationCount = await Station.countDocuments()
    if (stationCount === 0) {
      for (const s of INDIAN_STATIONS) {
        await Station.findOneAndUpdate(
          { code: s.code },
          { $set: { name: s.name, code: s.code, city: s.city, state: s.state } },
          { upsert: true, new: true }
        )
        stationsAdded++
      }
    }
    const trainCount = await Train.countDocuments()
    if (trainCount === 0) {
      await Train.insertMany(SAMPLE_TRAINS)
      trainsAdded = SAMPLE_TRAINS.length
    }
    return NextResponse.json({
      ok: true,
      message: 'Setup complete',
      stationsAdded,
      trainsAdded,
      stationCount: stationCount + stationsAdded,
      trainCount: trainCount + trainsAdded,
    })
  } catch (err) {
    console.error('Setup error:', err)
    return NextResponse.json({ error: 'Setup failed' }, { status: 500 })
  }
}
