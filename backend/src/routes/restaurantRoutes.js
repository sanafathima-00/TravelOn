/**
 * Restaurant Routes
 */

const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const restaurantController = require('../controllers/restaurantController');

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/nearby', restaurantController.getNearbyRestaurants);
router.get('/:id', restaurantController.getRestaurantDetails);

// Private routes
router.post('/', verifyToken, authorize('admin', 'local'), restaurantController.createRestaurant);
router.post('/:id/menu', verifyToken, restaurantController.addFoodItem);

module.exports = router;
