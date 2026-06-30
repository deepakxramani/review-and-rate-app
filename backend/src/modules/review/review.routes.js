const express = require('express');
const router = express.Router({ mergeParams: true });

const validate = require('../../middleware/validate.middleware');

const { createReviewValidation } = require('./review.validation');
const { createReview, getReviews, likeReview } = require('./review.controller');

router.post('/', createReviewValidation, validate, createReview);

router.get('/', getReviews);

router.patch('/:reviewId/like', likeReview);

module.exports = router;
