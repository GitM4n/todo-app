import bcrypt from 'bcrypt';
import db from '../db/db';
import type { User } from '../types';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { getUserByEmail } from './user.service';

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user: User | null = getUserByEmail(email);
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid password');

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  db.prepare('INSERT INTO refresh_tokens (userId, token) VALUES (?, ?)').run(
    user.id,
    refreshToken
  );
  return { accessToken, refreshToken };
}
