/**
 * Restaurant Routes (MVP)
 */

const express = require('express');
const router = express.Router();

const { verifyToken, authorize } = require('../middleware/auth');
const restaurantController = require('../controllers/restaurantController');

// ====================
// Public Routes
// ====================

// Get all restaurants (city filters)
router.get('/', restaurantController.getAllRestaurants);

// Get restaurant details
router.get('/:id', restaurantController.getRestaurantDetails);

// ====================
// Private Routes
// ====================

// Create restaurant (admin / local)
router.post(
  '/',
  verifyToken,
  authorize('admin', 'local'),
  restaurantController.createRestaurant
);

// Update restaurant (menu, info)
router.put(
  '/:id',
  verifyToken,
  restaurantController.updateRestaurant
);

module.exports = router;
