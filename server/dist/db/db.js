'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.initDB = void 0;
const sqlite3_1 = __importDefault(require('sqlite3'));
const sqlite_1 = require('sqlite');
const bcrypt_1 = __importDefault(require('bcrypt'));
const initDB = async () => {
  const db = await (0, sqlite_1.open)({
    filename: './database.sqlite',
    driver: sqlite3_1.default.Database,
  });
  // users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user'
    );
  `);
  // tasks
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      dueDate TEXT,
      isCompleted INTEGER DEFAULT 0,
      createdBy INTEGER
    );
  `);
  // 🔥 seed users
  const users = await db.all('SELECT * FROM users');
  if (users.length === 0) {
    const hash = await bcrypt_1.default.hash('123456', 10);
    await db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      'user1@test.com',
      hash,
      'user'
    );
    await db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      'user2@test.com',
      hash,
      'user'
    );
    await db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      'admin@test.com',
      hash,
      'admin'
    );
    console.log('✅ Seed users created');
  }
  return db;
};
exports.initDB = initDB;
