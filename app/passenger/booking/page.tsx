'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ArrowRight, ArrowLeft, User, Mail, Phone, Calendar, CreditCard, Lock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import AIChatAssistant from '@/components/AIChatAssistant'
import FormInput from '@/components/FormInput'

const steps = [
  { id: 1, title: 'Passenger Details', icon: User },
  { id: 2, title: 'Review & Confirm', icon: Check },
  { id: 3, title: 'Payment', icon: CreditCard },
]

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet'>('card')

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate passenger details
      const newErrors: { [key: string]: string } = {}
      if (!formData.name) newErrors.name = 'Name is required'
      if (!formData.age) newErrors.age = 'Age is required'
      if (!formData.gender) newErrors.gender = 'Gender is required'
      if (!formData.email) newErrors.email = 'Email is required'
      if (!formData.phone) newErrors.phone = 'Phone is required'
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete booking
      router.push('/passenger/history')
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar userType="passenger" />
      <AIChatAssistant />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = currentStep > step.id
              
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white scale-110'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                    </motion.div>
                    <p className={`mt-2 text-sm font-semibold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Passenger Details</h2>
              <div className="space-y-5">
                <FormInput
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="input-field"
                    />
                    {errors.age && (
                      <p className="text-sm text-red-500 mt-1">{errors.age}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="text-sm text-red-500 mt-1">{errors.gender}</p>
                    )}
                  </div>
                </div>
                <FormInput
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <FormInput
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={(e) => handleChange(e as any)}
                    rows={3}
                    className="input-field"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Confirm</h2>
              <div className="space-y-6">
                <div className="p-6 bg-blue-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-4">Journey Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Train</p>
                      <p className="font-semibold">Rajdhani Express (12301)</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-semibold">2024-01-15</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-semibold">New Delhi</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-semibold">Mumbai Central</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Class</p>
                      <p className="font-semibold">AC 2 Tier</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Passengers</p>
                      <p className="font-semibold">1</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-bold text-gray-900 mb-4">Passenger Details</h3>
                  <div className="space-y-2">
                    <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{formData.name}</span></p>
                    <p><span className="text-gray-500">Age:</span> <span className="font-semibold">{formData.age}</span></p>
                    <p><span className="text-gray-500">Gender:</span> <span className="font-semibold">{formData.gender}</span></p>
                    <p><span className="text-gray-500">Email:</span> <span className="font-semibold">{formData.email}</span></p>
                    <p><span className="text-gray-500">Phone:</span> <span className="font-semibold">{formData.phone}</span></p>
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">Total Amount</span>
                    <span className="text-3xl font-bold text-blue-600">₹2,500</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-2xl p-6 sm:p-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'card', label: 'Card', icon: CreditCard },
                      { value: 'upi', label: 'UPI', icon: Phone },
                      { value: 'wallet', label: 'Wallet', icon: Lock },
                    ].map((method) => {
                      const Icon = method.icon
                      return (
                        <motion.button
                          key={method.value}
                          onClick={() => setPaymentMethod(method.value as any)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            paymentMethod === method.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300'
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2 text-gray-700" />
                          <p className="font-semibold text-sm">{method.label}</p>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4"
                  >
                    <FormInput label="Card Number" name="cardNumber" placeholder="1234 5678 9012 3456" />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput label="Expiry Date" name="expiry" placeholder="MM/YY" />
                      <FormInput label="CVV" name="cvv" placeholder="123" />
                    </div>
                    <FormInput label="Cardholder Name" name="cardName" placeholder="John Doe" />
                  </motion.div>
                )}

                {paymentMethod === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <FormInput label="UPI ID" name="upiId" placeholder="yourname@paytm" />
                  </motion.div>
                )}

                <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-gray-900">Amount to Pay</span>
                    <span className="text-2xl font-bold text-green-600">₹2,500</span>
                  </div>
                  <p className="text-sm text-gray-600">Secure payment powered by encryption</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <motion.button
            onClick={handleBack}
            disabled={currentStep === 1}
            whileHover={{ scale: currentStep > 1 ? 1.05 : 1 }}
            whileTap={{ scale: currentStep > 1 ? 0.95 : 1 }}
            className="btn-secondary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
          <motion.button
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center gap-2"
          >
            {currentStep === 3 ? 'Complete Booking' : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  )
}

