# ✅ Task Manager

A full-stack task management application with JWT authentication, built with React, FastAPI, and PostgreSQL.

![App Screenshot](screenshots/dashboard.png)

🔗 **Live Demo:** [your-app.vercel.app](https://your-app.vercel.app) &nbsp;|&nbsp; **API Docs:** [your-api.railway.app/docs](https://your-api.railway.app/docs)

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
| Auth | JWT (python-jose), bcrypt (passlib) |
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

- **Frontend** — deployed on [Vercel](https://vercel.com). Connect your GitHub repo and set root directory to `client/`.
- **Backend + DB** — deployed on [Railway](https://railway.app). Add a Python service (root: `server/`) and a PostgreSQL plugin. Set environment variables in the Railway dashboard.

---

## Screenshots

| Login | Dashboard |
|---|---|
| ![Login](screenshots/login.png) | ![Dashboard](screenshots/dashboard.png) |

---

## License

MIT © [BLM3](https://github.com/BLM3)
