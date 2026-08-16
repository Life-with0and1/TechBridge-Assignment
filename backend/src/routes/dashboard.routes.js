import express from "express";
import { getSummary, getMonthlySummary, getYearlySummary, getCategorySummary } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { analyticsLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.get("/summary", analyticsLimiter, authenticate, authorize("admin", "user", "read-only"), getSummary);
router.get("/monthly", analyticsLimiter, authenticate, authorize("admin", "user", "read-only"), getMonthlySummary);
router.get("/yearly", analyticsLimiter, authenticate, authorize("admin", "user", "read-only"),getYearlySummary);
router.get("/categories", analyticsLimiter, authenticate,authorize("admin", "user", "read-only"),getCategorySummary);

export default router;