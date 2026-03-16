import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

/**
 * GET /api/db-test
 * Tests MongoDB connection. No auth required.
 * Use this to verify MONGODB_URI in .env.local
 */
export async function GET() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    return NextResponse.json(
      {
        connected: false,
        message: 'MONGODB_URI is not set in .env or .env.local',
        hint: 'Add MONGODB_URI to .env.local. If your password contains @, encode it as %40 (e.g. Ali%402003).',
      },
      { status: 503 }
    )
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 })
    const state = mongoose.connection.readyState
    // 1 = connected. Do not disconnect so the app can keep using the connection.
    if (state === 1) {
      return NextResponse.json({
        connected: true,
        message: 'MongoDB connected successfully.',
      })
    }
    return NextResponse.json(
      {
        connected: false,
        message: `Connection state: ${state} (1=connected).`,
      },
      { status: 503 }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    const hint =
      message.includes('auth') || message.includes('Authentication')
        ? 'If your password contains @ or #, encode them in MONGODB_URI: @ → %40, # → %23 (e.g. Ali%402003).'
        : 'Check MONGODB_URI format and that the cluster allows connections from this IP (Atlas: Network Access).'
    return NextResponse.json(
      {
        connected: false,
        message,
        hint,
      },
      { status: 503 }
    )
  }
}
