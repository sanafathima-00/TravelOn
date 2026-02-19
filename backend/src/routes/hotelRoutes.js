const express = require('express');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');

const {
  createHotelSchema,
  updateHotelSchema,
  queryHotelSchema,
  nearbySchema
} = require('../validators/hotelValidator');

const {
  getHotels,
  getHotelById,
  getNearbyHotels,
  createHotel,
  updateHotel,
  getHotelReviews,
  createHotelReview
} = require('../controllers/hotelController');

const { createReviewSchema } = require('../validators/reviewValidator');

const router = express.Router();

/* ============================= */
/* HOTELS */
/* ============================= */

router.get('/', validate(queryHotelSchema, { source: 'query' }), getHotels);
router.get('/nearby', validate(nearbySchema, { source: 'query' }), getNearbyHotels);
router.get('/:id', getHotelById);

/* ============================= */
/* HOTEL REVIEWS */
/* ============================= */

router.get('/:id/reviews', getHotelReviews);
router.post(
  '/:id/reviews',
  protect,
  validate(createReviewSchema),
  createHotelReview
);

/* ============================= */
/* ADMIN / OWNER */
/* ============================= */

router.post(
  '/',
  protect,
  authorize('admin', 'local'),
  validate(createHotelSchema),
  createHotel
);

router.put(
  '/:id',
  protect,
  validate(updateHotelSchema),
  updateHotel
);

module.exports = router;
