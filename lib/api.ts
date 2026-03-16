const API_BASE = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  const res = await fetch(`${API_BASE}/api/auth/me`, { credentials: 'include' })
  if (!res.ok) return null
  const data = await res.json()
  return data.token || null
}

export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ data?: T; error?: string; status: number }> {
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  const res = await fetch(url, { ...options, credentials: 'include', headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    return { error: data.error || 'Request failed', status: res.status }
  }
  return { data: data as T, status: res.status }
}

export const stationsApi = {
  list: (q?: string) =>
    api<{ stations: { _id: string; name: string; code: string; city?: string }[] }>(
      `/api/stations${q ? '?q=' + encodeURIComponent(q) : ''}`
    ),
  seed: () => api<{ message: string; count: number }>('/api/stations/seed', { method: 'POST' }),
}

export const authApi = {
  signup: (body: { name: string; email: string; password: string; phone?: string }) =>
    api<{ user: unknown; token: string }>('/api/auth/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: { email: string; password: string }) =>
    api<{ user: unknown; token: string }>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => api('/api/auth/logout', { method: 'POST' }),
  me: () => api<{ user: { id: string; name: string; email: string; role: string; phone?: string } }>('/api/auth/me'),
  updateProfile: (body: { name?: string; phone?: string }) =>
    api<{ user: { id: string; name: string; email: string; role: string; phone?: string } }>('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    api<{ message: string }>('/api/auth/change-password', { method: 'POST', body: JSON.stringify(body) }),
}

export const trainsApi = {
  list: (params?: { source?: string; destination?: string; date?: string; passengers?: number }) => {
    const search: Record<string, string> = {}
    if (params?.source) search.source = params.source
    if (params?.destination) search.destination = params.destination
    if (params?.date) search.date = params.date
    if (params?.passengers != null) search.passengers = String(params.passengers)
    const q = new URLSearchParams(search).toString()
    return api<{ trains: unknown[] }>(`/api/trains${q ? '?' + q : ''}`)
  },
  get: (id: string, date?: string) =>
    api<{ train: unknown; bookedSeats: string[] }>(`/api/trains/${id}${date ? '?date=' + date : ''}`),
  create: (body: unknown) => api<{ train: unknown }>('/api/trains', { method: 'POST', body: JSON.stringify(body) }),
  update: (id: string, body: unknown) =>
    api<{ train: unknown }>(`/api/trains/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (id: string) => api(`/api/trains/${id}`, { method: 'DELETE' }),
}

export const bookingsApi = {
  list: () => api<{ bookings: unknown[] }>('/api/bookings'),
  create: (body: {
    trainId: string
    journeyDate: string
    passengerDetails: { name: string; age: number; gender: string }[]
    classType?: string
    seatNumber?: string
    coach?: string
  }) => api<{ booking: unknown; totalAmount: number; paymentRequired: boolean }>('/api/bookings', { method: 'POST', body: JSON.stringify(body) }),
  get: (id: string) => api<{ booking: unknown }>(`/api/bookings/${id}`),
  cancel: (id: string) => api<{ message: string }>(`/api/bookings/${id}`, { method: 'DELETE' }),
}

export const paymentsApi = {
  create: (body: { bookingId: string; amount: number; paymentMethod?: string }) =>
    api<{ payment: unknown; success: boolean }>('/api/payments/create', { method: 'POST', body: JSON.stringify(body) }),
  verify: (body: { paymentId: string; razorpayPaymentId?: string; razorpayOrderId?: string }) =>
    api<{ success: boolean }>('/api/payments/verify', { method: 'POST', body: JSON.stringify(body) }),
}

export const notificationsApi = {
  list: () => api<{ notifications: unknown[]; unreadCount: number }>('/api/notifications'),
  markRead: (id?: string, markAllRead?: boolean) =>
    api('/api/notifications', { method: 'PATCH', body: JSON.stringify({ id, markAllRead }) }),
}

export const adminApi = {
  stats: () => api<{ stats: unknown; recentBookings: unknown[] }>('/api/admin/stats'),
  reports: (period?: string) =>
    api<{ revenueByDay: unknown[]; bookingsByTrain: unknown[]; popularRoutes: unknown[]; occupancy: unknown[] }>(
      `/api/admin/reports${period ? '?period=' + period : ''}`
    ),
  users: () => api<{ users: unknown[] }>('/api/admin/users'),
  blockUser: (userId: string, isBlocked: boolean) =>
    api<{ user: unknown }>('/api/admin/users', {
      method: 'PATCH',
      body: JSON.stringify({ userId, isBlocked }),
    }),
}

export const aiApi = {
  suggest: (body: { source: string; destination: string; preference?: 'cheapest' | 'fastest' | 'available' }) =>
    api<{ suggestions: unknown[] }>('/api/ai/suggest', { method: 'POST', body: JSON.stringify(body) }),
}
