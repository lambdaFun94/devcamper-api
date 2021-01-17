import path from "path";
import { Bootcamp } from "../models/Bootcamp.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";
import { geocoder } from "../utils/geocoder.js";

// @desc     Get all Bootcamps
// @route    GET /api/v1/bootcamps
// @access   Public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc     Get a single Bootcamp
// @route    GET /api/v1/bootcamps/:id
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
// @route    POST /api/v1/bootcamps
// @access   Private
export const createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

// @desc     Update bootcamp
// @route    PUT /api/v1/bootcamps/:id
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
// @route    DELETE /api/v1/bootcamps/:id
// @access   Private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const msg = `Bootcamp not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});

// @desc     Get bootcamps within a radius
// @route    GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access   Private
export const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});

// @desc     Upload photo for bootcamp
// @route    PUT /api/v1/bootcamps/:id/phot
// @access   Private
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const bootcamp = await Bootcamp.findById(id);

  if (!bootcamp) {
    const msg = `Bootcamp not found with id ${id}`;
    return next(new ErrorResponse(msg, 404));
  }

  if (!req.files) {
    const msg = `Please upload a file`;
    return next(new ErrorResponse(msg, 400));
  }

  const { file } = req.files;

  // Make sure upload is an image
  if (!file.mimetype.startsWith("image")) {
    const msg = `Please upload an image file`;
    return next(new ErrorResponse(msg, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    const msg = `Please upload an image less than ${
      process.env.MAX_FILE_UPLOAD / 1000000
    } mb`;
    return next(new ErrorResponse(msg, 400));
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  // Save file
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }
    await Bootcamp.findByIdAndUpdate(id, { photo: file.name });
  });
  res.status(200).json({
    success: true,
    date: file.name,
  });
});
