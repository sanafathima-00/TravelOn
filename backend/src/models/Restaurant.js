/**
 * Restaurant Model
 */

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Restaurant name is required'],
      trim: true,
    },
    description: String,
    city: {
      type: String,
      required: true,
      index: true,
    },
    address: {
      street: String,
      zipCode: String,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
    },
    cuisines: [String], // ['Italian', 'Chinese', 'Indian', etc]
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    menu: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
      },
    ],
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
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    deliveryTime: {
      type: Number,
      default: 30, // minutes
    },
    minimumOrderValue: {
      type: Number,
      default: 0,
    },
    deliveryRadius: {
      type: Number,
      default: 5, // km
    },
    acceptOrders: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    indexes: [{ location: '2dsphere' }, { city: 1 }],
  }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);
