const Review = require('./review.model');

const create = (payload) => Review.create(payload);

const find = (filter = {}, options = {}) => {
  return Review.find(filter)
    .sort(options.sort)
    .skip(options.skip)
    .limit(options.limit);
};

const findById = (reviewId) => Review.findById(reviewId);

const updateById = (reviewId, payload) => {
  return Review.findByIdAndUpdate(reviewId, payload, {
    new: true,
    runValidators: true,
  });
};

const deleteById = (reviewId) => {
  return Review.findByIdAndDelete(reviewId);
};

const deleteMany = (filter) => {
  return Review.deleteMany(filter);
};

const aggregate = (pipeline) => {
  return Review.aggregate(pipeline);
};

const incrementLike = (reviewId) => {
  return Review.findByIdAndUpdate(
    reviewId,
    {
      $inc: {
        likes: 1,
      },
    },
    {
      new: true,
    },
  );
};

module.exports = {
  create,
  find,
  findById,
  updateById,
  deleteById,
  deleteMany,
  aggregate,
  incrementLike,
};
