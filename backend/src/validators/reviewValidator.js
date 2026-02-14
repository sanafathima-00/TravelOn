const { z } = require('zod');

const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(1, 'Title is required'),
  comment: z.string().min(20, 'Comment must be at least 20 characters')
});

module.exports = { createReviewSchema };
