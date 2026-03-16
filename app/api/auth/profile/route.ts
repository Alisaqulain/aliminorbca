import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import { getUserFromRequest } from '@/lib/auth'

export async function PATCH(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, phone } = body

    await connectDB()
    const update: { name?: string; phone?: string } = {}
    if (typeof name === 'string' && name.trim()) update.name = name.trim()
    if (typeof phone === 'string') update.phone = phone.trim() || undefined

    const user = await User.findByIdAndUpdate(payload.id, { $set: update }, { new: true })
      .select('-password')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    })
  } catch (err) {
    console.error('Profile update error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
