const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String
    },
    comment: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true,
      index: true
    },

    address: String,

    pricePerNightMin: {
      type: Number,
      required: true
    },

    pricePerNightMax: {
      type: Number,
      required: true
    },

    images: {
      type: [String],
      default: []
    },

    amenities: {
      type: [String],
      default: []
    },

    nearby: {
      restaurants: { type: [String], default: [] },
      transport: { type: [String], default: [] },
      places: { type: [String], default: [] }
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    reviews: [reviewSchema],

    rating: {
      type: Number,
      default: 0
    },

    reviewCount: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Hotel', hotelSchema);
