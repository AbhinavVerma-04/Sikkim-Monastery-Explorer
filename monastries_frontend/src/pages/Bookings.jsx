import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../api'
import { Layout } from '../components/Layout'
import { ProtectedRoute } from '../components/ProtectedRoute'
import { Calendar } from 'lucide-react'

export default function Bookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data.bookings || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-amber-50 mb-6 flex items-center gap-2"><Calendar className="w-8 h-8" /> My bookings</h1>
          {loading && <p className="text-stone-400">Loading...</p>}
          {!loading && bookings.length === 0 && (
            <div className="glass rounded-2xl p-8 text-center text-stone-400">
              <p>You have no bookings yet.</p>
              <a href="/explore" className="mt-4 inline-block text-amber-400 hover:text-amber-300">Explore monasteries and book a visit</a>
            </div>
          )}
          {!loading && bookings.length > 0 && (
            <ul className="space-y-4">
              {bookings.map((b) => (
                <li key={b.bookingId} className="glass rounded-xl p-4 flex flex-wrap justify-between gap-4">
                  <div>
                    <p className="font-medium text-amber-100">{b.monasteryName}</p>
                    <p className="text-stone-400 text-sm">Visit date: {b.visitDate} · {b.numberOfPeople} people</p>
                    <p className="text-stone-500 text-xs">ID: {b.bookingId}</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-900/50 text-amber-200 text-sm">{b.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  )
}
