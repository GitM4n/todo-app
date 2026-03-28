import db from '../db/db';
import type { User } from '../types';

export function createUser(payload: Pick<User, 'email' | 'password' | 'role'>) {
  return db
    .prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)')
    .run(payload.email, payload.password, payload.role);
}

export function getAllUsers() {
  const users = db.prepare('SELECT * FROM users').all() as User[];
  return users;
}

export function getUserByEmail(email: string) {
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email) as User;

  if (!user) return null;
  return user;
}
