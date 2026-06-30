const Company = require('./company.model');

const create = (payload) => Company.create(payload);

const findOne = (filter) => Company.findOne(filter);

const findById = (companyId) => Company.findById(companyId);

const find = (filter = {}, options = {}) => {
  return Company.find(filter)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit);
};

const updateById = (companyId, payload) => {
  return Company.findByIdAndUpdate(companyId, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteById = (companyId) => {
  return Company.findByIdAndDelete(companyId);
};

const countDocuments = (filter = {}) => {
  return Company.countDocuments(filter);
};

module.exports = {
  create,
  findOne,
  findById,
  find,
  countDocuments,
  updateById,
  deleteById,
};
