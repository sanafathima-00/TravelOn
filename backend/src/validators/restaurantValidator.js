const { z } = require('zod');

const createRestaurantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  longitude: z.number().min(-180).max(180),
  latitude: z.number().min(-90).max(90),
  cuisines: z.array(z.string()).optional().default([]),
  priceRange: z.string().optional(),
  nearbyPlaces: z.array(z.string()).optional().default([]),
  openingHours: z.string().optional(),
  deliveryTime: z.number().optional(),
  minimumOrderValue: z.number().optional(),
  acceptOrders: z.boolean().optional().default(true)
});

const updateRestaurantSchema = createRestaurantSchema.partial();

const addMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0),
  isVegetarian: z.boolean().optional().default(false),
  preparationTime: z.number().min(0).optional().default(15)
});

const queryRestaurantSchema = z.object({
  city: z.string().optional(),
  cuisines: z.union([z.string(), z.array(z.string())]).optional().transform(v => Array.isArray(v) ? v : (v ? [v] : [])),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxDeliveryTime: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20)
});

const nearbyRestaurantSchema = z.object({
  longitude: z.coerce.number().min(-180).max(180),
  latitude: z.coerce.number().min(-90).max(90),
  maxDistance: z.coerce.number().min(100).max(50000).optional().default(5000)
});

module.exports = {
  createRestaurantSchema,
  updateRestaurantSchema,
  addMenuItemSchema,
  queryRestaurantSchema,
  nearbyRestaurantSchema
};
