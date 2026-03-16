import mongoose from 'mongoose'
import User from '@/lib/models/User'
import { hashPassword } from '@/lib/auth'

const ADMIN_EMAIL = 'ali@gmail.com'
const ADMIN_PASSWORD = 'Ali@2003'
const ADMIN_NAME = 'Admin'

let ensured = false

export async function ensureAdminExists(): Promise<void> {
  if (ensured) return
  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL })
    if (existing) {
      ensured = true
      return
    }
    const hashed = await hashPassword(ADMIN_PASSWORD)
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashed,
      role: 'admin',
    })
    ensured = true
    console.log('[EnsureAdmin] Default admin account created:', ADMIN_EMAIL)
  } catch (e) {
    console.error('[EnsureAdmin] Error:', e)
  }
}
