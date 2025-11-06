import { Router } from "express";
import { body } from "express-validator";
import {
  register,
  login,
  refreshToken,
  me,
  updateProfile,
  changePassword,
  logout,
  searchUsers
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/search", protect, searchUsers);

router.post(
  "/register",
  [
    body("name").isString().trim().isLength({ min: 2 }),
    body("email").isEmail().normalizeEmail(),
    body("mobile").optional().matches(/^\+?\d{7,15}$/),
    body("password").isStrongPassword({ minLength: 8 })
  ],
  register
);

router.post(
  "/login",
  [
    body("emailOrMobile").isString().notEmpty(),
    body("password").isString().isLength({ min: 8 })
  ],
  login
);

router.post("/refresh", refreshToken);
router.post("/logout", logout);

router.get("/me", protect, me);
router.patch(
  "/me",
  protect,
  [body("name").optional().isString().isLength({ min: 2 }), body("mobile").optional().matches(/^\+?\d{7,15}$/)],
  updateProfile
);
router.post(
  "/change-password",
  protect,
  [
    body("currentPassword").isString().isLength({ min: 8 }),
    body("newPassword").isStrongPassword({ minLength: 8 })
  ],
  changePassword
);

export default router;
