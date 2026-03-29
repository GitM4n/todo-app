import bcrypt from 'bcrypt';
import db from '../db/db';
import type { User } from '../types';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { getUserByEmail } from './user.service';
import { AppError } from '../utils/appError';

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user: User | null = getUserByEmail(email);
  if (!user) throw new AppError('User not found', 404);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new AppError('Invalid password', 401);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  db.prepare('INSERT INTO refresh_tokens (userId, token) VALUES (?, ?)').run(
    user.id,
    refreshToken
  );
  return { accessToken, refreshToken };
}
