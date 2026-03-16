'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Train, Sparkles } from 'lucide-react'
import Navbar from '@/components/Navbar'
import FormInput from '@/components/FormInput'
import ConfirmDialog from '@/components/ConfirmDialog'
import { useToast } from '@/components/ToastProvider'
import { trainsApi } from '@/lib/api'

interface TrainRow {
  _id: string
  trainName: string
  trainNumber: string
  source: string
  destination: string
  departureTime: string
  arrivalTime: string
  totalSeats: number
  availableSeats?: number
  price: number
  status: string
}

export default function ManageTrainsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [trains, setTrains] = useState<TrainRow[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTrain, setEditingTrain] = useState<TrainRow | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; trainId: string | null }>({ isOpen: false, trainId: null })
  const { success, error } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    from: '',
    to: '',
    departure: '08:00',
    arrival: '18:00',
    capacity: '720',
    price: '500',
  })

  useEffect(() => {
    trainsApi.list().then(({ data }) => {
      if (data?.trains) setTrains(data.trains as TrainRow[])
      setLoading(false)
    })
  }, [])

  const filteredTrains = trains.filter(
    (train) =>
      train.trainName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.trainNumber.includes(searchQuery)
  )

  const handleEdit = (train: TrainRow) => {
    setEditingTrain(train)
    setFormData({
      name: train.trainName,
      number: train.trainNumber,
      from: train.source,
      to: train.destination,
      departure: train.departureTime || '08:00',
      arrival: train.arrivalTime || '18:00',
      capacity: String(train.totalSeats || 720),
      price: String(train.price || 500),
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
      departure: '08:00',
      arrival: '18:00',
      capacity: '720',
      price: '500',
    })
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.number.trim() || !formData.from.trim() || !formData.to.trim()) {
      error('Please fill required fields')
      return
    }
    const payload = {
      trainName: formData.name.trim(),
      trainNumber: formData.number.trim(),
      source: formData.from.trim(),
      destination: formData.to.trim(),
      departureTime: formData.departure,
      arrivalTime: formData.arrival,
      totalSeats: parseInt(formData.capacity, 10) || 720,
      price: parseInt(formData.price, 10) || 500,
    }
    if (editingTrain) {
      const { data, error: err } = await trainsApi.update(editingTrain._id, payload)
      if (err) {
        error(err)
        return
      }
      setTrains((prev) => prev.map((t) => (t._id === editingTrain._id ? { ...t, ...payload, totalSeats: payload.totalSeats } : t)))
      success('Train updated successfully!')
    } else {
      const { data, error: err } = await trainsApi.create(payload)
      if (err) {
        error(err)
        return
      }
      if (data?.train) setTrains((prev) => [data.train as TrainRow, ...prev])
      success('Train added successfully!')
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm({ isOpen: true, trainId: id })
  }

  const confirmDelete = async () => {
    if (!deleteConfirm.trainId) return
    const { error: err } = await trainsApi.delete(deleteConfirm.trainId)
    if (err) {
      error(err)
      setDeleteConfirm({ isOpen: false, trainId: null })
      return
    }
    setTrains((prev) => prev.filter((t) => t._id !== deleteConfirm.trainId))
    success('Train deleted successfully!')
    setDeleteConfirm({ isOpen: false, trainId: null })
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950">
      <Navbar userType="admin" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Manage Trains</h1>
              <p className="text-gray-600 dark:text-gray-400">Add, edit, and manage train schedules</p>
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

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trains by name or number..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-blue-500 focus:outline-none text-gray-900 dark:text-white"
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass dark:bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Train Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Number</th>
                  <th className="px-6 py-4 text-left font-semibold">Route</th>
                  <th className="px-6 py-4 text-left font-semibold">Schedule</th>
                  <th className="px-6 py-4 text-left font-semibold">Seats</th>
                  <th className="px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                      Loading trains...
                    </td>
                  </tr>
                ) : (
                  filteredTrains.map((train, index) => (
                    <motion.tr
                      key={train._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Train className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold text-gray-900 dark:text-white">{train.trainName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{train.trainNumber}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900 dark:text-white">{train.source}</p>
                          <p className="text-gray-500 dark:text-gray-400">→ {train.destination}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                        {train.departureTime} - {train.arrivalTime}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{train.totalSeats}</td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">₹{train.price}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            train.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {train.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() => handleEdit(train)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            onClick={() => handleDelete(train._id)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

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
                className="glass dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {editingTrain ? 'Edit Train' : 'Add New Train'}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput label="Train Name" name="name" value={formData.name} onChange={handleFormChange} />
                  <FormInput label="Train Number" name="number" value={formData.number} onChange={handleFormChange} />
                  <FormInput label="From Station" name="from" value={formData.from} onChange={handleFormChange} />
                  <FormInput label="To Station" name="to" value={formData.to} onChange={handleFormChange} />
                  <FormInput label="Departure (HH:MM)" name="departure" type="time" value={formData.departure} onChange={handleFormChange} />
                  <FormInput label="Arrival (HH:MM)" name="arrival" type="time" value={formData.arrival} onChange={handleFormChange} />
                  <FormInput label="Total Seats" name="capacity" type="number" value={formData.capacity} onChange={handleFormChange} />
                  <FormInput label="Base Price (₹)" name="price" type="number" value={formData.price} onChange={handleFormChange} />
                </div>
                <div className="flex gap-4 mt-6">
                  <motion.button onClick={() => setIsModalOpen(false)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary flex-1">
                    Cancel
                  </motion.button>
                  <motion.button onClick={handleSave} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary flex-1">
                    Save
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          title="Delete Train"
          message="Are you sure you want to delete this train? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirm({ isOpen: false, trainId: null })}
        />
      </div>
    </div>
  )
}
