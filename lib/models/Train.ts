import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISeat {
  number: string
  coach: string
  class: string
  isBooked: boolean
  bookedFor?: mongoose.Types.ObjectId
}

export interface ITrain extends Document {
  trainNumber: string
  trainName: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  totalSeats: number
  availableSeats: number
  price: number
  pricePerClass?: { sleeper?: number; ac3?: number; ac2?: number; ac1?: number }
  status: 'active' | 'inactive' | 'cancelled'
  seats?: ISeat[]
  runningDays?: string[]
  createdAt: Date
}

const SeatSchema = new Schema<ISeat>(
  {
    number: String,
    coach: String,
    class: String,
    isBooked: { type: Boolean, default: false },
    bookedFor: { type: Schema.Types.ObjectId, ref: 'Booking' },
  },
  { _id: false }
)

const TrainSchema = new Schema<ITrain>(
  {
    trainNumber: { type: String, required: true, unique: true },
    trainName: { type: String, required: true },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    departureTime: { type: String, required: true },
    arrivalTime: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    price: { type: Number, required: true },
    pricePerClass: {
      sleeper: Number,
      ac3: Number,
      ac2: Number,
      ac1: Number,
    },
    status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'active' },
    seats: [SeatSchema],
    runningDays: [String],
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default (mongoose.models.Train as Model<ITrain>) || mongoose.model<ITrain>('Train', TrainSchema)
