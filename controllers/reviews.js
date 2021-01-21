import { Review } from "../models/Review.js";
import { Bootcamp } from "../models/Bootcamp.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import { asyncHandler } from "../middleware/async.js";

// @desc     Get reviews
// @route    GET /api/v1/reviews
// @route    GET /api/v1/bootcamps/:bootcampId/reviews
// @access   Public
export const getReviews = asyncHandler(async (req, res, next) => {
  const { bootcampId } = req.params;

  if (bootcampId) {
    const reviews = await Review.find({ bootcamp: bootcampId });
    console.log(reviews);
    return res
      .status(200)
      .json({ succcess: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc     Get a single review
// @route    GET /api/v1/reviews/:id
// @access   Public
export const getReview = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const review = await Review.findById(id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!review) {
    return next(new ErrorResponse(`Review with id ${id} not found`, 404));
  }
  res.status(200).json({ success: true, data: review });
});
