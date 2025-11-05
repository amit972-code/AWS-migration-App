const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "db", // This is the Docker service name
  user: "root",
  password: "root123",
  database: "task_manager",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

// --- API Endpoints ---

// Register
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "INSERT INTO users(username,password) VALUES(?,?)",
    [username, password],
    (err, result) => {
      if (err) return res.status(400).json({ error: "Username exists" });
      res.json({ message: "Registered successfully" });
    }
  );
});

// Login
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(401).json({ error: "Invalid credentials" });
      res.json({
        message: "Login success",
        userId: result[0].id,
        username: result[0].username,
      });
    }
  );
});

// Get tasks for a user
app.get("/api/tasks/:userId", (req, res) => {
  const userId = req.params.userId;
  db.query("SELECT * FROM tasks WHERE user_id=?", [userId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Add task
app.post("/api/tasks", (req, res) => {
  const { userId, task_name } = req.body;
  db.query(
    "INSERT INTO tasks(user_id,task_name) VALUES(?,?)",
    [userId, task_name],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Task added" });
    }
  );
});

// Delete task
app.delete("/api/tasks/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  db.query("DELETE FROM tasks WHERE id=?", [taskId], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Task deleted" });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
