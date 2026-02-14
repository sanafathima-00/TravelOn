const Hotel = require('../models/Hotel');
const { ApiError } = require('../utils/ApiError');

exports.getHotels = async (req, res, next) => {
  try {
    const { city, rating, minPrice, maxPrice, amenities, page, limit } = req.validated || {};
    const filter = { isActive: true };
    if (city) filter.city = new RegExp(city, 'i');
    if (rating != null) filter.rating = { $gte: rating };
    if (minPrice != null) filter.pricePerNightMax = { $gte: minPrice };
    if (maxPrice != null) filter.pricePerNightMin = { $lte: maxPrice };
    if (amenities && amenities.length) filter.amenities = { $all: amenities };

    const skip = (page - 1) * limit;
    const [hotels, total] = await Promise.all([
      Hotel.find(filter).populate('owner', 'name email').sort({ rating: -1 }).skip(skip).limit(limit).lean(),
      Hotel.countDocuments(filter)
    ]);
    res.json({ success: true, data: hotels, total, page, limit });
  } catch (err) {
    next(err);
  }
};

exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('owner', 'name email');
    if (!hotel) return next(new ApiError(404, 'Hotel not found'));
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

exports.getNearbyHotels = async (req, res, next) => {
  try {
    const { longitude, latitude, maxDistance } = req.validated || req.query;
    const lon = Number(longitude);
    const lat = Number(latitude);
    const max = Number(maxDistance) || 5000;
    const hotels = await Hotel.find({
      isActive: true,
      location: {
        $nearSphere: {
          $geometry: { type: 'Point', coordinates: [lon, lat] },
          $maxDistance: max
        }
      }
    }).limit(20).populate('owner', 'name email').lean();
    res.json({ success: true, data: hotels });
  } catch (err) {
    next(err);
  }
};

exports.createHotel = async (req, res, next) => {
  try {
    const v = req.validated;
    const doc = {
      name: v.name,
      description: v.description,
      city: v.city,
      address: v.address,
      location: { type: 'Point', coordinates: [v.longitude, v.latitude] },
      pricePerNightMin: v.pricePerNightMin,
      pricePerNightMax: v.pricePerNightMax,
      amenities: v.amenities || [],
      images: v.images || [],
      nearby: {
        places: v.nearbyPlaces || [],
        restaurants: v.nearbyRestaurants || [],
        transport: v.nearbyTransport || []
      },
      owner: req.user._id
    };
    const hotel = await Hotel.create(doc);
    res.status(201).json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};

exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return next(new ApiError(404, 'Hotel not found'));
    const isOwner = hotel.owner && hotel.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) return next(new ApiError(403, 'Not authorized to update this hotel'));

    const v = req.validated || {};
    if (v.name != null) hotel.name = v.name;
    if (v.description != null) hotel.description = v.description;
    if (v.city != null) hotel.city = v.city;
    if (v.address != null) hotel.address = v.address;
    if (v.longitude != null && v.latitude != null) {
      hotel.location = { type: 'Point', coordinates: [v.longitude, v.latitude] };
    }
    if (v.pricePerNightMin != null) hotel.pricePerNightMin = v.pricePerNightMin;
    if (v.pricePerNightMax != null) hotel.pricePerNightMax = v.pricePerNightMax;
    if (v.amenities != null) hotel.amenities = v.amenities;
    if (v.images != null) hotel.images = v.images;
    if (v.nearbyPlaces != null) hotel.nearby.places = v.nearbyPlaces;
    if (v.nearbyRestaurants != null) hotel.nearby.restaurants = v.nearbyRestaurants;
    if (v.nearbyTransport != null) hotel.nearby.transport = v.nearbyTransport;
    if (v.isActive != null) hotel.isActive = v.isActive;
    await hotel.save();
    res.json({ success: true, data: hotel });
  } catch (err) {
    next(err);
  }
};
