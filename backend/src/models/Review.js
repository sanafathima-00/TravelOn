const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true, minlength: 20 }
}, { timestamps: true });

reviewSchema.index({ hotelId: 1 });

module.exports = mongoose.model('Review', reviewSchema);
