import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Notification from '@/lib/models/Notification'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const notifications = await Notification.find({ userId: payload.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    const unreadCount = await Notification.countDocuments({
      userId: payload.id,
      readStatus: false,
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (err) {
    console.error('Notifications GET error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const payload = getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, markAllRead } = body

    await connectDB()

    if (markAllRead) {
      await Notification.updateMany({ userId: payload.id }, { readStatus: true })
      return NextResponse.json({ message: 'All marked read' })
    }

    if (id) {
      await Notification.findOneAndUpdate(
        { _id: id, userId: payload.id },
        { readStatus: true }
      )
      return NextResponse.json({ message: 'Marked read' })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (err) {
    console.error('Notifications PATCH error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
