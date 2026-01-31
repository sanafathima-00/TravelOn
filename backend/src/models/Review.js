/**
 * Review Model
 * Reviews for hotels and restaurants
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    entityType: {
      type: String,
      enum: ['Hotel', 'Restaurant'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      required: true,
      minlength: 10,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    helpful: {
      upvotes: {
        type: Number,
        default: 0,
      },
      downvotes: {
        type: Number,
        default: 0,
      },
      voters: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          vote: {
            type: String,
            enum: ['upvote', 'downvote'],
          },
        },
      ],
    },
    responses: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isApproved: {
      type: Boolean,
      default: false, // Admin moderation required
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    flaggedAsInappropriate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Review', reviewSchema);
