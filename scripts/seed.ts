/**
 * Seed script: run with npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed.ts
 * Or add to package.json: "seed": "ts-node --compiler-options '{\"module\":\"CommonJS\"}' scripts/seed.ts"
 */
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/railway_reservation'

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
  phone: String,
  isBlocked: Boolean,
  createdAt: Date,
}, { timestamps: true })

const TrainSchema = new mongoose.Schema({
  trainNumber: String,
  trainName: String,
  source: String,
  destination: String,
  departureTime: String,
  arrivalTime: String,
  totalSeats: Number,
  availableSeats: Number,
  price: Number,
  pricePerClass: Object,
  status: String,
  runningDays: [String],
  createdAt: Date,
}, { timestamps: true })

const User = mongoose.models.User || mongoose.model('User', UserSchema)
const Train = mongoose.models.Train || mongoose.model('Train', TrainSchema)

const trains = [
  { trainNumber: '12301', trainName: 'Rajdhani Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '16:30', arrivalTime: '08:30', totalSeats: 100, availableSeats: 100, price: 1800, pricePerClass: { sleeper: 1200, ac3: 1800, ac2: 2500, ac1: 3500 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12001', trainName: 'Shatabdi Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '06:00', arrivalTime: '14:30', totalSeats: 80, availableSeats: 80, price: 2200, pricePerClass: { sleeper: 1500, ac3: 2200, ac2: 3000, ac1: 4200 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12213', trainName: 'Duronto Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '20:15', arrivalTime: '10:45', totalSeats: 120, availableSeats: 120, price: 1700, pricePerClass: { sleeper: 1100, ac3: 1700, ac2: 2400, ac1: 3300 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12636', trainName: 'Kerala Express', source: 'New Delhi', destination: 'Bangalore City', departureTime: '14:45', arrivalTime: '22:30', totalSeats: 90, availableSeats: 90, price: 1600, pricePerClass: { sleeper: 1000, ac3: 1600, ac2: 2200, ac1: 3100 }, status: 'active', runningDays: ['Mon', 'Wed', 'Fri'] },
  { trainNumber: '12802', trainName: 'Howrah Mail', source: 'Kolkata Howrah', destination: 'New Delhi', departureTime: '22:30', arrivalTime: '06:15', totalSeats: 110, availableSeats: 110, price: 1400, pricePerClass: { sleeper: 900, ac3: 1400, ac2: 2000, ac1: 2800 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
]

async function seed() {
  await mongoose.connect(MONGODB_URI)
  const hashedPass = await bcrypt.hash('admin123', 12)
  const userPass = await bcrypt.hash('passenger123', 12)

  await User.deleteMany({})
  await User.create([
    { name: 'Admin User', email: 'admin@railway.com', password: hashedPass, role: 'admin', isBlocked: false },
    { name: 'Test Passenger', email: 'passenger@test.com', password: userPass, role: 'passenger', phone: '9876543210', isBlocked: false },
  ])

  await Train.deleteMany({})
  await Train.insertMany(trains)

  console.log('Seed done. Admin: admin@railway.com / admin123, Passenger: passenger@test.com / passenger123')
  process.exit(0)
}

seed().catch((e) => { console.error(e); process.exit(1) })
