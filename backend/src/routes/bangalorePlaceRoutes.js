const express = require('express');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { createReviewSchema } = require('../validators/reviewValidator');
const { queryBangalorePlaceSchema } = require('../validators/bangalorePlaceValidator');
const {
  getPlaces,
  getPlaceById,
  addReview
} = require('../controllers/bangalorePlaceController');

const router = express.Router();

router.get('/', validate(queryBangalorePlaceSchema, { source: 'query' }), getPlaces);
router.get('/:id', getPlaceById);
router.post('/:id/review', protect, validate(createReviewSchema), addReview);

module.exports = router;

