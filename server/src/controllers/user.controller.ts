import type { Response } from 'express';
import type { AuthRequest } from '../middleware/auth.middleware';
import { getUserById as getUserByIdService } from '../services/user.service';

export async function getUser(req: AuthRequest, res: Response) {
  const user = getUserByIdService(req.user?.id);
  res.json(user);
}

export async function getUserById(req: AuthRequest, res: Response) {
  const { id } = req.params;

  const user = getUserByIdService(id);
  res.json(user);
}
