import { asyncHandler } from "../middleware/async.js";
import { User } from "../models/User.js";

// @desc     Get all users
// @route    GET /api/v1/users
// @access   Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc     Get single users
// @route    GET /api/v1/users/:id
// @access   Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  res.status(200).json({ success: true, data: user });
});

// @desc     Create user
// @route    POST /api/v1/users
// @access   Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

// @desc     Update user
// @route    PUT /api/v1/users/:id
// @access   Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

// @desc     Delete user
// @route    DELETE /api/v1/users/:id
// @access   Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.status(200).json({ success: true, data: {} });
});
