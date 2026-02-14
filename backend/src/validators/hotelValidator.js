const { z } = require('zod');

const AMENITIES = [
  'WiFi', 'AC', 'Parking', 'Pool', 'Gym', 'Restaurant', 'Room Service',
  'Spa', 'Laundry', '24/7 Reception', 'Travel Desk', 'Breakfast'
];

const createHotelSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  city: z.string().min(1, 'City is required'),
  address: z.string().optional(),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  pricePerNightMin: z.number().min(0),
  pricePerNightMax: z.number().min(0),
  amenities: z.array(z.enum(AMENITIES)).optional().default([]),
  images: z.array(z.string().url()).optional().default([]),
  nearbyPlaces: z.array(z.string()).optional().default([]),
  nearbyRestaurants: z.array(z.string()).optional().default([]),
  nearbyTransport: z.array(z.string()).optional().default([])
}).refine(d => d.pricePerNightMax >= d.pricePerNightMin, { message: 'pricePerNightMax must be >= pricePerNightMin', path: ['pricePerNightMax'] });

const updateHotelSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  address: z.string().optional(),
  longitude: z.number().min(-180).max(180).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  pricePerNightMin: z.number().min(0).optional(),
  pricePerNightMax: z.number().min(0).optional(),
  amenities: z.array(z.enum(AMENITIES)).optional(),
  images: z.array(z.string().url()).optional(),
  nearbyPlaces: z.array(z.string()).optional(),
  nearbyRestaurants: z.array(z.string()).optional(),
  nearbyTransport: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});

const queryHotelSchema = z.object({
  city: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  amenities: z.union([z.string(), z.array(z.string())]).optional().transform(v => Array.isArray(v) ? v : (v ? [v] : [])),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20)
});

const nearbySchema = z.object({
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
  maxDistance: z.coerce.number().min(100).max(50000).optional().default(5000)
});

module.exports = { createHotelSchema, updateHotelSchema, queryHotelSchema, nearbySchema };
