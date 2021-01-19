import { User } from "../models/User.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";

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

// @desc     Get currently logged in  user
// @route    Get /api/v1/auth/me
// @access   Private
export const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({ success: true, data: user });
});
