# ✅ Task Manager

A full-stack task management application with JWT authentication, built with React, FastAPI, and PostgreSQL.

![App Screenshot](screenshots/dashboard.png)

🔗 **Live Demo:** [task-manager-umber-xi.vercel.app](https://task-manager-umber-xi.vercel.app) &nbsp;|&nbsp; **API Docs:** [task-manager-production-e8f1.up.railway.app/docs](https://task-manager-production-e8f1.up.railway.app/docs)

---

## Features

- 🔐 JWT authentication — register, login, protected routes
- ✅ Create, complete, and delete tasks
- 📦 RESTful API with auto-generated Swagger docs
- 🎨 Clean, responsive UI with Tailwind CSS
- 🚀 Deployed on Vercel (frontend) + Railway (backend + database)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Python, FastAPI, SQLAlchemy |
| Database | PostgreSQL |
| Auth | JWT (python-jose),Native Hashing (bcrypt) |
| Deploy | Vercel, Railway |

---

## Project Structure
```
task-manager/
├── screenshots/            # App screenshots
├── client/                 # React frontend
│   └── src/
│       ├── api/
│       │   └── axios.js        # Axios instance with JWT interceptor
│       ├── context/
│       │   └── AuthContext.jsx # Global auth state
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           └── Dashboard.jsx
│   └── vercel.json        # Vercel configuration for SPA routing
└── server/                 # FastAPI backend
    └── app/
        ├── routers/
        │   ├── auth.py         # /auth/register, /auth/login
        │   └── tasks.py        # CRUD /tasks
        ├── main.py             # App entry point, CORS
        ├── models.py           # SQLAlchemy models (User, Task)
        ├── schemas.py          # Pydantic request/response schemas
        ├── auth.py             # JWT encode/decode, bcrypt
        └── database.py         # DB engine, session, Base
```
---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### 1. Clone the repository

```bash
git clone https://github.com/BLM3/task-manager.git
cd task-manager
```

### 2. Backend setup

```bash
cd server
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the `server/` folder (see `.env.example`):

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskmanager
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Start the backend:

```bash
uvicorn app.main:app --reload
```

API available at `http://127.0.0.1:8000` — Swagger docs at `http://127.0.0.1:8000/docs`

### 3. Frontend setup

```bash
cd client
Create a .env file in the client/ folder for local development:
Fragment de cod
VITE_API_URL=[http://127.0.0.1:8000](http://127.0.0.1:8000)

npm install
npm run dev
```

App available at `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create account | ❌ |
| POST | `/auth/login` | Login, returns JWT | ❌ |
| GET | `/tasks/` | Get all user tasks | ✅ |
| POST | `/tasks/` | Create a task | ✅ |
| PUT | `/tasks/{id}` | Update a task | ✅ |
| DELETE | `/tasks/{id}` | Delete a task | ✅ |

---

## Environment Variables

Create a `server/.env` file based on this template:

```env
# server/.env.example
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/taskmanager
JWT_SECRET=change-this-to-a-random-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
```

---

## Deployment

### 💻 Frontend (Vercel)
Aplicația de frontend este găzduită pe [Vercel](https://vercel.com).

1. Conectează contul tău de GitHub la Vercel și importă repository-ul `task-manager`.
2. În configurarea proiectului, setează **Root Directory** ca fiind `client/`.
3. Mergi la secțiunea **Environment Variables** și adaugă următoarea cheie:
   - `VITE_API_URL`: `https://task-manager-production-e8f1.up.railway.app` *(Atenție: fără bară `/` la final)*.
4. Pentru a suporta rutele dinamice (React Router) fără erori `404 NOT FOUND`, proiectul conține deja fișierul de configurare `vercel.json` în rădăcina folderului de client.

### ⚙️ Backend & Baza de date (Railway)
Backend-ul și baza de date PostgreSQL rulează pe [Railway](https://railway.app).

1. Creează un nou proiect pe Railway și adaugă un serviciu din GitHub, selectând folderul `server/`.
2. Adaugă un plugin/serviciu de **PostgreSQL** în același proiect. Railway va genera automat variabila `DATABASE_URL`.
3. Mergi la tab-ul **Variables** din serviciul tău de backend FastAPI și configurează manual:
   - `DATABASE_URL`: *(se preia automat din baza de date conectată)*
   - `JWT_SECRET`: `o-cheie-secreta-si-lunga`
   - `JWT_ALGORITHM`: `HS256`
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
4. Serverul este optimizat pentru producție: rulează pe Python 3.13, folosește portul dinamic injectat de Railway (`PORT`) și utilizează hashing nativ prin `bcrypt` pentru a evita erorile de compatibilitate din producție

---

## Screenshots

| Login | Dashboard |
|---|---|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

---

## License

MIT © [BLM3].
