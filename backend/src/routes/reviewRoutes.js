/**
 * Review Routes
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const { reviewSchema } = require('../validators/schemas');
const reviewController = require('../controllers/reviewController');

// Public routes
router.get('/:entityType/:entityId', reviewController.getReviews);

// Private routes
router.post('/', verifyToken, validateRequest(reviewSchema), reviewController.createReview);
router.post('/:id/upvote', verifyToken, reviewController.upvoteReview);
router.post('/:id/downvote', verifyToken, reviewController.downvoteReview);

module.exports = router;
