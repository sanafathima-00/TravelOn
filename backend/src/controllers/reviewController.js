/**
 * Review Controller
 */

const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');

// @route   POST /api/v1/reviews
// @desc    Create a review
// @access  Private
exports.createReview = async (req, res, next) => {
  try {
    const { entityType, entityId, rating, title, comment } = req.body;

    // Verify entity exists
    let entity;
    if (entityType === 'Hotel') {
      entity = await Hotel.findById(entityId);
    } else {
      entity = await Restaurant.findById(entityId);
    }

    if (!entity) {
      return res.status(404).json({
        success: false,
        message: `${entityType} not found`,
      });
    }

    const review = new Review({
      userId: req.user.id,
      entityType,
      entityId,
      rating,
      title,
      comment,
      isApproved: false, // Requires admin approval
    });

    await review.save();

    // Update entity rating
    const allReviews = await Review.find({ entityId, isApproved: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    if (entityType === 'Hotel') {
      await Hotel.findByIdAndUpdate(entityId, {
        rating: avgRating,
        reviewCount: allReviews.length,
      });
    } else {
      await Restaurant.findByIdAndUpdate(entityId, {
        rating: avgRating,
        reviewCount: allReviews.length,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully (pending approval)',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/reviews/:entityType/:entityId
// @desc    Get reviews for entity
// @access  Public
exports.getReviews = async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;

    const reviews = await Review.find({
      entityType,
      entityId,
      isApproved: true,
      isHidden: false,
    })
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/v1/reviews/:id/upvote
// @desc    Upvote a review
// @access  Private
exports.upvoteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Check if already voted
    const existingVote = review.helpful.voters.find((v) => v.userId.toString() === req.user.id);

    if (existingVote) {
      if (existingVote.vote === 'upvote') {
        // Remove upvote
        review.helpful.upvotes--;
        review.helpful.voters = review.helpful.voters.filter((v) => v.userId.toString() !== req.user.id);
      } else {
        // Change from downvote to upvote
        review.helpful.downvotes--;
        review.helpful.upvotes++;
        existingVote.vote = 'upvote';
      }
    } else {
      // Add upvote
      review.helpful.upvotes++;
      review.helpful.voters.push({
        userId: req.user.id,
        vote: 'upvote',
      });
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/v1/reviews/:id/downvote
// @desc    Downvote a review
// @access  Private
exports.downvoteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    const existingVote = review.helpful.voters.find((v) => v.userId.toString() === req.user.id);

    if (existingVote) {
      if (existingVote.vote === 'downvote') {
        review.helpful.downvotes--;
        review.helpful.voters = review.helpful.voters.filter((v) => v.userId.toString() !== req.user.id);
      } else {
        review.helpful.upvotes--;
        review.helpful.downvotes++;
        existingVote.vote = 'downvote';
      }
    } else {
      review.helpful.downvotes++;
      review.helpful.voters.push({
        userId: req.user.id,
        vote: 'downvote',
      });
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
