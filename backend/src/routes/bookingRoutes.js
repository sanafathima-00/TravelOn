/**
 * Booking Routes
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const { bookingSchema } = require('../validators/schemas');
const bookingController = require('../controllers/bookingController');

// All booking routes require authentication
router.post('/', verifyToken, validateRequest(bookingSchema), bookingController.createBooking);
router.get('/', verifyToken, bookingController.getUserBookings);
router.get('/:id', verifyToken, bookingController.getBookingDetails);
router.put('/:id/cancel', verifyToken, bookingController.cancelBooking);
router.post('/:id/payment', verifyToken, bookingController.processBookingPayment);

module.exports = router;
