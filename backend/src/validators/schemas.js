/**
 * Validation Schemas using Zod
 */

const { z } = require('zod');

// Auth Schemas
const signupSchema = z.object({
  body: z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['tourist', 'local']).optional().default('tourist'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password is required'),
  }),
});

// Hotel Schemas
const hotelSchema = z.object({
  body: z.object({
    name: z.string().min(3, 'Hotel name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    city: z.string().min(2),
    address: z.object({
      street: z.string().optional(),
      zipCode: z.string().optional(),
    }).optional(),
    pricePerNightMin: z.number().positive(),
    pricePerNightMax: z.number().positive(),
    amenities: z.array(z.string()).optional(),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),
  }),
});

// Room Schemas
const roomSchema = z.object({
  body: z.object({
    roomNumber: z.string(),
    roomType: z.enum(['Single', 'Double', 'Suite', 'Deluxe', 'Penthouse']),
    price: z.number().positive(),
    capacity: z.object({
      adults: z.number().positive(),
      children: z.number().nonnegative(),
    }).optional(),
    bedCount: z.number().positive(),
    bedType: z.enum(['Single', 'Double', 'Queen', 'King', 'Twin']).optional(),
  }),
});

// Booking Schema
const bookingSchema = z.object({
  body: z.object({
    hotelId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid hotel ID'),
    roomId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid room ID'),
    checkInDate: z.string().datetime(),
    checkOutDate: z.string().datetime(),
    numberOfGuests: z.object({
      adults: z.number().positive(),
      children: z.number().nonnegative(),
    }),
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    guestPhone: z.string(),
    specialRequests: z.string().optional(),
  }),
});

// Review Schema
const reviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    title: z.string().min(5),
    comment: z.string().min(10),
  }),
});

// Local Post Schema
const localPostSchema = z.object({
  body: z.object({
    city: z.string().min(2),
    postType: z.enum(['Tip', 'Scam Alert', 'Hidden Place', 'Event', 'Recommendation']),
    title: z.string().min(5),
    content: z.string().min(20),
    tags: z.array(z.string()).optional(),
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
  hotelSchema,
  roomSchema,
  bookingSchema,
  reviewSchema,
  localPostSchema,
};
