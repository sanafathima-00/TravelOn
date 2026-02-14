const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');
const { ApiError } = require('../utils/ApiError');

exports.getRestaurants = async (req, res, next) => {
  try {
    const { city, cuisines, minRating, maxDeliveryTime, page, limit } = req.validated || {};
    const filter = { isActive: true };
    if (city) filter.city = new RegExp(city, 'i');
    if (minRating != null) filter.rating = { $gte: minRating };
    if (cuisines && cuisines.length) filter.cuisines = { $in: cuisines };
    if (maxDeliveryTime != null) filter.deliveryTime = { $lte: maxDeliveryTime };

    const skip = (page - 1) * limit;
    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).populate('owner', 'name email').sort({ rating: -1 }).skip(skip).limit(limit).lean(),
      Restaurant.countDocuments(filter)
    ]);
    res.json({ success: true, data: restaurants, total, page, limit });
  } catch (err) {
    next(err);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant) return next(new ApiError(404, 'Restaurant not found'));
    const menu = await FoodItem.find({ restaurantId: restaurant._id }).lean();
    res.json({ success: true, data: { ...restaurant.toObject(), menu } });
  } catch (err) {
    next(err);
  }
};

exports.getNearbyRestaurants = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance } = req.validated || req.query;
    const lon = Number(longitude);
    const lat = Number(latitude);
    const max = Number(maxDistance) || 5000;
    const restaurants = await Restaurant.find({
      isActive: true,
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lon, lat] },
          $maxDistance: max
        }
      }
    }).limit(20).populate('owner', 'name email').lean();
    res.json({ success: true, data: restaurants });
  } catch (err) {
    next(err);
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    const v = req.validated;
    const doc = {
      name: v.name,
      description: v.description,
      city: v.city,
      location: { type: 'Point', coordinates: [v.longitude, v.latitude] },
      cuisines: v.cuisines || [],
      priceRange: v.priceRange,
      owner: req.user._id,
      nearby: { places: v.nearbyPlaces || [] },
      openingHours: v.openingHours,
      deliveryTime: v.deliveryTime,
      minimumOrderValue: v.minimumOrderValue,
      acceptOrders: v.acceptOrders !== false
    };
    const restaurant = await Restaurant.create(doc);
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

exports.addMenuItem = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return next(new ApiError(404, 'Restaurant not found'));
    const isOwner = restaurant.owner && restaurant.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return next(new ApiError(403, 'Not authorized to add menu items'));

    const v = req.validated;
    const item = await FoodItem.create({
      restaurantId: restaurant._id,
      name: v.name,
      description: v.description,
      category: v.category,
      price: v.price,
      isVegetarian: v.isVegetarian,
      preparationTime: v.preparationTime
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};
