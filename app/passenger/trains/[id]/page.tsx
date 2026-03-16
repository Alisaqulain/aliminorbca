'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Train, Clock, MapPin, Calendar, Users, Ticket, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { trainsApi } from '@/lib/api'
import { format } from 'date-fns'

function TrainModel() {
  return (
    <group>
      {/* Train Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 1, 1]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Windows */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 0.3, 0.5]}>
          <boxGeometry args={[0.4, 0.4, 0.1]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      {/* Wheels */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
    </group>
  )
}

const defaultRoute = [
  { station: 'Source', time: '--:--', day: 1 },
  { station: 'Destination', time: '--:--', day: 1 },
]
const amenities = ['WiFi', 'Food Service', 'Charging Points', 'Reading Light']

export default function TrainDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = params.id as string
  const dateParam = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd')
  const [train, setTrain] = useState<{
    _id: string
    trainName: string
    trainNumber: string
    source: string
    destination: string
    departureTime: string
    arrivalTime: string
    availableSeats: number
    price: number
    pricePerClass?: { sleeper?: number; ac3?: number; ac2?: number; ac1?: number }
  } | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [passengers, setPassengers] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    trainsApi.get(id, dateParam).then(({ data }) => {
      if (data?.train) setTrain(data.train as typeof train)
      setLoading(false)
    })
  }, [id, dateParam])

  const trainData = train ? {
    id: train._id,
    name: train.trainName,
    number: train.trainNumber,
    from: train.source,
    to: train.destination,
    departure: train.departureTime,
    arrival: train.arrivalTime,
    duration: (() => {
      const [dh, dm] = (train.departureTime || '00:00').split(':').map(Number)
      const [ah, am] = (train.arrivalTime || '00:00').split(':').map(Number)
      let h = ah - dh, m = am - dm
      if (m < 0) { m += 60; h-- }
      if (h < 0) h += 24
      return `${h}h ${m}m`
    })(),
    date: dateParam,
    classes: train.pricePerClass
      ? [
          { type: 'AC First Class', fare: train.pricePerClass.ac1 || train.price * 2, available: Math.min(train.availableSeats, 20) },
          { type: 'AC 2 Tier', fare: train.pricePerClass.ac2 || train.price * 1.4, available: Math.min(train.availableSeats, 30) },
          { type: 'AC 3 Tier', fare: train.pricePerClass.ac3 || train.price, available: train.availableSeats },
          { type: 'Sleeper', fare: train.pricePerClass.sleeper || train.price * 0.8, available: train.availableSeats },
        ]
      : [],
    route: defaultRoute,
  } : null

  if (loading || !trainData) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
        <div className="text-gray-500">Loading train details...</div>
      </div>
    )
  }

  const classToKey: Record<string, string> = { 'AC First Class': 'ac1', 'AC 2 Tier': 'ac2', 'AC 3 Tier': 'ac3', 'Sleeper': 'sleeper' }
  const bookUrl = `/passenger/booking?trainId=${id}&date=${dateParam}&classType=${selectedClass ? classToKey[selectedClass] || 'ac3' : 'ac3'}&passengers=${passengers}`

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="passenger" />
      <AIChatAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Search
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Train Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{trainData.name}</h1>
                  <p className="text-gray-400">Train No: {trainData.number}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-semibold">AI Recommended</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">From</p>
                    <p className="font-bold text-lg text-white">{trainData.from}</p>
                    <p className="text-blue-400">{trainData.departure}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-400">To</p>
                    <p className="font-bold text-lg text-white">{trainData.to}</p>
                    <p className="text-indigo-400">{trainData.arrival}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-600 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{trainData.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{trainData.date}</span>
                </div>
              </div>
            </motion.div>

            {/* 3D Train Model */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 h-96"
            >
              <h2 className="text-xl font-bold text-white mb-4">3D Train View</h2>
              <div className="w-full h-80 rounded-lg overflow-hidden bg-gray-800/80 border border-gray-600">
                <Canvas>
                  <PerspectiveCamera makeDefault position={[0, 2, 8]} />
                  <ambientLight intensity={0.5} />
                  <directionalLight position={[5, 5, 5]} intensity={1} />
                  <TrainModel />
                  <OrbitControls enableZoom={true} enablePan={false} />
                </Canvas>
              </div>
            </motion.div>

            {/* Route Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Route & Schedule</h2>
              <div className="space-y-4">
                {(trainData.route || defaultRoute).map((stop, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${index === 0 || index === (trainData.route?.length ?? 1) - 1 ? 'bg-blue-500' : 'bg-gray-500'}`} />
                      {index < (trainData.route?.length ?? 1) - 1 && (
                        <div className="w-0.5 h-16 bg-gray-600 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{stop.station}</p>
                          <p className="text-sm text-gray-400">Day {stop.day} • {stop.time}</p>
                        </div>
                        {index === 0 && (
                          <span className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">
                            Departure
                          </span>
                        )}
                        {index === (trainData.route?.length ?? 1) - 1 && (
                          <span className="px-3 py-1 bg-indigo-900/50 text-indigo-300 rounded-full text-xs font-semibold border border-indigo-500/30">
                            Arrival
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {amenities.map((amenity, index) => (
                  <motion.div
                    key={amenity}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-gray-800/80 border border-gray-600 rounded-xl text-center"
                  >
                    <p className="font-semibold text-white">{amenity}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Booking */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 sticky top-24"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Book Tickets</h2>

              {/* Passengers */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Number of Passengers
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPassengers(Math.max(1, passengers - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-600 bg-gray-800 text-white hover:border-blue-500 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={passengers}
                    onChange={(e) => setPassengers(Math.max(1, parseInt(e.target.value) || 1))}
                    min={1}
                    max={6}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-600 bg-gray-800 text-white text-center font-semibold"
                  />
                  <button
                    onClick={() => setPassengers(Math.min(6, passengers + 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-600 bg-gray-800 text-white hover:border-blue-500 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Class Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-300 mb-3">
                  Select Class
                </label>
                <div className="space-y-3">
                  {trainData.classes.map((cls) => (
                    <motion.button
                      key={cls.type}
                      onClick={() => setSelectedClass(cls.type)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        selectedClass === cls.type
                          ? 'border-blue-500 bg-blue-900/30'
                          : 'border-gray-600 bg-gray-800/50 hover:border-blue-400 text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">{cls.type}</p>
                          <p className="text-sm text-gray-400">{cls.available} seats available</p>
                        </div>
                        <p className="text-xl font-bold text-blue-400">₹{cls.fare}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Total */}
              {selectedClass && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-gray-800/80 border border-gray-600 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Total Amount</span>
                    <span className="text-2xl font-bold text-white">
                      ₹{trainData.classes.find(c => c.type === selectedClass)!.fare * passengers}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {passengers} passenger{passengers > 1 ? 's' : ''} × ₹{trainData.classes.find(c => c.type === selectedClass)!.fare}
                  </p>
                </motion.div>
              )}

              {/* Book Button */}
              <Link href={bookUrl}>
                <motion.button
                  disabled={!selectedClass}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                >
                  <Ticket className="w-5 h-5" />
                  Proceed to Book
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

