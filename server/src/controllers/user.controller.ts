import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import { getUserByEmail as getUserByEmailService } from '../services/user.service';

export async function getUser(req: AuthRequest, res: Response) {
  console.log(req.user);
  const user = getUserByEmailService(req.user?.email);
  res.json(user);
}

export async function getUserByEmail(req: AuthRequest, res: Response) {
  const { email } = req.body;

  const user = getUserByEmailService(email);
  res.json(user);
}
