import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } from "../controllers/transaction.controller.js";
import { transactionLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/",transactionLimiter,authenticate,authorize("admin", "user"),createTransaction);
router.get("/",transactionLimiter,authenticate,authorize("admin", "user", "read-only"),getTransactions);
router.get("/:id",transactionLimiter,authenticate,authorize("admin", "user", "read-only"),getTransactionById);
router.put("/:id",transactionLimiter,authenticate,authorize("admin", "user"),updateTransaction);
router.delete("/:id",transactionLimiter,authenticate,authorize("admin", "user"),deleteTransaction);

export default router;