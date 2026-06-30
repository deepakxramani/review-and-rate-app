const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company is required'],
    },

    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },

    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },

    review: {
      type: String,
      required: [true, 'Review is required'],
      trim: true,
    },

    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: 1,
      max: 5,
    },

    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.index({ company: 1 });

module.exports = mongoose.model('Review', reviewSchema);
