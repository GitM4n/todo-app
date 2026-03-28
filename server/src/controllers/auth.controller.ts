import type { Request, Response } from 'express';
import { login as loginService } from '../services/auth.service';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const tokens = await loginService({ email, password });

    res.json(tokens);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
}
