import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3777'

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Parse error response (backend may send JSON or text)
export function getErrorMessage(err) {
  const res = err.response
  if (!res) return err.message || 'Network or server error'
  const data = res.data
  if (data && typeof data === 'object' && data.message) return data.message
  if (typeof data === 'string') return data.replace(/^ERROR\s*:\s*/i, '')
  return res.statusText || 'Something went wrong'
}
