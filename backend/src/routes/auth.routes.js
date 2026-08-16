import express from "express";
import { login, register } from "../controllers/auth.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

export default router;  