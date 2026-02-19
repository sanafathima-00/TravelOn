const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    comment: { type: String, required: true, minlength: 20 }
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const bangalorePlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['worship', 'eatery', 'interest', 'shopping']
    },
    location: { type: String, required: true, trim: true },
    city: {
      type: String,
      required: true,
      default: 'Bangalore',
      index: true
    },
    reviews: [reviewSchema],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('BangalorePlace', bangalorePlaceSchema);

