'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, TrendingUp, Clock, MapPin } from 'lucide-react'

interface SearchSuggestion {
  id: string
  text: string
  type: 'station' | 'route' | 'popular'
  popularity?: number
}

const POPULAR_STATIONS = [
  'Mumbai Central', 'New Delhi', 'Bangalore City', 'Chennai Central',
  'Kolkata Howrah', 'Hyderabad Deccan', 'Pune Junction', 'Ahmedabad Junction',
]

const POPULAR_ROUTES = [
  { from: 'Mumbai Central', to: 'New Delhi', popularity: 95 },
  { from: 'Bangalore City', to: 'Chennai Central', popularity: 88 },
  { from: 'Kolkata Howrah', to: 'New Delhi', popularity: 82 },
  { from: 'Pune Junction', to: 'Mumbai Central', popularity: 79 },
]

interface SmartSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onSelect?: (suggestion: SearchSuggestion) => void
}

export default function SmartSearch({
  value,
  onChange,
  placeholder = 'Search stations or routes...',
  onSelect,
}: SmartSearchProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showPopular, setShowPopular] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value.length > 0) {
      const filtered = [
        ...POPULAR_STATIONS.filter((s) =>
          s.toLowerCase().includes(value.toLowerCase())
        ).map((s) => ({
          id: s,
          text: s,
          type: 'station' as const,
        })),
        ...POPULAR_ROUTES.filter(
          (r) =>
            r.from.toLowerCase().includes(value.toLowerCase()) ||
            r.to.toLowerCase().includes(value.toLowerCase())
        ).map((r) => ({
          id: `${r.from}-${r.to}`,
          text: `${r.from} → ${r.to}`,
          type: 'route' as const,
          popularity: r.popularity,
        })),
      ]
      setSuggestions(filtered.slice(0, 5))
      setIsOpen(true)
      setShowPopular(false)
    } else {
      setSuggestions([])
      setIsOpen(false)
      setShowPopular(true)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text)
    setIsOpen(false)
    onSelect?.(suggestion)
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all"
        />
        {value && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => {
              onChange('')
              inputRef.current?.focus()
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ×
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full glass rounded-lg shadow-xl border border-white/20 z-50 max-h-96 overflow-y-auto"
          >
            {showPopular && value.length === 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Popular Routes</h3>
                </div>
                <div className="space-y-2">
                  {POPULAR_ROUTES.map((route, index) => (
                    <motion.button
                      key={`${route.from}-${route.to}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() =>
                        handleSelect({
                          id: `${route.from}-${route.to}`,
                          text: `${route.from} → ${route.to}`,
                          type: 'route',
                          popularity: route.popularity,
                        })
                      }
                      className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {route.from} → {route.to}
                          </p>
                          <p className="text-xs text-gray-500">Popular route</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${route.popularity}%` }}
                            transition={{ delay: index * 0.1 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                          />
                        </div>
                        <span className="text-xs font-semibold text-blue-600">
                          {route.popularity}%
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {suggestions.length > 0 && (
              <div className="p-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelect(suggestion)}
                    className="w-full text-left p-3 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-3"
                  >
                    {suggestion.type === 'route' ? (
                      <MapPin className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-indigo-600" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{suggestion.text}</p>
                      <p className="text-xs text-gray-500">
                        {suggestion.type === 'route' ? 'Popular route' : 'Station'}
                        {suggestion.popularity && ` • ${suggestion.popularity}% popular`}
                      </p>
                    </div>
                    {suggestion.popularity && (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    )}
                  </motion.button>
                ))}
              </div>
            )}

            {!showPopular && suggestions.length === 0 && value.length > 0 && (
              <div className="p-4 text-center text-gray-500">
                No suggestions found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

