const Hotel = require('../models/Hotel');
const ApiError = require('../utils/ApiError');

/* ============================= */
/* GET ALL HOTELS */
/* ============================= */

exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ isActive: true });
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

/* ============================= */
/* GET HOTEL BY ID */
/* ============================= */

exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('reviews.user', 'name');

    if (!hotel) {
      return next(new ApiError(404, 'Hotel not found'));
    }

    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

/* ============================= */
/* GET NEARBY HOTELS */
/* ============================= */

exports.getNearbyHotels = async (req, res, next) => {
  try {
    const { lng, lat } = req.query;

    if (!lng || !lat) {
      return next(new ApiError(400, 'Coordinates required'));
    }

    const hotels = await Hotel.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: 5000
        }
      }
    });

    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

/* ============================= */
/* CREATE HOTEL */
/* ============================= */

exports.createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

/* ============================= */
/* UPDATE HOTEL */
/* ============================= */

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!hotel) {
      return next(new ApiError(404, 'Hotel not found'));
    }

    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

/* ============================= */
/* HOTEL REVIEWS */
/* ============================= */

exports.getHotelReviews = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate('reviews.user', 'name');

    if (!hotel) {
      return next(new ApiError(404, 'Hotel not found'));
    }

    res.json({
      success: true,
      data: hotel.reviews
    });
  } catch (err) {
    next(err);
  }
};

exports.createHotelReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return next(new ApiError(404, 'Hotel not found'));
    }

    const review = {
      user: req.user._id,
      rating,
      title,
      comment
    };

    hotel.reviews.push(review);

    hotel.reviewCount = hotel.reviews.length;

    hotel.rating =
      hotel.reviews.reduce((acc, item) => acc + item.rating, 0) /
      hotel.reviewCount;

    await hotel.save();

    const updated = await Hotel.findById(hotel._id)
      .populate('reviews.user', 'name');

    res.status(201).json({
      success: true,
      data: updated
    });
  } catch (err) {
    next(err);
  }
};
