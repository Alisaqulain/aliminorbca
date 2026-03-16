'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User as UserIcon, Sparkles, Trash2, Train, Ticket, CreditCard, HelpCircle } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'                                                                                                                                                                                                                                                                     
  timestamp: Date
  links?: { label: string; href: string }[]
}

const getAIResponse = (input: string): { text: string; links?: { label: string; href: string }[] } => {
  const lower = input.toLowerCase().trim()

  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      text: "Hello! I'm your AliRail AI assistant. I can help you with train search, booking steps, PNR status, cancellation, refunds, payments, and more. What do you need?",
      links: [
        { label: 'Search Trains', href: '/passenger/search' },
        { label: 'My Tickets', href: '/passenger/history' },
      ],
    }
  }

  if (lower.includes('availability') || lower.includes('available') || lower.includes('train') && (lower.includes('find') || lower.includes('search'))) {
    return {
      text: "To check train availability: go to Search Trains, enter From and To stations, select date and passengers, then click Search. You'll see all available trains with fares and seat availability.",
      links: [{ label: 'Search Trains', href: '/passenger/search' }],
    }
  }

  if (lower.includes('book') || lower.includes('booking') || lower.includes('reserve')) {
    return {
      text: "Booking steps: 1) Search trains and pick one → 2) Click 'Book Now' → 3) Enter passenger details → 4) Review and confirm → 5) Pay (Razorpay). After payment you'll get your e-ticket with PNR and QR code.",
      links: [
        { label: 'Search Trains', href: '/passenger/search' },
        { label: 'My Tickets', href: '/passenger/history' },
      ],
    }
  }

  if (lower.includes('cancel') || lower.includes('cancellation')) {
    return {
      text: "You can cancel from My Tickets: open the booking and click 'Cancel'. Cancellation is allowed as per policy; charges may apply. Refunds are processed within 5–7 business days.",
      links: [{ label: 'My Tickets', href: '/passenger/history' }],
    }
  }

  if (lower.includes('pnr') || lower.includes('status') || lower.includes('ticket')) {
    return {
      text: "Your PNR is on the e-ticket. To view a ticket: go to My Tickets, then click 'View Ticket' on the booking. You can download the PDF and scan the QR code for verification.",
      links: [{ label: 'My Tickets', href: '/passenger/history' }],
    }
  }

  if (lower.includes('refund') || lower.includes('money back')) {
    return {
      text: "Refunds are processed after cancellation. Amount is credited within 5–7 business days to the same payment method. For partial cancellation, only the cancelled passenger's fare is refunded as per rules.",
      links: [{ label: 'My Tickets', href: '/passenger/history' }],
    }
  }

  if (lower.includes('payment') || lower.includes('pay') || lower.includes('razorpay')) {
    return {
      text: "We use Razorpay for secure payments. After confirming your booking you'll be redirected to pay. On success you'll see the e-ticket; if payment fails, you can retry from My Tickets → Pay Now.",
      links: [{ label: 'My Tickets', href: '/passenger/history' }],
    }
  }

  if (lower.includes('seat') || lower.includes('coach') || lower.includes('class')) {
    return {
      text: "You can choose class (Sleeper, AC 3 Tier, AC 2 Tier, AC 1) on the train detail page before booking. Seat/coach are assigned after payment. WL (waitlist) means you'll get a seat if one becomes available.",
    }
  }

  if (lower.includes('help') || lower.includes('support') || lower.includes('contact')) {
    return {
      text: "For booking help use the steps above. For account or payment issues, check your profile and My Tickets. This chatbot can answer: search, booking, PNR, cancellation, refund, and payment.",
      links: [
        { label: 'Profile', href: '/passenger/profile' },
        { label: 'My Tickets', href: '/passenger/history' },
      ],
    }
  }

  if (lower.includes('thank') || lower.includes('thanks')) {
    return { text: "You're welcome! Safe travels. Ask anytime if you need more help." }
  }

  if (lower.includes('station') || lower.includes('from') && lower.includes('to') || lower.includes('route')) {
    return {
      text: "You can search trains between any two stations. Go to Search Trains, type the station name in 'From' and 'To' (e.g. Delhi, Mumbai Central). We support major Indian railway stations with autocomplete.",
      links: [{ label: 'Search Trains', href: '/passenger/search' }],
    }
  }

  if (lower.includes('waitlist') || lower.includes('wl') || lower.includes('wait list')) {
    return {
      text: "If seats are full, you may get a waitlist (WL) number. Your ticket is confirmed when a seat becomes available. You can check status in My Tickets. Refund is processed if the journey date passes without confirmation.",
      links: [{ label: 'My Tickets', href: '/passenger/history' }],
    }
  }

  if (lower.includes('fare') || lower.includes('price') || lower.includes('cost')) {
    return {
      text: "Fares depend on train and class (Sleeper, AC 3 Tier, AC 2 Tier, AC 1). After you search trains, each result shows price per class. Total amount is calculated at booking based on passengers and class.",
      links: [{ label: 'Search Trains', href: '/passenger/search' }],
    }
  }

  if (lower.includes('time') || lower.includes('schedule') || lower.includes('departure') || lower.includes('arrival')) {
    return {
      text: "Departure and arrival times are shown in search results and on the train detail page. Your e-ticket also shows the exact times. All times are as per Indian Railway schedule.",
    }
  }

  if (lower.includes('profile') || lower.includes('account') || lower.includes('password')) {
    return {
      text: "Manage your profile, update name/phone, and change password from the Profile page. You can also view your booking history and download tickets from there.",
      links: [{ label: 'Profile', href: '/passenger/profile' }],
    }
  }

  return {
    text: "I can help with: train search, booking steps, PNR/ticket view, cancellation, refunds, payment, stations, waitlist, and fares. Try a quick question below or type your query.",
    links: [
      { label: 'Search Trains', href: '/passenger/search' },
      { label: 'My Tickets', href: '/passenger/history' },
    ],
  }
}

