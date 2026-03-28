import { sign, verify } from 'jsonwebtoken';
import type { User } from '../types';

const generateAccessToken = (payload: User) => {
  return sign(payload, process.env.JWT_SECRET_ACCESS_STRING as string, {
    expiresIn: '7d',
  });
};

const verifyAccessToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET_ACCESS_STRING as string);
};

const generateRefreshToken = (payload: User) => {
  return sign(payload, process.env.JWT_SECRET_REFRESH_STRING as string, {
    expiresIn: '24h',
  });
};
const verifyRefreshToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET_REFRESH_STRING as string);
};

export {
  generateAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
};
