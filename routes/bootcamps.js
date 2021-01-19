import express from "express";
import {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} from "../controllers/bootcamps.js";

import { Bootcamp } from "../models/Bootcamp.js";
import { advancedResults } from "../middleware/advancedResults.js";
import { protect, authorize } from "../middleware/auth.js";

// Include other resource routers
import courseRouter from "./courses.js";

const router = express.Router();

// Re-route to other resource handlers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

export default router;
