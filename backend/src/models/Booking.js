/**
 * Booking Model
 * Represents hotel bookings
 */

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    hotelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
      required: true,
      index: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    numberOfNights: {
      type: Number,
      required: true,
    },
    numberOfGuests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Paid', 'Refunded'],
      default: 'Unpaid',
    },
    paymentId: String, // Stripe payment ID
    specialRequests: String,
    guestName: String,
    guestEmail: String,
    guestPhone: String,
    cancellationReason: String,
    cancelledAt: Date,
  },
  {
    timestamps: true,
  }
);

// Calculate number of nights
bookingSchema.pre('save', function (next) {
  if (this.checkInDate && this.checkOutDate) {
    const timeDiff = Math.abs(this.checkOutDate - this.checkInDate);
    this.numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    this.totalPrice = this.numberOfNights * this.pricePerNight;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
