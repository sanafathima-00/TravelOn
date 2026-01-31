/**
 * Local Post Controller
 */

const LocalPost = require('../models/LocalPost');

// @route   POST /api/v1/local-posts
// @desc    Create a local post
// @access  Private (Locals only)
exports.createLocalPost = async (req, res, next) => {
  try {
    // Verify user is a local
    if (req.user.role !== 'local') {
      return res.status(403).json({
        success: false,
        message: 'Only locals can create posts',
      });
    }

    const { city, postType, title, content, tags, location } = req.body;

    const post = new LocalPost({
      userId: req.user.id,
      city,
      postType,
      title,
      content,
      tags: tags || [],
      location: location || {
        type: 'Point',
        coordinates: [0, 0],
      },
      isApproved: false, // Admin moderation
    });

    await post.save();

    res.status(201).json({
      success: true,
      message: 'Post created successfully (pending approval)',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/local-posts
// @desc    Get local posts by city
// @access  Public
exports.getLocalPosts = async (req, res, next) => {
  try {
    const { city, postType, tags } = req.query;
    const filter = { isApproved: true, isHidden: false };

    if (city) filter.city = new RegExp(city, 'i');
    if (postType) filter.postType = postType;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }

    const posts = await LocalPost.find(filter)
      .populate('userId', 'firstName lastName avatar localBio')
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

// @route   GET /api/v1/local-posts/:id
// @desc    Get post details
// @access  Public
exports.getPostDetails = async (req, res, next) => {
  try {
    const post = await LocalPost.findById(req.params.id)
      .populate('userId', 'firstName lastName avatar localBio')
      .populate('engagement.comments.userId', 'firstName lastName avatar');

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

    const existingVote = post.engagement.voters.find((v) => v.userId.toString() === req.user.id);

    if (existingVote) {
      if (existingVote.vote === 'upvote') {
        post.engagement.upvotes--;
        post.engagement.voters = post.engagement.voters.filter((v) => v.userId.toString() !== req.user.id);
      } else {
        post.engagement.downvotes--;
        post.engagement.upvotes++;
        existingVote.vote = 'upvote';
      }
    } else {
      post.engagement.upvotes++;
      post.engagement.voters.push({
        userId: req.user.id,
        vote: 'upvote',
      });
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/v1/local-posts/:id/comment
// @desc    Add comment to post
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const { comment } = req.body;

    const post = await LocalPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    post.engagement.comments.push({
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userAvatar: req.user.avatar,
      comment,
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment added',
      data: post,
    });
  } catch (error) {
    next(error);
  }
};
