/**
 * Restaurant Controller (MVP)
 */

const Restaurant = require('../models/Restaurant');

// ==============================
// CREATE RESTAURANT
// ==============================
// @route   POST /api/v1/restaurants
// @desc    Create restaurant
// @access  Private (Admin / Local)
exports.createRestaurant = async (req, res, next) => {
  try {
    const {
      name,
      description,
      city,
      cuisines,
      priceRange,
      menu,
      nearby,
      images,
    } = req.body;

    const restaurant = new Restaurant({
      name,
      description,
      city,
      cuisines: cuisines || [],
      priceRange: priceRange || '₹₹',
      menu: menu || [],
      nearby: nearby || {},
      images: images || [],
      owner: req.user.id,
    });

    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL RESTAURANTS (CITY-BASED)
// ==============================
// @route   GET /api/v1/restaurants
// @desc    Get restaurants by city with filters
// @access  Public
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { city, cuisines, priceRange, rating } = req.query;

    const filter = { isActive: true };

    if (city) {
      filter.city = new RegExp(`^${city}$`, 'i');
    }

    if (cuisines) {
      const cuisineArray = Array.isArray(cuisines)
        ? cuisines
        : cuisines.split(',');
      filter.cuisines = { $in: cuisineArray };
    }

    if (priceRange) {
      filter.priceRange = priceRange;
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    const restaurants = await Restaurant.find(filter)
      .sort({ rating: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET RESTAURANT DETAILS
// ==============================
// @route   GET /api/v1/restaurants/:id
// @desc    Get restaurant details
// @access  Public
exports.getRestaurantDetails = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      'owner',
      'firstName lastName'
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE RESTAURANT
// ==============================
// @route   PUT /api/v1/restaurants/:id
// @desc    Update restaurant (menu, info)
// @access  Private (Owner / Admin)
exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (
      restaurant.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant',
      });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Restaurant updated successfully',
      data: updatedRestaurant,
    });
  } catch (error) {
    next(error);
  }
};
