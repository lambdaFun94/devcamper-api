import { Bootcamp } from "../models/Bootcamp.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";

// @desc     Get all Bootcamps
// @route    GET /api/vi/bootcamps
// @access   Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});

// @desc     Get a single Bootcamp
// @route    GET /api/vi/bootcamps/:id
// @access   Public
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    const msg = `Bootcamp not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }

  res.status(200).json({ success: true, data: bootcamp });
});

// @desc     Create a new bootcamp
// @route    POST /api/vi/bootcamps
// @access   Private
export const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc     Update bootcamp
// @route    PUT /api/vi/bootcamps/:id
// @access   Private
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!bootcamp) {
    const msg = `Bootcamp not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }
  res.status(200).json({ success: true, data: bootcamp });
});

// @desc     Delete bootcamp
// @route    DELETE /api/vi/bootcamps/:id
// @access   Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findByIdAndDelete(id);

  if (!bootcamp) {
    const msg = `Bootcamp not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }
  res.status(200).json({ success: true, data: {} });
});
