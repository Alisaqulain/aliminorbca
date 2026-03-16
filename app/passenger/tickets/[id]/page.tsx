'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * /passenger/tickets/[id] redirects to /ticket/[id] (single ticket view).
 */
export default function PassengerTicketRedirectPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  useEffect(() => {
    if (id) router.replace(`/ticket/${id}`)
  }, [id, router])

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-purple-950 to-indigo-950 flex items-center justify-center">
      <p className="text-gray-400">Redirecting to ticket...</p>
    </div>
  )
}
