'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Loader2 } from 'lucide-react'

interface StationSuggestion {
  _id: string
  name: string
  code: string
  city?: string
}

interface SmartSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  excludeValue?: string
}

export default function SmartSearch({
  value,
  onChange,
  placeholder = 'Search stations...',
  excludeValue = '',
}: SmartSearchProps) {
  const [suggestions, setSuggestions] = useState<StationSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchStations = useCallback(async (q: string) => {
    if (!q || q.length < 1) {
      const res = await fetch(`/api/stations`)
      const data = await res.json()
      const list = (data.stations || []).slice(0, 15)
      setSuggestions(list)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/stations?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      let list = (data.stations || []).slice(0, 20) as StationSuggestion[]
      const exclude = excludeValue?.trim().toLowerCase()
      if (exclude) {
        list = list.filter((s) => s.name.toLowerCase() !== exclude)
      }
      setSuggestions(list)
    } finally {
      setLoading(false)
    }
  }, [excludeValue])

  useEffect(() => {
    const t = setTimeout(() => fetchStations(value), value.length === 0 ? 0 : 300)
    return () => clearTimeout(t)
  }, [value, fetchStations])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (name: string) => {
    onChange(name)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 rounded-xl border-2 border-gray-600 bg-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all text-white placeholder:text-gray-500"
        />
        {loading && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
        )}
        {value && !loading && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => { onChange(''); setIsOpen(true) }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ×
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full mt-2 w-full rounded-xl bg-gray-800 border border-gray-700 shadow-xl z-50 max-h-72 overflow-y-auto"
          >
            {suggestions.length === 0 && !loading ? (
              <div className="p-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                {value.length < 1 ? 'Type to search stations' : 'No stations found. Seed stations: POST /api/stations/seed'}
              </div>
            ) : (
              <div className="py-2">
                {suggestions.map((s) => (
                  <button
                    key={s._id}
                    type="button"
                    onClick={() => handleSelect(s.name)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
                  >
                    <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                    <div>
                      <p className="font-medium">{s.name}</p>
                      {s.code && <p className="text-xs text-gray-500 dark:text-gray-400">{s.code}</p>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
