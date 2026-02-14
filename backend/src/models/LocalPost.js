const mongoose = require('mongoose');

const POST_TYPES = ['Tip', 'Scam Alert', 'Hidden Place', 'Recommendation'];

const localPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  city: { type: String, required: true, index: true },
  postType: { type: String, enum: POST_TYPES, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true, minlength: 20 },
  tags: [{ type: String }],
  upvotes: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('LocalPost', localPostSchema);
