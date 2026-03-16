import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReview extends Document {
  userId: mongoose.Types.ObjectId
  trainId: mongoose.Types.ObjectId
  rating: number
  comment?: string
  createdAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trainId: { type: Schema.Types.ObjectId, ref: 'Train', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

export default (mongoose.models.Review as Model<IReview>) || mongoose.model<IReview>('Review', ReviewSchema)
