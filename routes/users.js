import express from "express";
import {
  getUser,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../controllers/users.js";
import { User } from "../models/User.js";
import { advancedResults } from "../middleware/advancedResults.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
