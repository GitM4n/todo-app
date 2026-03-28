import { NextFunction, Request, Response } from 'express';
import type { User } from '../types';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: User;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = await verifyAccessToken(token);
    req.user = payload as User;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
}
