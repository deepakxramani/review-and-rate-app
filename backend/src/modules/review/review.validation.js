const { body } = require('express-validator');

const createReviewValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),

  body('subject').trim().notEmpty().withMessage('Subject is required'),

  body('review').trim().notEmpty().withMessage('Review is required'),

  body('rating')
    .notEmpty()
    .withMessage('Rating is required')
    .isFloat({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
];

module.exports = {
  createReviewValidation,
};
