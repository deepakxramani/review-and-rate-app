const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');

const reviewService = require('./review.service');

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(
    req.params.companyId,
    req.body,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, review, 'Review added successfully!'));
});

const getReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getReviews(
    req.params.companyId,
    req.query,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Reviews fetched successfully!'));
});

const likeReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await reviewService.likeReview(reviewId);

  return res
    .status(200)
    .json(new ApiResponse(200, review, 'Review liked successfully!'));
});

module.exports = {
  createReview,
  getReviews,
  likeReview,
};
