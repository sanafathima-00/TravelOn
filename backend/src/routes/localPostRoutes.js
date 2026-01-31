/**
 * Local Post Routes (MVP)
 */

const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/auth');
const localPostController = require('../controllers/localPostController');

// ====================
// Public Routes
// ====================

// Get all local posts (city-based)
router.get('/', localPostController.getLocalPosts);

// Get single post details
router.get('/:id', localPostController.getPostDetails);

// ====================
// Private Routes
// ====================

// Create local post (locals only)
router.post(
  '/',
  verifyToken,
  localPostController.createLocalPost
);

// Upvote a post
router.post(
  '/:id/upvote',
  verifyToken,
  localPostController.upvotePost
);

module.exports = router;
