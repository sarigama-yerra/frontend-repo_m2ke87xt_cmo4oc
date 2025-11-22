import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_BACKEND_URL || ''

function useAuth() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [me, setMe] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem('token')
    if (saved) {
      fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${saved}` } })
        .then(r => r.ok ? r.json() : null)
        .then(setMe)
        .catch(() => setMe(null))
    }
  }, [])

  const login = async (email, password) => {
    const r = await fetch(`${API}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (!r.ok) throw new Error('Login failed')
    const data = await r.json()
    localStorage.setItem('token', data.access_token)
    setToken(data.access_token)
    const meResp = await fetch(`${API}/api/auth/me`, { headers: { Authorization: `Bearer ${data.access_token}` } })
    setMe(await meResp.json())
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    setMe(null)
  }

  return { token, me, login, logout }
}

export default function Dashboard() {
  const { token, me, login, logout } = useAuth()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    fetch(`${API}/api/rooms/seed`).then(() => {
      fetch(`${API}/api/rooms/available`).then(r => r.json()).then(setRooms)
    })
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-16">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
        <h2 className="text-white text-xl font-semibold mb-2">Authentication</h2>
        {me ? (
          <div className="flex items-center justify-between">
            <div className="text-blue-100">Logged in as {me.name} • {me.role}</div>
            <button onClick={logout} className="px-4 py-2 bg-red-600 text-white rounded-lg">Logout</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-4 gap-3">
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" className="sm:col-span-2 px-3 py-2 rounded bg-white/10 text-white placeholder:text-blue-200/60" />
            <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" className="px-3 py-2 rounded bg-white/10 text-white placeholder:text-blue-200/60" />
            <button onClick={()=>login(email,password)} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Login</button>
          </div>
        )}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-white text-xl font-semibold mb-4">Available Rooms</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {rooms.map(r => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="text-white font-medium">{r.room_no}</div>
              <div className="text-blue-200 text-sm">Type: {r.type || 'N/A'}</div>
              <div className="text-blue-200 text-sm">Capacity: {r.capacity}</div>
              <div className="text-blue-200 text-sm">Occupied: {r.current_occupancy}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
