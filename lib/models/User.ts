import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'passenger' | 'admin'
  phone?: string
  isBlocked?: boolean
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['passenger', 'admin'], default: 'passenger' },
    phone: { type: String, trim: true },
    isBlocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema)
