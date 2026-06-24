import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const [loading, setLoading] = useState(false)
    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark')

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!email || !password || !confirmPassword) return setError('Toate câmpurile sunt obligatorii.')
        if (password !== confirmPassword) return setError('Parolele nu coincid.')
        if (password.length < 6) return setError('Parola trebuie să aibă cel puțin 6 caractere.')

        try {
            setLoading(true)

            // Trimitem cererea către backend
            const res = await api.post('/auth/register', {
                email: email,
                password: password
            })

            console.log("Înregistrare reușită:", res.data)
            navigate('/login')
        } catch (err) {
            // FOARTE IMPORTANT: Această linie ne va spune în F12 ce s-a întâmplat de fapt!
            console.error("EROARE DETALIATĂ ÎN BROWSER:", err)

            // Dacă serverul a trimis un mesaj de eroare specific, îl afișăm, altfel punem mesajul generic
            if (err.response && err.response.data && err.response.data.detail) {
                setError(err.response.data.detail)
            } else {
                setError('Înregistrarea a eșuat. Verifică conexiunea cu serverul.')
            }
        } finally {
            setLoading(false)
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
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Creează un cont</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Alătură-te gratuit și începe organizarea.</p>
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
                            placeholder="Minim 6 caractere"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-slate-200 dark:border-[#222f43] bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition placeholder-slate-400 dark:placeholder-slate-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                            Confirmă Parola
                        </label>
                        <input
                            type="password"
                            placeholder="Repetă parola"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full border border-slate-200 dark:border-[#222f43] bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition placeholder-slate-400 dark:placeholder-slate-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.99] disabled:opacity-50 mt-4 cursor-pointer"
                    >
                        {loading ? 'Se procesează...' : 'Înregistrează-te'}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-[#1e293b] text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ai deja un cont creat?{' '}
                        <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold transition">
                            Loghează-te aici
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    )
}