import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { getProfile } from "../controllers";

const router = Router();

router.get("/", authenticate, getProfile);

export default router;
