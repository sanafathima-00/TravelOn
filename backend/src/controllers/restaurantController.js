/**
 * Restaurant Controller
 */

const Restaurant = require('../models/Restaurant');
const FoodItem = require('../models/FoodItem');

// @route   POST /api/v1/restaurants
// @desc    Create restaurant
// @access  Private (Admin/Restaurant Owner)
exports.createRestaurant = async (req, res, next) => {
  try {
    const { name, description, city, cuisines, openingHours, deliveryTime } = req.body;

    const restaurant = new Restaurant({
      name,
      description,
      city,
      cuisines: cuisines || [],
      openingHours: openingHours || {},
      deliveryTime: deliveryTime || 30,
      owner: req.user.id,
      location: {
        type: 'Point',
        coordinates: req.body.coordinates || [0, 0],
      },
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

// @route   GET /api/v1/restaurants
// @desc    Get all restaurants with filters
// @access  Public
exports.getAllRestaurants = async (req, res, next) => {
  try {
    const { city, cuisines, minRating, maxDeliveryTime } = req.query;
    const filter = { isActive: true, acceptOrders: true };

    if (city) filter.city = new RegExp(city, 'i');
    if (cuisines) {
      const cuisineArray = Array.isArray(cuisines) ? cuisines : [cuisines];
      filter.cuisines = { $in: cuisineArray };
    }
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (maxDeliveryTime) filter.deliveryTime = { $lte: parseInt(maxDeliveryTime) };

    const restaurants = await Restaurant.find(filter)
      .populate('menu')
      .limit(50)
      .exec();

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/restaurants/:id
// @desc    Get restaurant details
// @access  Public
exports.getRestaurantDetails = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('menu')
      .populate({
        path: 'reviews',
        populate: {
          path: 'userId',
          select: 'firstName lastName avatar',
        },
      })
      .populate('owner', 'firstName lastName email phone');

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

// @route   GET /api/v1/restaurants/nearby
// @desc    Get nearby restaurants
// @access  Public
exports.getNearbyRestaurants = async (req, res, next) => {
  try {
    const { latitude, longitude, distance = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const restaurants = await Restaurant.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseFloat(distance) * 1000,
        },
      },
    })
      .populate('menu')
      .limit(20);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/v1/restaurants/:id/menu
// @desc    Add food item to menu
// @access  Private (Restaurant Owner)
exports.addFoodItem = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const { name, description, price, category, isVegetarian, preparationTime } = req.body;

    const foodItem = new FoodItem({
      restaurantId: restaurant._id,
      name,
      description,
      price,
      category,
      isVegetarian: isVegetarian || false,
      preparationTime: preparationTime || 15,
    });

    await foodItem.save();

    // Add to restaurant menu
    restaurant.menu.push(foodItem._id);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Food item added successfully',
      data: foodItem,
    });
  } catch (error) {
    next(error);
  }
};
