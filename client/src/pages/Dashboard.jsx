import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Dashboard() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const [dueDate, setDueDate] = useState('')
    const [loading, setLoading] = useState(true)

    const [searchQuery, setSearchQuery] = useState('')
    const [filterPriority, setFilterPriority] = useState('all')

    // STARE PENTRU EDITARE (Îmbunătățirea cu creionul ✏️)
    const [editingId, setEditingId] = useState(null)
    const [editTitle, setEditTitle] = useState('')
    const [editDesc, setEditDesc] = useState('')
    const [editPriority, setEditPriority] = useState('medium')
    const [editDueDate, setEditDueDate] = useState('')

    const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark')
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark')
            localStorage.setItem('theme', 'dark')
        } else {
            document.documentElement.classList.remove('dark')
            localStorage.setItem('theme', 'light')
        }
    }, [darkMode])

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks/')
            setTasks(res.data)
        } catch {
            handleLogout();navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!title.trim()) return
        try {
            const res = await api.post('/tasks/', {
                title,description,priority,due_date: dueDate || null  })

            setTasks([...tasks, res.data])
            setTitle('')
            setDescription('')
            setPriority('medium')
            setDueDate('')
        } catch (err) {
            console.error("Eroare la crearea task-ului:", err)
        }
    }
    const startEdit = (task) => {
        setEditingId(task.id)
        setEditTitle(task.title)
        setEditDesc(task.description || '')
        setEditPriority(task.priority)
        setEditDueDate(task.due_date || '')
    }

    const cancelEdit = () => {
        setEditingId(null)
    }
    const saveEdit = async (id) => {
        if (!editTitle.trim()) return
        const res = await api.put(`/tasks/${id}`, {
            title: editTitle,
            description: editDesc,
            priority: editPriority,
            due_date: editDueDate || null
        })
        setTasks(tasks.map(t => t.id === id ? res.data : t))
        setEditingId(null)
    }

    const toggleComplete = async (task) => {
        const res = await api.put(`/tasks/${task.id}`, { completed: !task.completed })
        setTasks(tasks.map(t => t.id === task.id ? res.data : t))
    }

    const deleteTask = async (id) => {
        await api.delete(`/tasks/${id}`)
        setTasks(tasks.filter(t => t.id !== id))
    }

    const getPriorityBadge = (prio) => {
        switch (prio) {
            case 'high': return 'bg-red-50 text-red-700 border-red-100'
            case 'medium': return 'bg-amber-50 text-amber-700 border-amber-100'
            case 'low': return 'bg-green-50 text-green-700 border-green-100'
            default: return 'bg-gray-50 text-gray-700 border-gray-100'
        }
    }
    const totalCount = tasks.length
    const completedCount = tasks.filter(t => t.completed).length
    const pendingCount = totalCount - completedCount
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
        const matchesFilter = filterPriority === 'all' || task.priority === filterPriority
        return matchesSearch && matchesFilter
    })
    const pending = filteredTasks.filter(t => !t.completed)
    const completed = filteredTasks.filter(t => t.completed)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 text-gray-800 dark:text-zinc-100 transition-colors duration-300">
            {/* Header */}
            <header className="bg-white dark:bg-zinc-900 border-b border-gray-100 dark:border-zinc-800 px-6 py-4 flex justify-between items-center shadow-sm">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Task Manager</h1>

                <div className="flex items-center gap-4">
                    {/* Butonul de Dark Mode */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-xl border border-gray-150 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>

                    {user?.email && (
                        <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 text-xs px-2.5 py-1 rounded-full font-medium border border-blue-100 dark:border-blue-900">
                            {user.email}
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-gray-500 hover:text-red-500 dark:text-zinc-400 dark:hover:text-red-400 transition"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Continut Principal */}
            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Statistici */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Salutare!</h2>
                        <p className="text-sm text-gray-400 dark:text-zinc-500 mt-0.5">Iată lista ta de activități pentru astăzi.</p>
                    </div>
                    <div className="w-full sm:w-48 bg-gray-50 dark:bg-zinc-950 rounded-xl p-3 border border-gray-100 dark:border-zinc-800 flex-1">
                        <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5">
                            <span>Progres sarcini</span>
                            <span>{completedCount}/{totalCount} ({progressPercent}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Formular adăugare task */}
                <form onSubmit={handleCreate} className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-6 mb-6">
                    <h2 className="text-sm font-medium text-gray-700 dark:text-zinc-300 mb-3">Task nou</h2>
                    <input
                        type="text"
                        placeholder="Titlu task..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-200 dark:border-zinc-800 bg-transparent rounded-lg px-4 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <input
                        type="text"
                        placeholder="Descriere (opțional)..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-200 dark:border-zinc-800 bg-transparent rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-400 dark:text-zinc-500 font-medium uppercase">Prioritate:</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-1 text-sm bg-white dark:bg-zinc-900 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="low">Low 🟢</option>
                                    <option value="medium">Medium 🟡</option>
                                    <option value="high">High 🔴</option>
                                </select>
                            </div>
                            <div>
                                <label className="inline-block text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase mr-1">Termen limită</label>
                                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border border-gray-200 dark:border-zinc-800 rounded-lg px-2 py-0.5 text-sm bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm">+ Adaugă</button>
                    </div>
                </form>

                {/* Secțiunea filtrare și căutare */}
                <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3 border border-gray-100 dark:border-zinc-800">
                    <input
                        type="text"
                        placeholder="Caută un task..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border border-gray-200 dark:border-zinc-800 bg-transparent rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                    />
                    <div className="flex items-center gap-2 overflow-x-auto">
                        <span className="text-xs text-gray-400 dark:text-zinc-500 font-medium">Filtru:</span>
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'high', label: 'High' },
                            { id: 'medium', label: 'Medium' },
                            { id: 'low', label: 'Low' }
                        ].map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setFilterPriority(f.id)}
                                className={`text-xs px-3.5 py-1.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
                                    filterPriority === f.id
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-[#1e293b] hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Lista task-uri */}
                {loading ? (
                    <p className="text-center text-gray-400 dark:text-zinc-500 text-sm">Se încarcă...</p>
                ) : (
                    <>
                        {/* Task-uri DE FĂCUT */}
                        {pending.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-3">
                                    De făcut ({pending.length})
                                </h2>
                                <div className="space-y-2">
                                    {pending.map(task => (
                                        <div key={task.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-zinc-800">
                                            {editingId === task.id ? (
                                                <div className="space-y-3">
                                                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border border-gray-200 dark:border-zinc-800 bg-transparent rounded-lg px-3 py-1 text-sm font-medium dark:text-white" />
                                                    <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full border border-gray-200 dark:border-zinc-800 bg-transparent rounded-lg px-3 py-1 text-xs text-gray-500 dark:text-zinc-400" />
                                                    <div className="flex flex-wrap gap-2 items-center justify-between">
                                                        <div className="flex gap-2">
                                                            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className="border border-gray-200 dark:border-zinc-800 rounded-lg p-1 text-xs bg-white dark:bg-zinc-900 dark:text-zinc-300">
                                                                <option value="low">Scăzută</option>
                                                                <option value="medium">Medie</option>
                                                                <option value="high">Ridicată</option>
                                                            </select>
                                                            <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="border border-gray-200 dark:border-zinc-800 rounded-lg p-0.5 text-xs bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-300" />
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <button onClick={() => saveEdit(task.id)} className="bg-green-600 text-white text-xs px-3 py-1 rounded font-semibold hover:bg-green-700">Salveză</button>
                                                            <button onClick={cancelEdit} className="bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 text-xs px-3 py-1 rounded font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700">Anulează</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-start gap-3">
                                                    <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-zinc-700 accent-blue-600 cursor-pointer" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h3 className="text-sm font-semibold text-gray-800 dark:text-zinc-200 truncate">{task.title}</h3>
                                                            <span className={`text-[9px] px-2 py-0.5 rounded border font-bold ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
                                                            {task.due_date && <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900 px-2 py-0.5 rounded font-medium">📅 {task.due_date}</span>}
                                                        </div>
                                                        {task.description && <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">{task.description}</p>}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => startEdit(task)} className="text-gray-300 dark:text-zinc-600 hover:text-blue-500 text-xs transition" title="Editează task">✏️</button>
                                                        <button onClick={() => deleteTask(task.id)} className="text-gray-300 dark:text-zinc-600 hover:text-red-500 text-sm transition" title="Șterge task">✕</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Task-uri FINALIZATE */}
                        {completed.length > 0 && (
                            <div>
                                <h2 className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wide mb-3">
                                    Finalizate ({completed.length})
                                </h2>
                                <div className="space-y-2">
                                    {completed.map(task => (
                                        <div key={task.id} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm px-4 py-3 flex items-start gap-3 border border-gray-50 dark:border-zinc-900 opacity-60">
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                onChange={() => toggleComplete(task)}
                                                className="mt-1 accent-blue-600 cursor-pointer"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-zinc-400 line-through truncate">{task.title}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border capitalize font-semibold ${getPriorityBadge(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                {task.description && <p className="text-xs text-gray-400 dark:text-zinc-600 mt-0.5 line-through">{task.description}</p>}
                                            </div>
                                            <button onClick={() => deleteTask(task.id)} className="text-gray-300 dark:text-zinc-600 hover:text-red-400 text-xs transition">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredTasks.length === 0 && (
                            <p className="text-center text-gray-400 dark:text-zinc-600 text-sm mt-12">Niciun task nu corespunde căutării sau filtrului selectat.</p>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}