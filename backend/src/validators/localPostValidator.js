const { z } = require('zod');

const POST_TYPES = ['Tip', 'Scam Alert', 'Hidden Place', 'Recommendation'];

const createLocalPostSchema = z.object({
  city: z.string().min(1, 'City is required'),
  postType: z.enum(POST_TYPES),
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  tags: z.array(z.string()).optional().default([])
});

const queryLocalPostSchema = z.object({
  city: z.string().optional(),
  postType: z.enum(POST_TYPES).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional().transform(v => Array.isArray(v) ? v : (v ? [v] : [])),
  page: z.coerce.number().min(1).optional().default(1),
  limit: z.coerce.number().min(1).max(100).optional().default(20)
});

module.exports = { createLocalPostSchema, queryLocalPostSchema };
