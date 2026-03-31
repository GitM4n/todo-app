import bcrypt from 'bcrypt';
import db from '../db/db';
import type { User, UserDto } from '../types';
import { AppError } from '../utils/appError';

export function createUser(payload: Pick<User, 'email' | 'password' | 'role'>) {
  return db
    .prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)')
    .run(payload.email, payload.password, payload.role);
}

export function getUserById(id?: number) {
  const user = db
    .prepare('SELECT id, email, role, createdAt FROM users WHERE id = ?')
    .get(id) as UserDto;
  if (!user) throw new AppError('User not found', 404);
  return user;
}

export async function validateUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email) as User;
  if (!user) throw new AppError('User not found', 404);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new AppError('Invalid password', 401);
  return user;
}
