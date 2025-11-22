import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen">
        <header className="px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/flame-icon.svg" alt="Flames" className="w-10 h-10" />
            <h1 className="text-white font-semibold text-lg tracking-tight">Hostel Management</h1>
          </div>
          <div className="text-blue-200/80 text-sm">Demo build</div>
        </header>
        <main>
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
