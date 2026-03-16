import mongoose, { Schema, Document, Model } from 'mongoose'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  message: string
  readStatus: boolean
  type?: 'booking' | 'cancellation' | 'reminder' | 'general'
  relatedId?: mongoose.Types.ObjectId
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    readStatus: { type: Boolean, default: false },
    type: { type: String, enum: ['booking', 'cancellation', 'reminder', 'general'] },
    relatedId: Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

NotificationSchema.index({ userId: 1, readStatus: 1 })

export default (mongoose.models.Notification as Model<INotification>) ||
  mongoose.model<INotification>('Notification', NotificationSchema)
