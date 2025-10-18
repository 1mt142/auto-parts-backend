import express from "express";
import { register, login, logout } from "../controllers/auth";
import { validateRequest } from "../middlewares/validation";
import { registerSchema, loginSchema } from "../validators/auth";
import { authMiddleware } from "../middlewares/auth";

const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/logout", authMiddleware, logout);

export default router;
