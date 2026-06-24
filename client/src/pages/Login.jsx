import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark')

    // Sincronizare clasă Dark Mode pe elementul HTML root
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [darkMode])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            await login(email, password)
            navigate('/dashboard')
        } catch (err) {
            if (!err.response) {
                setError('Serverul nu răspunde. Verifică conexiunea.')
            } else {
                setError(err.response.data.detail || 'A apărut o eroare.')
            }
        }
    }
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-[#0b0f19] flex flex-col justify-center items-center p-4 transition-colors duration-300 relative">

            {/* Buton Teme */}
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-6 right-6 bg-white dark:bg-[#131a26] border border-slate-200 dark:border-[#1e293b] p-2.5 rounded-xl shadow-md text-lg hover:scale-105 transition cursor-pointer text-slate-700 dark:text-amber-400"
                title="Schimbă tema"
            >
                {darkMode ? '☀️' : '🌙'}
            </button>

            {/* Cardul Principal */}
            <div className="w-full max-w-md bg-white dark:bg-[#131a26] border border-slate-200/60 dark:border-[#1e293b] rounded-2xl shadow-xl dark:shadow-2xl p-8 transition-colors duration-300">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-3 text-4xl">
                        👤
                    </div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Bine ai revenit!</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Conectează-te pentru a-ți gestiona sarcinile.</p>
                </div>

                {/* Eroare */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 text-xs px-4 py-3 rounded-xl mb-5 font-medium flex items-center gap-2">
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Formular */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Adresă Email
                        </label>
                        <input
                            type="email"
                            placeholder="nume@exemplu.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border border-slate-200 dark:border-[#222f43] bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition placeholder-slate-400 dark:placeholder-slate-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Parolă
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-slate-200 dark:border-[#222f43] bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition placeholder-slate-400 dark:placeholder-slate-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer"
                    >
                        {loading ? 'Se conectează...' : 'Intră în cont'}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#1e293b] text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Nu ai un cont încă?{' '}
                        <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold transition">
                            Creează cont nou
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}