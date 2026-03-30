import { Router } from 'express';
import { getUser, getUserByEmail } from '../controllers/user.controller';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/', asyncHandler(getUser));
router.post('/', asyncHandler(getUserByEmail));

export default router;
