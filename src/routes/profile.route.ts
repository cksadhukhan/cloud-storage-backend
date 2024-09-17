import { Router } from "express";
import { authenticate } from "../middlewares";
import { getProfile } from "../controllers";

const router = Router();

router.get("/", authenticate, getProfile);

export default router;
