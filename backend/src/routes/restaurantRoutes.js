const express = require('express');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const {
  createRestaurantSchema,
  addMenuItemSchema,
  queryRestaurantSchema,
  nearbyRestaurantSchema
} = require('../validators/restaurantValidator');
const {
  getRestaurants,
  getRestaurantById,
  getNearbyRestaurants,
  createRestaurant,
  addMenuItem
} = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', validate(queryRestaurantSchema, { source: 'query' }), getRestaurants);
router.get('/nearby', validate(nearbyRestaurantSchema, { source: 'query' }), getNearbyRestaurants);
router.get('/:id', getRestaurantById);

router.post('/', protect, authorize('admin', 'local'), validate(createRestaurantSchema), createRestaurant);
router.post('/:id/menu', protect, validate(addMenuItemSchema), addMenuItem);

module.exports = router;