const quickQuestions = [
  { label: 'How to book a ticket?', icon: Ticket },
  { label: 'Search trains', icon: Train },
  { label: 'Cancellation & refund', icon: CreditCard },
  { label: 'View my tickets', icon: Ticket },
  { label: 'Payment & PNR help', icon: HelpCircle },
]

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hello! I'm your Railway Assistant, powered by AI. I can help you with:\n\n• Searching trains and checking availability\n• Booking steps and payment\n• PNR status and e-ticket\n• Cancellation and refunds\n• Stations, fares, and waitlist\n\nType your question or tap a quick action below.",
      sender: 'bot',
      timestamp: new Date(),
      links: [
        { label: 'Search Trains', href: '/passenger/search' },
        { label: 'My Tickets', href: '/passenger/history' },
        { label: 'Profile', href: '/passenger/profile' },
      ],
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text?: string) => {
    const toSend = (text ?? input).trim()
    if (!toSend) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: toSend,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    const { text: responseText, links } = getAIResponse(toSend)
    const delay = 600 + Math.min(responseText.length * 15, 800)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        links,
      }
      setIsTyping(false)
      setMessages((prev) => [...prev, botMessage])
    }, delay)
  }

  const handleQuickQuestion = (label: string) => {
    setInput(label)
    setTimeout(() => handleSend(label), 50)
  }

  const clearChat = () => {
    setMessages([
      {
        id: '0',
        text: "New chat started. How can I help you? Ask about trains, booking, PNR, cancellation, refunds, or use the quick actions below.",
        sender: 'bot',
        timestamp: new Date(),
        links: [
          { label: 'Search Trains', href: '/passenger/search' },
          { label: 'My Tickets', href: '/passenger/history' },
        ],
      },
    ])
  }

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-blue-500/50 border-2 border-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <MessageCircle className="w-7 h-7" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 w-[420px] max-w-[calc(100vw-3rem)] h-[580px] rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-600 bg-gray-900/98 backdrop-blur-xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-800/90">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    Railway Assistant
                  </h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Powered by AI · Always here to help
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors text-xs"
                  title="New chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'bot' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-100 border border-gray-700'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    {message.links && message.links.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.links.map((link) => (
                          <Link
                            key={link.href + link.label}
                            href={link.href}
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-500/50 rounded-lg px-2.5 py-1.5 hover:bg-blue-500/10"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                    <p className="text-xs mt-1.5 opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserIcon className="w-5 h-5 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-700 bg-gray-800/60">
              <p className="text-xs font-medium text-gray-400 mb-2">Quick actions</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => handleQuickQuestion(label)}
                    className="text-xs px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 border border-gray-600 hover:border-blue-500/50"
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-900/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder="Ask about trains, booking, PNR, cancellation..."
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-600 bg-gray-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none text-sm"
                />
                <motion.button
                  onClick={() => handleSend()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
