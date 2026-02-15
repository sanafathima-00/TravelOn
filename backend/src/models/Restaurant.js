const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },

    description: {
      type: String,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    cuisines: {
      type: [String],
      default: [],
    },

    priceRange: {
      type: String,
      enum: ['₹', '₹₹', '₹₹₹'],
      default: '₹₹',
    },

    menu: [
      {
        name: String,
        category: String,
        price: Number,
      },
    ],

    nearby: {
      places: {
        type: [String],
        default: [],
      },
      transport: {
        type: [String],
        default: [],
      },
    },

    images: {
      type: [String],
      default: [],
    },

    // 🔥 Owner NOT required anymore
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
