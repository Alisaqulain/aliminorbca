import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IStation extends Document {
  name: string
  code: string
  city?: string
  state?: string
  createdAt: Date
}

const StationSchema = new Schema<IStation>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, uppercase: true, trim: true },
    city: String,
    state: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

StationSchema.index({ name: 'text', code: 'text' })
StationSchema.index({ name: 1 })

export default (mongoose.models.Station as Model<IStation>) || mongoose.model<IStation>('Station', StationSchema)
