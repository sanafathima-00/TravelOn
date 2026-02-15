const mongoose = require('mongoose');
console.log("NEW HOTEL MODEL ACTIVE");
const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hotel name is required'],
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Hotel description is required'],
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      index: true,
    },

    // 🔥 Simplified address (matches seed)
    address: {
      type: String,
    },

    pricePerNightMin: {
      type: Number,
      required: true,
      min: 0,
    },

    pricePerNightMax: {
      type: Number,
      required: true,
      min: 0,
    },

    // Simplified images
    images: {
      type: [String],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    nearby: {
      restaurants: {
        type: [String],
        default: [],
      },
      transport: {
        type: [String],
        default: [],
      },
      places: {
        type: [String],
        default: [],
      },
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

module.exports = mongoose.model('Hotel', hotelSchema);
