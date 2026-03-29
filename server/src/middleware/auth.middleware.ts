import { NextFunction, Request, Response } from 'express';
import type { User } from '../types';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../utils/appError';

export interface AuthRequest<
  Params = any,
  Body = any,
  Query = {}
> extends Request<Params, any, Body, Query> {
  user?: User;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(' ')[1];
   if (!token) throw new AppError('Unauthorized', 401);


    const payload = verifyAccessToken(token);
    req.user = payload as User;
    next();
  
}
