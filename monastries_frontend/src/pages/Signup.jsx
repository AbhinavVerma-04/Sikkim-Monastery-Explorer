import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { getErrorMessage } from '../api'
import { validateSignup } from '../utils/validation'
import { Layout } from '../components/Layout'

export default function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', emailId: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateSignup(form)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setLoading(true)
    try {
      await signup(form)
      toast.success('Account created! Welcome.')
      navigate('/')
    } catch (err) {
      const msg = getErrorMessage(err)
      toast.error(msg)
      setErrors({ form: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout noHero>
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        <div className="glass rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-900/40">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-amber-50 mb-2">Create account</h2>
          <p className="text-stone-400 text-sm mb-6">Join to explore monasteries, book visits and contribute.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-200/90 mb-1">First name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/80 border border-amber-900/50 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="First name"
                />
                {errors.firstName && <p className="mt-1 text-xs text-rose-400">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-200/90 mb-1">Last name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-stone-900/80 border border-amber-900/50 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  placeholder="Last name"
                />
                {errors.lastName && <p className="mt-1 text-xs text-rose-400">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-200/90 mb-1">Email</label>
              <input
                name="emailId"
                type="email"
                value={form.emailId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-stone-900/80 border border-amber-900/50 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="you@example.com"
              />
              {errors.emailId && <p className="mt-1 text-xs text-rose-400">{errors.emailId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-200/90 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-stone-900/80 border border-amber-900/50 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                placeholder="Min 8 chars, upper, lower, number, symbol"
              />
              {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password}</p>}
            </div>
            {errors.form && <p className="text-sm text-rose-400">{errors.form}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 font-semibold hover:brightness-110 transition disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
          <p className="mt-4 text-center text-stone-400 text-sm">
            Already have an account? <Link to="/login" className="text-amber-400 hover:text-amber-300">Login</Link>
          </p>
        </div>
      </div>
    </Layout>
  )
}
