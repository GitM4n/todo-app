import db from '../db/db';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { validateUser } from './user.service';

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await validateUser({ email, password });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  db.prepare('INSERT INTO refresh_tokens (userId, token) VALUES (?, ?)').run(
    user.id,
    refreshToken
  );
  return { accessToken, refreshToken };
}
