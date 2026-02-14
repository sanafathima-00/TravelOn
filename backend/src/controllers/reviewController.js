const Review = require('../models/Review');
const Hotel = require('../models/Hotel');
const { ApiError } = require('../utils/ApiError');

exports.getHotelReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ hotelId: req.params.id })
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};

exports.createHotelReview = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return next(new ApiError(404, 'Hotel not found'));

    const { rating, title, comment } = req.validated;
    const review = await Review.create({
      hotelId: hotel._id,
      userId: req.user._id,
      rating,
      title,
      comment
    });

    const reviews = await Review.find({ hotelId: hotel._id });
    const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    hotel.rating = Math.round(avgRating * 10) / 10;
    hotel.reviewCount = reviews.length;
    await hotel.save();

    const populated = await Review.findById(review._id).populate('userId', 'name');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};
