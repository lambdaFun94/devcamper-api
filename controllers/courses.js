import { Course } from "../models/Course.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";

// @desc     Get all courses
// @route    GET /api/vi/courses
// @route    GET /api/vi/bootcamps/:bootcampId/courses
// @access   Public
export const getCourses = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  let query;
  if (bootcampId) {
    query = Course.find({ bootcamp: bootcampId });
  } else {
    query = Course.find().populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const courses = await query;

  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});
