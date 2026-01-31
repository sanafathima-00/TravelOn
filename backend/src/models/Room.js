/**
 * Room Model
 * Represents rooms within a hotel
 */

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Penthouse'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    capacity: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },
    amenities: [String], // Room-specific amenities
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    description: String,
    bedCount: {
      type: Number,
      required: true,
    },
    bedType: {
      type: String,
      enum: ['Single', 'Double', 'Queen', 'King', 'Twin'],
    },
    // Availability
    availability: [
      {
        date: Date,
        available: Boolean,
      },
    ],
    // Blocked dates (for maintenance, etc)
    blockedDates: [Date],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Room', roomSchema);
