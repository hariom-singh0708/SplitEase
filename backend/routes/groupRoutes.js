import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../middleware/authMiddleware.js";
import {
  createGroup,
  myGroups,
  groupDetails,
  addMembers,
  removeMember,
  groupSettlement,
  deleteGroup
} from "../controllers/groupController.js";

const router = Router();
router.use(protect);

router.post(
  "/",
  [body("name").isString().isLength({ min: 2 }), body("membersIdentifiers").isArray({ min: 0 })],
  createGroup
);

router.get("/", myGroups);
router.get("/:id", groupDetails);
router.route("/:groupId").delete(protect, deleteGroup);
router.post(
  "/:id/members",
  [body("membersIdentifiers").isArray({ min: 1 })],
  addMembers
);

router.delete(
  "/:id/members",
  [body("userId").isString().notEmpty()],
  removeMember
);

router.get("/:id/settlement", groupSettlement);

export default router;
