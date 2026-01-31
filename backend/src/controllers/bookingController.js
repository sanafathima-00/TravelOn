/**
 * Booking Controller
 */

const Booking = require('../models/Booking');
const Hotel = require('../models/Hotel');
const Room = require('../models/Room');
const stripe = require('../config/stripe');

// @route   POST /api/v1/bookings
// @desc    Create a new booking
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { hotelId, roomId, checkInDate, checkOutDate, numberOfGuests, guestName, guestEmail, guestPhone } = req.body;

    // Validate dates
    const checkin = new Date(checkInDate);
    const checkout = new Date(checkOutDate);
    if (checkout <= checkin) {
      return res.status(400).json({
        success: false,
        message: 'Checkout date must be after check-in date',
      });
    }

    // Get room details
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found',
      });
    }

    // Create booking
    const booking = new Booking({
      userId: req.user.id,
      hotelId,
      roomId,
      checkInDate: checkin,
      checkOutDate: checkout,
      numberOfGuests,
      pricePerNight: room.price,
      guestName,
      guestEmail,
      guestPhone,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/bookings
// @desc    Get user's bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('hotelId', 'name city')
      .populate('roomId', 'roomNumber roomType')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/bookings/:id
// @desc    Get booking details
// @access  Private
exports.getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotelId')
      .populate('roomId')
      .populate('userId', 'firstName lastName email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Check authorization
    if (booking.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/v1/bookings/:id/cancel
// @desc    Cancel a booking
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already cancelled',
      });
    }

    booking.status = 'Cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/v1/bookings/:id/payment
// @desc    Process payment for booking (Stripe)
// @access  Private
exports.processBookingPayment = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(booking.totalPrice * 100), // Amount in cents
      currency: 'usd',
      metadata: {
        bookingId: booking._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: booking.totalPrice,
    });
  } catch (error) {
    next(error);
  }
};
