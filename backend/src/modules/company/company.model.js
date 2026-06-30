const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },

    logo: {
      type: String,
      required: [true, 'Company logo is required'],
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },

    foundedOn: {
      type: Date,
      required: [true, 'Founded date is required'],
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

companySchema.index({
  name: 'text',
  city: 'text',
});

module.exports = mongoose.model('Company', companySchema);
