const express = require('express');

const router = express.Router();

const upload = require('../../middleware/upload.middleware');
const validate = require('../../middleware/validate.middleware');

const {
  createCompanyValidation,
  updateCompanyValidation,
} = require('./company.validation');

const {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} = require('./company.controller');

router.post(
  '/',
  upload.single('logo'),
  createCompanyValidation,
  validate,
  createCompany,
);

router.get('/', getCompanies);

router.get('/:companyId', getCompanyById);

router.put(
  '/:companyId',
  upload.single('logo'),
  updateCompanyValidation,
  validate,
  updateCompany,
);

router.delete('/:companyId', deleteCompany);

module.exports = router;
