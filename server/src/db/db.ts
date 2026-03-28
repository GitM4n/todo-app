import bcrypt from 'bcrypt';
import Database from 'better-sqlite3';

const db = new Database('./database.sqlite');

db.pragma('foreign_keys = ON');

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
    createdBy INTEGER,
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

const users = db.prepare('SELECT * FROM users').all();

if (users.length === 0) {
  const hash = bcrypt.hashSync('123456', 10);

  const insert = db.prepare(
    'INSERT INTO users (email, password, role, createdAt) VALUES (?, ?, ?, ?)'
  );

  insert.run('user1@test.com', hash, 'user', Date.now());
  insert.run('user2@test.com', hash, 'user', Date.now());
  insert.run('admin@test.com', hash, 'admin', Date.now());

  console.log('Seed users created');
}

export default db;
