import crypto from "crypto";

import { User } from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";
import { sendEmail } from "../utils/sendEmail.js";

// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   Public
export const register = asyncHandler(async (req, res, next) => {
  const { name, password, email, role } = req.body;

  const user = await User.create({
    name,
    password,
    email,
    role,
  });

  // Respond with cookie and 200 status code
  sendTokenResponse(user, 200, res);
});

// @desc     Login user
// @route    POST /api/v1/auth/login
// @access   Public
export const login = asyncHandler(async (req, res, next) => {
  const { password, email } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Incorrect password or email", 401));
  }

  // Check if password matches
  const match = await user.matchPassword(password);

  if (!match) {
    return next(new ErrorResponse("Incorrect password or email", 401));
  }

  // Respond with cookie and 200 status code
  sendTokenResponse(user, 200, res);
});

// @desc     Get currently logged in  user
// @route    Get /api/v1/auth/me
// @access   Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});

// @desc     Update user details
// @route    PUT /api/v1/auth/updatedetails
// @access   Private
export const updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

// @desc     Forgot password
// @route    POST /api/v1/auth/forgotpassword
// @access   Public
export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you  (or someone else) has requested a password reset. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log("Password reset failed:", err);

    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc     Reset password
// @route    PUT /api/v1/auth/resetpassword/:resettoken
// @access   Public
export const resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid Token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc     Update password
// @route    PUT /api/v1/auth/updatepassword
// @access   Private
export const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token, generate cookie, and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create JWT Token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
