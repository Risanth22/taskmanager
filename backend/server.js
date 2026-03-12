const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ─── DB Connection with Retry ────────────────────────────────────────────────
let db;
async function connectDB() {
  const maxRetries = 10;
  for (let i = 0; i < maxRetries; i++) {
    try {
      db = await mysql.createConnection({
        host: process.env.DB_HOST || "mysql",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "secret",
        database: process.env.DB_NAME || "taskdb",
      });
      console.log("✅ Connected to MySQL");
      return;
    } catch (err) {
      console.log(`⏳ DB not ready, retrying (${i + 1}/${maxRetries})...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  process.exit(1);
}

// ─── Routes ──────────────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Task Manager API is running 🚀" });
});

// GET all tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM tasks ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single task
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
app.post("/api/tasks", async (req, res) => {
  const { title, description, status = "todo", priority = "medium" } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  try {
    const [result] = await db.execute(
      "INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)",
      [title, description, status, priority]
    );
    const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update task
app.put("/api/tasks/:id", async (req, res) => {
  const { title, description, status, priority } = req.body;
  try {
    await db.execute(
      "UPDATE tasks SET title=?, description=?, status=?, priority=? WHERE id=?",
      [title, description, status, priority, req.params.id]
    );
    const [rows] = await db.execute("SELECT * FROM tasks WHERE id = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE task
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    await db.execute("DELETE FROM tasks WHERE id = ?", [req.params.id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`🚀 Backend running on http://localhost:${PORT}`)
  );
});
