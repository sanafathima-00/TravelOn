const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  isVegetarian: { type: Boolean, default: false },
  preparationTime: { type: Number, default: 15 }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
