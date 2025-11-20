'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  message: string
  type?: ToastType
  duration?: number
  onClose: () => void
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const colors = {
    success: {
      bg: 'from-emerald-500 to-teal-500',
      border: 'border-emerald-400/30',
      text: 'text-emerald-50',
      iconBg: 'bg-emerald-500',
    },
    error: {
      bg: 'from-red-500 to-rose-500',
      border: 'border-red-400/30',
      text: 'text-red-50',
      iconBg: 'bg-red-500',
    },
    info: {
      bg: 'from-blue-500 to-indigo-500',
      border: 'border-blue-400/30',
      text: 'text-blue-50',
      iconBg: 'bg-blue-500',
    },
    warning: {
      bg: 'from-amber-500 to-orange-500',
      border: 'border-amber-400/30',
      text: 'text-amber-50',
      iconBg: 'bg-amber-500',
    },
  }

  const Icon = icons[type]
  const colorScheme = colors[type]

  return (
    <div className={`bg-gradient-to-r ${colorScheme.bg} backdrop-blur-xl rounded-xl p-4 shadow-2xl border-2 ${colorScheme.border} flex items-center gap-3`}>
      <div className={`w-10 h-10 ${colorScheme.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className={`flex-1 ${colorScheme.text} font-semibold`}>{message}</p>
      <button
        onClick={onClose}
        className={`p-1.5 ${colorScheme.iconBg} rounded-lg hover:opacity-80 transition-opacity flex-shrink-0`}
      >
        <X className="w-4 h-4 text-white" />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: Array<{ id: string; message: string; type: ToastType }>
  removeToast: (id: string) => void
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3 flex flex-col items-end">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="min-w-[300px] max-w-md"
          >
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

