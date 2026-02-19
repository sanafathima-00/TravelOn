const { z } = require('zod');

const PLACE_CATEGORIES = ['worship', 'eatery', 'interest', 'shopping'];

const queryBangalorePlaceSchema = z.object({
  category: z.enum(PLACE_CATEGORIES).optional()
});

module.exports = { PLACE_CATEGORIES, queryBangalorePlaceSchema };

