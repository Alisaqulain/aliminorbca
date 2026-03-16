import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import { getUserFromRequest, hashPassword, comparePassword } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Current password and new password (min 6 characters) required' },
        { status: 400 }
      )
    }

    await connectDB()
    const user = await User.findById(payload.id).select('+password')
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const match = await comparePassword(currentPassword, user.password)
    if (!match) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    user.password = await hashPassword(newPassword)
    await user.save()

    return NextResponse.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('Change password error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
