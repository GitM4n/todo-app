import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';
import { User } from '../types';

const db = new Database('./database.sqlite');
db.pragma('foreign_keys = ON');

// --- Создаем таблицы ---
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  role TEXT DEFAULT 'user',
  createdAt INTEGER
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  dueDate INTEGER,
  isCompleted INTEGER DEFAULT 0,
  createdBy INTEGER NOT NULL,
  createdAt INTEGER,
  FOREIGN KEY (createdBy) REFERENCES users(id)
);
`);

db.exec(`
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT UNIQUE,
  userId INTEGER,
  createdAt INTEGER,
  FOREIGN KEY (userId) REFERENCES users(id)
);
`);

// --- Проверяем, есть ли пользователи ---
const existingUsers = db.prepare('SELECT * FROM users').all();

if (existingUsers.length === 0) {
  const hash = bcrypt.hashSync('123456', 10);

  // --- Создаем пользователей ---
  const insertUser = db.prepare(
    'INSERT INTO users (email, password, role, createdAt) VALUES (?, ?, ?, ?)'
  );

  const usersData = [
    { email: 'admin@test.com', role: 'admin' },
    { email: 'user1@test.com', role: 'user' },
    { email: 'user2@test.com', role: 'user' },
    { email: 'user3@test.com', role: 'user' },
    { email: 'user4@test.com', role: 'user' },
    { email: 'user5@test.com', role: 'user' },
  ];

  for (const u of usersData) {
    insertUser.run(u.email, hash, u.role, Date.now());
  }

  console.log('Seed users created');
}

const tasks = db.prepare('SELECT * FROM tasks').all();

if (!tasks.length) {
  // --- Получаем всех пользователей после вставки ---
  const users = db.prepare('SELECT * FROM users').all();

  // --- Создаем задачи ---
  const insertTask = db.prepare(
    'INSERT INTO tasks (title, description, dueDate, isCompleted, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?)'
  );

  const taskTitles = [
    'Fix bug',
    'Write code',
    'Deploy app',
    'Test API',
    'Update docs',
    'Refactor code',
  ];

  let taskCount = 60; // количество тасок
  for (let i = 1; i <= taskCount; i++) {
    // распределяем задачи равномерно между пользователями (не включая администратора)
    const userIndex = ((i - 1) % (users.length - 1)) + 1; // users[0] = admin, skip
    const user = users[userIndex] as User;

    const title = taskTitles[Math.floor(Math.random() * taskTitles.length)];

    insertTask.run(
      `Task ${title} #${i}`,
      `Description for task ${title} #${i}`,
      Date.now() + Math.floor(Math.random() * 100000000),
      Math.random() > 0.5 ? 1 : 0,
      user.id,
      Date.now()
    );
  }

  console.log('Seed tasks created');
}

export default db;
