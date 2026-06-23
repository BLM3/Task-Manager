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
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
                <h1 className="text-lg font-semibold text-gray-800">Task Manager</h1>

                <div className="flex items-center gap-4">
                    {user?.email && (
                        <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        {user.email}
                    </span>
                    )}
                    <button onClick={() => { logout(); navigate('/login') }}
                        className="text-sm font-medium text-gray-500 hover:text-red-500 transition"
                    > Logout
                    </button>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900">Salutare!</h2>
                        <p className="text-sm text-gray-400 mt-0.5">Iată lista ta de activități pentru astăzi.</p>
                    </div>
                    <div className="w-full sm:w-48 bg-gray-50 rounded-xl p-3 border border-gray-100 flex-1">
                        <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1.5">
                            <span>Progres sarcini</span>
                            <span>{completedCount}/{totalCount} ({progressPercent}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h2 className="text-sm font-medium text-gray-700 mb-3">Task nou</h2>
                    <input
                        type="text"
                        placeholder="Titlu task..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Descriere (opțional)..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-gray-400 font-medium uppercase">Prioritate:</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="border border-gray-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="low">Low 🟢</option>
                                <option value="medium">Medium 🟡</option>
                                <option value="high">High 🔴</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Termen limită</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="text-right mt-2 sm:mt-4">
                            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition shadow-sm">+ Adaugă</button>
                        </div>
                    </div>
                </form>

                {/* SECȚIUNE DE FILTRARE ȘI CĂUTARE INTERFAȚĂ */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-col md:flex-row gap-3 border border-gray-100">
                    <input
                        type="text"
                        placeholder="Caută un task..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-medium">Filtru:</span>
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
                                className={`text-xs px-2.5 py-1.5 rounded-md font-medium border transition ${
                                    filterPriority === f.id
                                        ? 'bg-gray-800 text-white border-gray-800'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LISTA DE TASK-URI */}
                {loading ? (<p className="text-center text-gray-400 text-sm">Se încarcă...</p>
                ) : (<>
                        {pending.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                    De făcut ({pending.length})
                                </h2>
                                <div className="space-y-2">
                                    {pending.map(task => (
                                        <div key={task.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                                        {editingId === task.id ? (
                                            /* INTERFAȚA DE EDITARE CÂND DAI CLICK PE CREION */
                                            <div className="space-y-3">
                                                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1 text-sm font-medium" />
                                                <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500" />
                                                <div className="flex gap-2 items-center">
                                                    <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)} className="border border-gray-200 rounded-lg p-1 text-xs bg-white">
                                                        <option value="low">Scăzută</option>
                                                        <option value="medium">Medie</option>
                                                        <option value="high">Ridicată</option>
                                                    </select>
                                                    <input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="border border-gray-200 rounded-lg p-0.5 text-xs text-gray-600" />
                                                    <div className="ml-auto flex gap-1">
                                                        <button onClick={() => saveEdit(task.id)} className="bg-green-600 text-white text-xs px-3 py-1 rounded font-semibold hover:bg-green-700">Salveză</button>
                                                        <button onClick={cancelEdit} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded font-semibold hover:bg-gray-200">Anulează</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* INTERFAȚA NORMALĂ VIZUALĂ */
                                            <div className="flex items-start gap-3">
                                                <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task)} className="mt-1 h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer" />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-sm font-semibold text-gray-800">{task.title}</h3>
                                                        <span className={`text-[9px] px-2 py-0.5 rounded border font-bold ${getPriorityBadge(task.priority)}`}>{task.priority}</span>
                                                        {task.due_date && <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded font-medium">📅 {task.due_date}</span>}
                                                    </div>
                                                    {task.description && <p className="text-xs text-gray-400 mt-1">{task.description}</p>}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => startEdit(task)} className="text-gray-300 hover:text-blue-500 text-xs transition" title="Editează task">✏️</button>
                                                    <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-500 text-sm transition" title="Șterge task">✕</button>
                                                </div>
                                            </div>
                                        )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {completed.length > 0 && (
                            <div>
                                <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
                                    Finalizate ({completed.length})
                                </h2>
                                <div className="space-y-2">
                                    {completed.map(task => (
                                        <div key={task.id} className="bg-white rounded-xl shadow-sm px-4 py-3 flex items-start gap-3 opacity-60">
                                            <input
                                                type="checkbox"
                                                checked={true}
                                                onChange={() => toggleComplete(task)}
                                                className="mt-1 accent-blue-600 cursor-pointer"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium text-gray-800 line-through">{task.title}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded border capitalize font-semibold ${getPriorityBadge(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                </div>
                                                {task.description && <p className="text-xs text-gray-400 mt-0.5">{task.description}</p>}
                                            </div>
                                            <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-400 text-xs transition">✕</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {filteredTasks.length === 0 && (
                            <p className="text-center text-gray-400 text-sm mt-12">Niciun task nu corespunde căutării sau filtrului selectat.</p>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}