import { Router } from 'express';
import {
  getUser,
  getUserById,
} from '../controllers/user.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getUser));
router.get('/:id', asyncHandler(getUserById));

export default router;
