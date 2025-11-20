'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Train, Sparkles, TrendingUp, AlertCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import FormInput from '@/components/FormInput'

const trains = [
  {
    id: '1',
    name: 'Rajdhani Express',
    number: '12301',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departure: '16:30',
    arrival: '08:30',
    capacity: 1200,
    occupancy: 85,
    status: 'active',
    aiRecommendation: 'High demand route - consider adding coaches',
  },
  {
    id: '2',
    name: 'Shatabdi Express',
    number: '12001',
    from: 'New Delhi',
    to: 'Mumbai Central',
    departure: '06:00',
    arrival: '14:30',
    capacity: 800,
    occupancy: 92,
    status: 'active',
    aiRecommendation: 'Near capacity - urgent action needed',
  },
  {
    id: '3',
    name: 'Duronto Express',
    number: '12213',
    from: 'Bangalore City',
    to: 'Chennai Central',
    departure: '20:15',
    arrival: '06:45',
    capacity: 1000,
    occupancy: 65,
    status: 'active',
    aiRecommendation: 'Optimal capacity - no changes needed',
  },
]

export default function ManageTrainsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrain, setEditingTrain] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    from: '',
    to: '',
    departure: '',
    arrival: '',
    capacity: '',
  })

  const filteredTrains = trains.filter(train =>
    train.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    train.number.includes(searchQuery)
  )

  const handleEdit = (train: any) => {
    setEditingTrain(train)
    setFormData({
      name: train.name,
      number: train.number,
      from: train.from,
      to: train.to,
      departure: train.departure,
      arrival: train.arrival,
      capacity: train.capacity.toString(),
    })
    setIsModalOpen(true)
  }

  const handleAdd = () => {
    setEditingTrain(null)
    setFormData({
      name: '',
      number: '',
      from: '',
      to: '',
      departure: '',
      arrival: '',
      capacity: '',
    })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    // Save logic
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this train?')) {
      // Delete logic
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar userType="admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Trains</h1>
              <p className="text-gray-600">AI-powered capacity and schedule management</p>
            </div>
            <motion.button
              onClick={handleAdd}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Train
            </motion.button>
          </div>
        </motion.div>

        {/* AI Recommendations Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">AI Recommendations</h3>
              <p className="text-sm text-gray-700">
                Based on booking trends, AI suggests capacity adjustments for 2 trains. Review recommendations below.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trains by name or number..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Trains Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Train Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Number</th>
                  <th className="px-6 py-4 text-left font-semibold">Route</th>
                  <th className="px-6 py-4 text-left font-semibold">Schedule</th>
                  <th className="px-6 py-4 text-left font-semibold">Capacity</th>
                  <th className="px-6 py-4 text-left font-semibold">Occupancy</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTrains.map((train, index) => (
                  <motion.tr
                    key={train.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Train className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-gray-900">{train.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{train.number}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-semibold text-gray-900">{train.from}</p>
                        <p className="text-gray-500">→ {train.to}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-gray-900">{train.departure} - {train.arrival}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{train.capacity}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${train.occupancy}%` }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className={`h-full ${
                              train.occupancy > 90
                                ? 'bg-red-500'
                                : train.occupancy > 75
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{train.occupancy}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        train.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {train.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          onClick={() => handleEdit(train)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(train.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* AI Recommendations for each train */}
        <div className="mt-6 space-y-4">
          {filteredTrains.filter(t => t.occupancy > 80).map((train, index) => (
            <motion.div
              key={train.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              className="glass rounded-xl p-5 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{train.name} ({train.number})</h3>
                    <span className="px-3 py-1 bg-white/80 rounded-full text-xs font-semibold text-gray-700">
                      {train.occupancy}% Occupied
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{train.aiRecommendation}</p>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold"
                    >
                      Add Coaches
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-semibold border-2 border-gray-300"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingTrain ? 'Edit Train' : 'Add New Train'}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Train Name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <FormInput
                    label="Train Number"
                    name="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                  <FormInput
                    label="From Station"
                    name="from"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  />
                  <FormInput
                    label="To Station"
                    name="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  />
                  <FormInput
                    label="Departure Time"
                    name="departure"
                    type="time"
                    value={formData.departure}
                    onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                  />
                  <FormInput
                    label="Arrival Time"
                    name="arrival"
                    type="time"
                    value={formData.arrival}
                    onChange={(e) => setFormData({ ...formData, arrival: e.target.value })}
                  />
                  <FormInput
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>
                <div className="flex gap-4 mt-6">
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSave}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-primary flex-1"
                  >
                    Save
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

