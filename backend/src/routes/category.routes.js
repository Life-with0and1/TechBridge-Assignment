import express from "express";
import { getCategories, createCategory } from "../controllers/category.controller.js";
import { authorize } from "../middleware/role.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getCategories);
router.post("/",authenticate,authorize("admin"),createCategory);

export default router;