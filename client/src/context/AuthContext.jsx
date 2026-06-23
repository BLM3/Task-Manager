import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // La încărcarea aplicației sau la refresh, verificăm token-ul cu backend-ul
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token')
            if (!token) {
                setLoading(false)
                return
            }

            try {
                // Întrebăm backend-ul cine este utilizatorul acestui token
                const res = await api.get('/auth/me')
                // Salvăm în starea React toate datele userului (id, email, etc.)
                setUser(res.data)
            } catch (err) {
                // Dacă token-ul a expirat sau e invalid, îl ștergem
                console.error("Sesiune expirată:", err)
                localStorage.removeItem('token')
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password })

        localStorage.setItem('token', res.data.access_token)
        const userRes = await api.get('/auth/me')
        setUser(userRes.data)
    }

    const register = async (email, password) => {
        await api.post('/auth/register', { email, password })
        await login(email, password)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }
    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)