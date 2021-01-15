import { Bootcamp } from "../models/Bootcamp.js";

// @desc     Get all Bootcamps
// @route    GET /api/vi/bootcamps
// @access   Public
export const getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

// @desc     Get a single Bootcamp
// @route    GET /api/vi/bootcamps/:id
// @access   Public
export const getBootcamp = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bootcamp = await Bootcamp.findById(id);
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc     Create a new bootcamp
// @route    POST /api/vi/bootcamps
// @access   Private
export const createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

// @desc     Update bootcamp
// @route    PUT /api/vi/bootcamps/:id
// @access   Private
export const updateBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};

// @desc     Delete bootcamp
// @route    DELETE /api/vi/bootcamps/:id
// @access   Private
export const deleteBootcamp = async (req, res, next) => {
  const { id } = req.params;
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(id);

    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (e) {
    res.status(400).json({ success: false });
  }
};
