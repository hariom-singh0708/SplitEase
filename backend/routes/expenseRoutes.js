import { Router } from "express";
import { body, param } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import { addExpense, listGroupExpenses, deleteExpense } from "../controllers/expenseController.js";

const router = Router();
router.use(protect);

router.post(
  "/",
  [
    body("groupId").isString().notEmpty(),
    body("description").optional().isString().isLength({ max: 240 }),
    body("amount").isFloat({ gt: 0 }),
    body("paidBy").isString().notEmpty(),
    body("participants").optional().isArray()
  ],
  addExpense
);

router.get("/:groupId", [param("groupId").isString().notEmpty()], listGroupExpenses);
router.delete("/:id", deleteExpense);

export default router;
