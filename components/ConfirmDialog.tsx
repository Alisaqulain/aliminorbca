'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Check } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning',
}: ConfirmDialogProps) {
  const colorSchemes = {
    danger: {
      bg: 'from-red-500 to-rose-500',
      border: 'border-red-400/30',
      button: 'bg-red-600 hover:bg-red-700',
      icon: 'text-red-600',
    },
    warning: {
      bg: 'from-amber-500 to-orange-500',
      border: 'border-amber-400/30',
      button: 'bg-amber-600 hover:bg-amber-700',
      icon: 'text-amber-600',
    },
    info: {
      bg: 'from-blue-500 to-indigo-500',
      border: 'border-blue-400/30',
      button: 'bg-blue-600 hover:bg-blue-700',
      icon: 'text-blue-600',
    },
  }

  const scheme = colorSchemes[type]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />
          
          {/* Dialog */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`bg-white rounded-2xl shadow-2xl max-w-md w-full border-2 ${scheme.border} overflow-hidden`}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${scheme.bg} p-6 flex items-center gap-4`}>
                <div className={`w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <AlertTriangle className={`w-6 h-6 ${scheme.icon}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{title}</h3>
                </div>
                <button
                  onClick={onCancel}
                  className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-6">{message}</p>
                
                {/* Actions */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={onCancel}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={onConfirm}
                    className={`px-6 py-2.5 ${scheme.button} text-white rounded-lg font-semibold transition-colors flex items-center gap-2`}
                  >
                    <Check className="w-4 h-4" />
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

