const BangalorePlace = require('../models/BangalorePlace');
const { ApiError } = require('../utils/ApiError');

exports.getPlaces = async (req, res, next) => {
  try {
    const { category } = req.validated || {};
    const filter = { city: 'Bangalore' };
    if (category) {
      filter.category = category;
    }

    const places = await BangalorePlace.find(filter)
      .sort({ createdAt: 1 })
      .lean();

    res.json({ success: true, data: places });
  } catch (err) {
    next(err);
  }
};

exports.getPlaceById = async (req, res, next) => {
  try {
    const place = await BangalorePlace.findById(req.params.id)
      .populate('reviews.user', 'name')
      .lean();
    if (!place || place.city !== 'Bangalore') {
      return next(new ApiError(404, 'Place not found'));
    }
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const place = await BangalorePlace.findById(req.params.id);
    if (!place || place.city !== 'Bangalore') {
      return next(new ApiError(404, 'Place not found'));
    }

    const { rating, title, comment } = req.validated;

    place.reviews.push({
      user: req.user._id,
      rating,
      title,
      comment
    });

    const totalReviews = place.reviews.length;
    const sumRatings = place.reviews.reduce((sum, r) => sum + r.rating, 0);
    place.averageRating = Math.round((sumRatings / totalReviews) * 10) / 10;
    place.reviewCount = totalReviews;

    await place.save();

    const populated = await BangalorePlace.findById(place._id)
      .populate('reviews.user', 'name')
      .lean();

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

