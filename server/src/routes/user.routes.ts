import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/user", asyncHandler(getUser));

export default router;