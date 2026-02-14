const express = require('express');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/authorize');
const { createLocalPostSchema, queryLocalPostSchema } = require('../validators/localPostValidator');
const {
  getLocalPosts,
  getLocalPostById,
  createLocalPost,
  upvotePost
} = require('../controllers/localPostController');

const router = express.Router();

router.get('/', validate(queryLocalPostSchema, { source: 'query' }), getLocalPosts);
router.get('/:id', getLocalPostById);

router.post('/', protect, authorize('local'), validate(createLocalPostSchema), createLocalPost);
router.post('/:id/upvote', protect, upvotePost);

module.exports = router;
