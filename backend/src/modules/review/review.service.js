const mongoose = require('mongoose');

const ApiError = require('../../utils/ApiError');

const companyRepository = require('../company/company.repository');
const reviewRepository = require('./review.repository');

const createReview = async (companyId, data) => {
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new ApiError(400, 'Invalid company id');
  }

  const company = await companyRepository.findById(companyId);

  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  const review = await reviewRepository.create({
    ...data,
    company: companyId,
  });

  await updateCompanyRating(companyId);

  return review;
};

const updateCompanyRating = async (companyId) => {
  const result = await reviewRepository.aggregate([
    {
      $match: {
        company: new mongoose.Types.ObjectId(companyId),
      },
    },
    {
      $group: {
        _id: '$company',
        averageRating: {
          $avg: '$rating',
        },
        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  const averageRating =
    result.length > 0 ? Number(result[0].averageRating.toFixed(1)) : 0;

  const totalReviews = result.length > 0 ? result[0].totalReviews : 0;

  await companyRepository.updateById(companyId, {
    averageRating,
    totalReviews,
  });
};

const getReviews = async (companyId, query) => {
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new ApiError(400, 'Invalid company id');
  }

  const company = await companyRepository.findById(companyId);

  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = query;

  const skip = (Number(page) - 1) * Number(limit);

  const sort = {
    [sortBy]: order === 'asc' ? 1 : -1,
  };

  const reviews = await reviewRepository.find(
    { company: companyId },
    {
      skip,
      limit: Number(limit),
      sort,
    },
  );

  return {
    company,
    reviews,
  };
};

const likeReview = async (reviewId) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new ApiError(400, 'Invalid review id');
  }

  const review = await reviewRepository.incrementLike(reviewId);

  if (!review) {
    throw new ApiError(404, 'Review not found');
  }

  return review;
};

module.exports = {
  createReview,
  getReviews,
  updateCompanyRating,
  likeReview,
};
