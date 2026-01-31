/**
 * Request Validation Middleware using Zod
 */

const { z } = require('zod');

const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      req.validated = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: messages,
        });
      }
      next(error);
    }
  };
};

module.exports = validateRequest;
