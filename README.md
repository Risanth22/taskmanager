# 🐳 TaskFlow — Docker Fullstack App

A complete fullstack Task Manager built with:
- **Frontend** → HTML/CSS/JS served via Nginx
- **Backend**  → Node.js + Express REST API
- **Database** → MySQL 8
- **DevOps**   → Docker + Docker Compose

---

## 📁 Project Structure

```
taskmanager/
├── docker-compose.yml        ← Orchestrates all services
├── mysql/
│   └── init.sql              ← DB schema + seed data
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   └── server.js             ← Express REST API
└── frontend/
    ├── Dockerfile
    └── index.html            ← Full UI (vanilla JS)
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Run the App

```bash
# 1. Clone or unzip the project
cd taskmanager

# 2. Start all services with ONE command
docker-compose up --build

# 3. Open your browser
#    Frontend  →  http://localhost:3000
#    Backend   →  http://localhost:5000/api/tasks
```

### Stop the App

```bash
docker-compose down

# To also delete the database volume:
docker-compose down -v
```

---

## 🔌 API Endpoints

| Method | Endpoint          | Description        |
|--------|-------------------|--------------------|
| GET    | /api/health       | Health check       |
| GET    | /api/tasks        | Get all tasks      |
| GET    | /api/tasks/:id    | Get single task    |
| POST   | /api/tasks        | Create task        |
| PUT    | /api/tasks/:id    | Update task        |
| DELETE | /api/tasks/:id    | Delete task        |

### Example API call:
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","status":"todo","priority":"high"}'
```

---

## 🐳 How Docker Works Here

```
docker-compose up
       │
       ├── 🗄️  MySQL container   (port 3306)
       │         └── Runs init.sql on first start
       │
       ├── ⚙️  Backend container  (port 5000)
       │         └── Waits for MySQL to be healthy
       │         └── Retries DB connection automatically
       │
       └── 🌐 Frontend container (port 3000)
                 └── Nginx serves index.html
                 └── Talks to backend via localhost:5000
```

---

## 📦 What Each File Does

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Defines all 3 services, networks, volumes |
| `backend/Dockerfile` | Builds Node.js image (node:18-alpine) |
| `frontend/Dockerfile` | Builds Nginx image serving HTML |
| `mysql/init.sql` | Creates tables + inserts sample data |
| `backend/server.js` | Full CRUD REST API with retry logic |
| `frontend/index.html` | Kanban board UI, fetches from API |
