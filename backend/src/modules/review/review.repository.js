const Review = require('./review.model');

const deleteMany = (filter) => {
  return Review.deleteMany(filter);
};

module.exports = {
  deleteMany,
};
