/**
 * Local Post Model (MVP)
 * Tips, scam alerts, hidden places by locals
 */

const mongoose = require('mongoose');

const localPostSchema = new mongoose.Schema(
  {
    // Author (must be local)
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    city: {
      type: String,
      required: true,
      index: true,
    },

    postType: {
      type: String,
      enum: ['Tip', 'Scam Alert', 'Hidden Place', 'Recommendation'],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },

    content: {
      type: String,
      required: true,
      minlength: 20,
    },

    tags: {
      type: [String],
      default: [],
    },

    // Simple engagement (NO voters / comments)
    upvotes: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    indexes: [{ city: 1, createdAt: -1 }],
  }
);

module.exports = mongoose.model('LocalPost', localPostSchema);
