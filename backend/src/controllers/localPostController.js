/**
 * Local Post Controller (MVP)
 */

const LocalPost = require('../models/LocalPost');

// ==============================
// CREATE LOCAL POST
// ==============================
// @route   POST /api/v1/local-posts
// @desc    Create a local post
// @access  Private (Local users only)
exports.createLocalPost = async (req, res, next) => {
  try {
    if (req.user.role !== 'local') {
      return res.status(403).json({
        success: false,
        message: 'Only locals can create posts',
      });
    }

    const { city, postType, title, content, tags } = req.body;

    if (!city || !postType || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const post = new LocalPost({
      author: req.user.id,
      city,
      postType,
      title,
      content,
      tags: tags || [],
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Local post created successfully',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET LOCAL POSTS (CITY BASED)
// ==============================
// @route   GET /api/v1/local-posts
// @desc    Get local posts by city
// @access  Public
exports.getLocalPosts = async (req, res, next) => {
  try {
    const { city, postType } = req.query;

    const filter = { isActive: true };

    if (city) {
      filter.city = new RegExp(`^${city}$`, 'i');
    }

    if (postType) {
      filter.postType = postType;
    }

    const posts = await LocalPost.find(filter)
      .populate('author', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET POST DETAILS
// ==============================
// @route   GET /api/v1/local-posts/:id
// @desc    Get post details
// @access  Public
exports.getPostDetails = async (req, res, next) => {
  try {
    const post = await LocalPost.findById(req.params.id).populate(
      'author',
      'firstName lastName'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPVOTE POST (SIMPLE)
// ==============================
// @route   POST /api/v1/local-posts/:id/upvote
// @desc    Upvote a post
// @access  Private
exports.upvotePost = async (req, res, next) => {
  try {
    const post = await LocalPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post.upvotes += 1;
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post upvoted',
      upvotes: post.upvotes,
    });
  } catch (error) {
    next(error);
  }
};
