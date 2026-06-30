const { body } = require('express-validator');

const createCompanyValidation = [
  body('name').trim().notEmpty().withMessage('Company name is required'),

  body('description').trim().notEmpty().withMessage('Description is required'),

  body('location').trim().notEmpty().withMessage('Location is required'),

  body('city').trim().notEmpty().withMessage('City is required'),

  body('foundedOn')
    .notEmpty()
    .withMessage('Founded date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
];

const updateCompanyValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Company name cannot be empty'),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty'),

  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),

  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),

  body('foundedOn').optional().isISO8601().withMessage('Invalid date format'),
];

module.exports = {
  createCompanyValidation,
  updateCompanyValidation,
};
