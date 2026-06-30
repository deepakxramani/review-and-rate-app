const asyncHandler = require('../../utils/asyncHandler');
const ApiResponse = require('../../utils/apiResponse');
const companyService = require('./company.service');

const createCompany = asyncHandler(async (req, res) => {
  const company = await companyService.createCompany(req.body, req.file);

  return res
    .status(201)
    .json(new ApiResponse(201, company, 'Company added successfully!'));
});

const getCompanies = asyncHandler(async (req, res) => {
  const result = await companyService.getCompanies(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, result, 'Companies fetched successfully!'));
});

const getCompanyById = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const company = await companyService.getCompanyById(companyId);

  return res
    .status(200)
    .json(new ApiResponse(200, company, 'Company fetched successfully!'));
});

const updateCompany = asyncHandler(async (req, res) => {
  const company = await companyService.updateCompany(
    req.params.companyId,
    req.body,
    req.file,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, company, 'Company updated successfully!'));
});

const deleteCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  await companyService.deleteCompany(companyId);

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Company deleted successfully'));
});

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
