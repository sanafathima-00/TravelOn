/**
 * Local Post Model
 * Posts by locals - tips, scam alerts, hidden places, etc.
 */

const mongoose = require('mongoose');

const localPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    postType: {
      type: String,
      enum: ['Tip', 'Scam Alert', 'Hidden Place', 'Event', 'Recommendation'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      minlength: 20,
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number],
      address: String,
    },
    tags: [String],
    engagement: {
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
      comments: [
        {
          userId: mongoose.Schema.Types.ObjectId,
          userName: String,
          userAvatar: String,
          comment: String,
          createdAt: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },
    // Admin moderation
    isApproved: {
      type: Boolean,
      default: false,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    flagCount: {
      type: Number,
      default: 0,
    },
    flags: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        reason: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    visibility: {
      type: String,
      enum: ['Public', 'Locals Only'],
      default: 'Public',
    },
  },
  {
    timestamps: true,
    indexes: [
      { location: '2dsphere' },
      { city: 1, createdAt: -1 },
    ],
  }
);

module.exports = mongoose.model('LocalPost', localPostSchema);
