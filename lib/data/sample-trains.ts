/**
 * Sample trains for India – used for seeding. Source/destination names must match
 * or be contained in names from indian-stations (API uses partial match).
 */
export interface TrainEntry {
  trainNumber: string
  trainName: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  totalSeats: number
  availableSeats: number
  price: number
  pricePerClass: { sleeper?: number; ac3?: number; ac2?: number; ac1?: number }
  status: 'active'
  runningDays: string[]
}

export const SAMPLE_TRAINS: TrainEntry[] = [
  { trainNumber: '12301', trainName: 'Rajdhani Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '16:30', arrivalTime: '08:30', totalSeats: 720, availableSeats: 720, price: 1800, pricePerClass: { sleeper: 1200, ac3: 1800, ac2: 2500, ac1: 3500 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12001', trainName: 'Shatabdi Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '06:00', arrivalTime: '14:30', totalSeats: 720, availableSeats: 720, price: 2200, pricePerClass: { sleeper: 1500, ac3: 2200, ac2: 3000, ac1: 4200 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12213', trainName: 'Duronto Express', source: 'New Delhi', destination: 'Mumbai Central', departureTime: '20:15', arrivalTime: '10:45', totalSeats: 720, availableSeats: 720, price: 1700, pricePerClass: { sleeper: 1100, ac3: 1700, ac2: 2400, ac1: 3300 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '19031', trainName: 'Muzaffarnagar Mumbai Express', source: 'Muzaffarnagar', destination: 'Mumbai Central', departureTime: '22:00', arrivalTime: '14:00', totalSeats: 720, availableSeats: 720, price: 850, pricePerClass: { sleeper: 650, ac3: 850, ac2: 1200, ac1: 1800 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '19033', trainName: 'Muzaffarnagar Mumbai SF', source: 'Muzaffarnagar', destination: 'Mumbai Central', departureTime: '08:15', arrivalTime: '22:30', totalSeats: 720, availableSeats: 720, price: 820, pricePerClass: { sleeper: 620, ac3: 820, ac2: 1150, ac1: 1700 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12345', trainName: 'Lucknow Mumbai SF', source: 'Lucknow', destination: 'Mumbai Central', departureTime: '18:30', arrivalTime: '12:00', totalSeats: 720, availableSeats: 720, price: 950, pricePerClass: { sleeper: 700, ac3: 950, ac2: 1350, ac1: 2000 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12138', trainName: 'Pune Mumbai Intercity', source: 'Pune Junction', destination: 'Mumbai Central', departureTime: '07:15', arrivalTime: '10:45', totalSeats: 720, availableSeats: 720, price: 350, pricePerClass: { sleeper: 250, ac3: 350, ac2: 500, ac1: 750 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '22691', trainName: 'Bangalore Chennai Express', source: 'Bangalore City', destination: 'Chennai Central', departureTime: '06:00', arrivalTime: '13:30', totalSeats: 720, availableSeats: 720, price: 450, pricePerClass: { sleeper: 320, ac3: 450, ac2: 650, ac1: 950 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12302', trainName: 'Mumbai Delhi Rajdhani', source: 'Mumbai Central', destination: 'New Delhi', departureTime: '16:25', arrivalTime: '08:15', totalSeats: 720, availableSeats: 720, price: 1800, pricePerClass: { sleeper: 1200, ac3: 1800, ac2: 2500, ac1: 3500 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12951', trainName: 'Mumbai Central Ahmedabad Express', source: 'Mumbai Central', destination: 'Ahmedabad Junction', departureTime: '06:45', arrivalTime: '14:30', totalSeats: 720, availableSeats: 720, price: 550, pricePerClass: { sleeper: 380, ac3: 550, ac2: 780, ac1: 1100 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12779', trainName: 'Mumbai Hyderabad Express', source: 'Mumbai Central', destination: 'Hyderabad Deccan', departureTime: '23:00', arrivalTime: '16:00', totalSeats: 720, availableSeats: 720, price: 720, pricePerClass: { sleeper: 480, ac3: 720, ac2: 1020, ac1: 1500 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '11041', trainName: 'Mumbai Pune Express', source: 'Mumbai Central', destination: 'Pune Junction', departureTime: '07:00', arrivalTime: '10:30', totalSeats: 720, availableSeats: 720, price: 320, pricePerClass: { sleeper: 220, ac3: 320, ac2: 460, ac1: 680 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12269', trainName: 'Delhi Muzaffarnagar Jan Shatabdi', source: 'New Delhi', destination: 'Muzaffarnagar', departureTime: '14:30', arrivalTime: '18:45', totalSeats: 720, availableSeats: 720, price: 280, pricePerClass: { sleeper: 180, ac3: 280, ac2: 400, ac1: 600 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '14235', trainName: 'Muzaffarnagar Delhi Intercity', source: 'Muzaffarnagar', destination: 'New Delhi', departureTime: '06:00', arrivalTime: '09:30', totalSeats: 720, availableSeats: 720, price: 260, pricePerClass: { sleeper: 170, ac3: 260, ac2: 380, ac1: 550 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12834', trainName: 'Howrah Mumbai Mail', source: 'Kolkata Howrah', destination: 'Mumbai Central', departureTime: '22:15', arrivalTime: '08:00', totalSeats: 720, availableSeats: 720, price: 1200, pricePerClass: { sleeper: 780, ac3: 1200, ac2: 1700, ac1: 2500 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12801', trainName: 'Lucknow New Delhi Express', source: 'Lucknow', destination: 'New Delhi', departureTime: '06:00', arrivalTime: '12:30', totalSeats: 720, availableSeats: 720, price: 450, pricePerClass: { sleeper: 300, ac3: 450, ac2: 640, ac1: 950 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12029', trainName: 'Shatabdi Chennai Bangalore', source: 'Chennai Central', destination: 'Bangalore City', departureTime: '06:00', arrivalTime: '11:00', totalSeats: 720, availableSeats: 720, price: 650, pricePerClass: { sleeper: 0, ac3: 650, ac2: 920, ac1: 1350 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
  { trainNumber: '12627', trainName: 'Karnataka Express', source: 'New Delhi', destination: 'Bangalore City', departureTime: '20:30', arrivalTime: '08:00', totalSeats: 720, availableSeats: 720, price: 1450, pricePerClass: { sleeper: 920, ac3: 1450, ac2: 2050, ac1: 3000 }, status: 'active', runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
]
