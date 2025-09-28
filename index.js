import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || "mysecret";

app.use(bodyParser.json());

let tasks = [
  { id: 1, title: "Setup Jenkins pipeline", done: false },
  { id: 2, title: "Write unit tests", done: true }
];

// --- Authentication ---
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    const token = jwt.sign({ user: username }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }
  res.status(401).send("Invalid credentials");
});

function authenticate(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).send("Missing token");
  const token = header.split(" ")[1];
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).send("Invalid token");
    req.user = user;
    next();
  });
}

// --- CRUD ---
app.get('/tasks', authenticate, (req, res) => res.json(tasks));

app.post('/tasks', authenticate, (req, res) => {
  const newTask = { id: tasks.length + 1, ...req.body };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', authenticate, (req, res) => {
  const task = tasks.find(t => t.id == req.params.id);
  if (!task) return res.status(404).send("Task not found");
  Object.assign(task, req.body);
  res.json(task);
});

app.delete('/tasks/:id', authenticate, (req, res) => {
  tasks = tasks.filter(t => t.id != req.params.id);
  res.status(204).send();
});

// --- Monitoring ---
app.get('/health', (req, res) => res.json({ status: "ok", uptime: process.uptime() }));
app.get('/metrics', (req, res) => res.json({ tasks_count: tasks.length, memory: process.memoryUsage().heapUsed }));

// Start server only if run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
