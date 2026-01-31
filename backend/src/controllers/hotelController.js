/**
 * Hotel Controller (MVP)
 */

const Hotel = require('../models/Hotel');

// ==============================
// CREATE HOTEL
// ==============================
// @route   POST /api/v1/hotels
// @desc    Create a new hotel
// @access  Private (Admin / Local)
exports.createHotel = async (req, res, next) => {
  try {
    const {
      name,
      description,
      city,
      pricePerNightMin,
      pricePerNightMax,
      amenities,
      nearby,
      images,
    } = req.body;

    const hotel = new Hotel({
      name,
      description,
      city,
      pricePerNightMin,
      pricePerNightMax,
      amenities: amenities || [],
      nearby: nearby || {},
      images: images || [],
      owner: req.user.id,
    });

    await hotel.save();

    res.status(201).json({
      success: true,
      message: 'Hotel created successfully',
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET ALL HOTELS (CITY / FILTERS)
// ==============================
// @route   GET /api/v1/hotels
// @desc    Get hotels by city with filters
// @access  Public
exports.getAllHotels = async (req, res, next) => {
  try {
    const { city, rating, minPrice, maxPrice, amenities } = req.query;

    const filter = { isActive: true };

    if (city) {
      filter.city = new RegExp(`^${city}$`, 'i');
    }

    if (rating) {
      filter.rating = { $gte: Number(rating) };
    }

    if (minPrice || maxPrice) {
      filter.pricePerNightMin = { $gte: Number(minPrice || 0) };
      filter.pricePerNightMax = { $lte: Number(maxPrice || 100000) };
    }

    if (amenities) {
      const amenityArray = Array.isArray(amenities)
        ? amenities
        : amenities.split(',');
      filter.amenities = { $in: amenityArray };
    }

    const hotels = await Hotel.find(filter)
      .select('-reviews') // keep list light
      .sort({ rating: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// GET HOTEL DETAILS
// ==============================
// @route   GET /api/v1/hotels/:id
// @desc    Get single hotel details
// @access  Public
exports.getHotelDetails = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate(
      'owner',
      'firstName lastName'
    );

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// UPDATE HOTEL
// ==============================
// @route   PUT /api/v1/hotels/:id
// @desc    Update hotel
// @access  Private (Owner / Admin)
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: 'Hotel not found',
      });
    }

    if (
      hotel.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hotel',
      });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: 'Hotel updated successfully',
      data: updatedHotel,
    });
  } catch (error) {
    next(error);
  }
};
