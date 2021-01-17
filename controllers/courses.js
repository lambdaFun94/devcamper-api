import { Course } from "../models/Course.js";
import { Bootcamp } from "../models/Bootcamp.js";
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

// @desc     Get a single course
// @route    GET /api/v1/courses/:id
// @access   Public
export const getCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    const msg = `Course not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Create a new course
// @route    POST /api/v1/bootcamps/:bootcampId/courses
// @access   Private
export const addCourse = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;
  req.body.bootcamp = bootcampId;
  const bootcamp = await Bootcamp.findById(bootcampId);

  if (!bootcamp) {
    const msg = `Bootcamp not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Update course
// @route    PUT /api/v1/courses/:id
// @access   Private
export const updateCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    const msg = `Course not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc     Delete course
// @route    DELETE /api/v1/courses/:id
// @access   Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const course = await Course.findById(id);

  if (!course) {
    const msg = `Course not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
