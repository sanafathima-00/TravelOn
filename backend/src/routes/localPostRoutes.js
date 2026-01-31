/**
 * Local Post Routes
 */

const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const { localPostSchema } = require('../validators/schemas');
const localPostController = require('../controllers/localPostController');

// Public routes
router.get('/', localPostController.getLocalPosts);
router.get('/:id', localPostController.getPostDetails);

// Private routes
router.post('/', verifyToken, validateRequest(localPostSchema), localPostController.createLocalPost);
router.post('/:id/upvote', verifyToken, localPostController.upvotePost);
router.post('/:id/comment', verifyToken, localPostController.addComment);

module.exports = router;
