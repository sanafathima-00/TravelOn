/**
 * Hotel Routes (MVP)
 */

const express = require('express');
const router = express.Router();

const { verifyToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const { hotelSchema } = require('../validators/schemas');
const hotelController = require('../controllers/hotelController');

// ====================
// Public Routes
// ====================

// Get all hotels (city, rating, price filters)
router.get('/', hotelController.getAllHotels);

// Get single hotel details
router.get('/:id', hotelController.getHotelDetails);

// ====================
// Private Routes
// ====================

// Create hotel (admin / local)
router.post(
  '/',
  verifyToken,
  authorize('admin', 'local'),
  validateRequest(hotelSchema),
  hotelController.createHotel
);

// Update hotel (owner / admin)
router.put(
  '/:id',
  verifyToken,
  hotelController.updateHotel
);

module.exports = router;
