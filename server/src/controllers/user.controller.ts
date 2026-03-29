import type { Request, Response } from 'express';
import { getUserByEmail } from '../services/user.service';

export async function getUser(req: Request, res: Response) {
  const { email } = req.body;

  const user = getUserByEmail(email);
  res.json(user);
}
