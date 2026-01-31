/**
 * Hotel Model (MVP-SAFE)
 * Represents hotels listed by city with nearby info and reviews
 */

const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema(
  {
    // Core Info
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

    address: {
      street: String,
      zipCode: String,
    },

    // Pricing
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

    // Media
    images: [
      {
        url: String,
        publicId: String,
      },
    ],

    // Amenities
    amenities: [
      {
        type: String,
        enum: [
          'WiFi',
          'Pool',
          'Gym',
          'Parking',
          'Restaurant',
          'Bar',
          'Spa',
          'Airport Transfer',
          'Pet Friendly',
          'AC',
          'TV',
          'Laundry',
        ],
      },
    ],

    // 🧠 NEARBY INFO (NO MAPS, NO GEO QUERIES)
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

    // Ownership
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Ratings (derived from reviews)
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

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    indexes: [{ city: 1 }],
  }
);

module.exports = mongoose.model('Hotel', hotelSchema);
