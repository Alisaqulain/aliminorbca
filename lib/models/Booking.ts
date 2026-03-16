import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPassengerDetail {
  name: string
  age: number
  gender: string
  berthPreference?: string
}

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId
  trainId: mongoose.Types.ObjectId
  seatNumber?: string
  coach?: string
  classType?: string
  passengerDetails: IPassengerDetail[]
  journeyDate: Date
  bookingDate: Date
  status: 'confirmed' | 'cancelled' | 'waiting'
  paymentId?: mongoose.Types.ObjectId
  pnr: string
  totalAmount: number
  waitlistPosition?: number
  createdAt: Date
}

const PassengerDetailSchema = new Schema<IPassengerDetail>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    berthPreference: String,
  },
  { _id: false }
)

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trainId: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
    seatNumber: String,
    coach: String,
    classType: String,
    passengerDetails: [PassengerDetailSchema],
    journeyDate: { type: Date, required: true },
    bookingDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['confirmed', 'cancelled', 'waiting'], default: 'confirmed' },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    pnr: { type: String, required: true, unique: true },
    totalAmount: { type: Number, required: true },
    waitlistPosition: Number,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

BookingSchema.index({ userId: 1 })
BookingSchema.index({ trainId: 1, journeyDate: 1 })
BookingSchema.index({ pnr: 1 })

export default (mongoose.models.Booking as Model<IBooking>) || mongoose.model<IBooking>('Booking', BookingSchema)
