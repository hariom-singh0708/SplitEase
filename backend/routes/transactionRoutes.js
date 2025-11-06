import { Router } from "express";
import { body, query } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import {
  createTransaction,
  listTransactions,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";

const router = Router();
router.use(protect);

router.get(
  "/",
  [
    query("type").optional().isIn(["TAKE", "GIVE"]),
    query("status").optional().isIn(["PENDING", "PAID"]),
    query("q").optional().isString()
  ],
  listTransactions
);

router.post(
  "/",
  [
    body("counterpartyName").isString().trim().isLength({ min: 1 }),
    body("amount").isFloat({ gt: 0 }),
    body("type").isIn(["TAKE", "GIVE"]),
    body("status").optional().isIn(["PENDING", "PAID"]),
    body("date").optional().isISO8601().toDate(),
    body("note").optional().isString().isLength({ max: 500 })
  ],
  createTransaction
);

router.patch(
  "/:id",
  [
    body("counterpartyName").optional().isString(),
    body("amount").optional().isFloat({ gt: 0 }),
    body("type").optional().isIn(["TAKE", "GIVE"]),
    body("status").optional().isIn(["PENDING", "PAID"]),
    body("date").optional().isISO8601().toDate(),
    body("note").optional().isString().isLength({ max: 500 })
  ],
  updateTransaction
);

router.delete("/:id", deleteTransaction);

export default router;
