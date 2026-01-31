/**
 * Restaurant Model (MVP-SAFE)
 */

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    // Core Info
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

    // Cuisine & Pricing
    cuisines: {
      type: [String], // e.g. ["North Indian", "Chinese"]
      default: [],
    },

    priceRange: {
      type: String, // ₹ / ₹₹ / ₹₹₹
      enum: ['₹', '₹₹', '₹₹₹'],
      default: '₹₹',
    },

    // Menu (EMBEDDED — SIMPLE)
    menu: [
      {
        name: String,
        category: {
          type: String, // Starter / Main / Dessert
        },
        price: Number,
      },
    ],

    // Nearby Context (NO MAPS)
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

    images: [
      {
        url: String,
      },
    ],

    // Ownership
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Ratings (derived later)
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

module.exports = mongoose.model('Restaurant', restaurantSchema);
