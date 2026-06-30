const express = require('express');

const router = express.Router();

const companyRoutes = require('../../modules/company/company.routes');
const reviewRoutes = require('../../modules/review/review.routes');

router.use('/companies', companyRoutes);
// router.use('/reviews', reviewRoutes);

module.exports = router;
