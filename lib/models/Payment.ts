import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  bookingId: mongoose.Types.ObjectId
  amount: number
  paymentMethod: string
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  transactionId?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default (mongoose.models.Payment as Model<IPayment>) || mongoose.model<IPayment>('Payment', PaymentSchema)
