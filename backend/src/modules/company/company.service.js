const companyRepository = require('./company.repository');
const reviewRepository = require('../review/review.repository');
const ApiError = require('../../utils/ApiError');
const mongoose = require('mongoose');
const fs = require('fs/promises');
const path = require('path');
const { Types } = require('mongoose');

const createCompany = async (data, file) => {
  const existingCompany = await companyRepository.findOne({
    name: data.name,
  });

  if (existingCompany) {
    throw new ApiError(409, 'Company already exists');
  }

  const company = await companyRepository.create({
    ...data,
    logo: file ? `/uploads/${file.filename}` : '',
  });

  return company;
};

const getCompanies = async (query) => {
  const {
    page = 1,
    limit = 10,
    search,
    city,
    sortBy = 'createdAt',
    order = 'desc',
  } = query;

  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: 'i',
    };
  }

  if (city) {
    filter.city = city;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const sort = {
    [sortBy]: order === 'asc' ? 1 : -1,
  };

  const [companies, total] = await Promise.all([
    companyRepository.find(filter, {
      skip,
      limit: Number(limit),
      sort,
    }),
    companyRepository.countDocuments(filter),
  ]);

  return {
    companies,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getCompanyById = async (companyId) => {
  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new ApiError(400, 'Invalid company id');
  }

  const company = await companyRepository.findById(companyId);

  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  return company;
};

const updateCompany = async (companyId, data, file) => {
  if (!Types.ObjectId.isValid(companyId)) {
    throw new ApiError(400, 'Invalid company id');
  }

  const company = await companyRepository.findById(companyId);

  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  if (file) {
    // Delete old logo
    if (company.logo) {
      const oldLogoPath = path.join(
        process.cwd(),
        'public',
        company.logo.replace('/uploads/', 'uploads/'),
      );

      if (fs.existsSync(oldLogoPath)) {
        fs.unlink(oldLogoPath);
      }
    }

    data.logo = `/uploads/${file.filename}`;
  }

  return await companyRepository.updateById(companyId, data);
};

const deleteCompany = async (companyId) => {
  // Validate ObjectId
  if (!Types.ObjectId.isValid(companyId)) {
    throw new ApiError(400, 'Invalid company id');
  }

  // Find company
  const company = await companyRepository.findById(companyId);

  if (!company) {
    throw new ApiError(404, 'Company not found');
  }

  // Delete logo if exists
  if (company.logo) {
    const logoPath = path.join(
      process.cwd(),
      'public',
      company.logo.replace('/uploads/', 'uploads/'),
    );

    if (fs.existsSync(logoPath)) {
      fs.unlink(logoPath);
    }
  }

  // Delete all reviews
  await reviewRepository.deleteMany({
    company: companyId,
  });

  // Delete company
  await companyRepository.deleteById(companyId);

  return;
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
