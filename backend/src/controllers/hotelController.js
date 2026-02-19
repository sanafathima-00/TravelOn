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
