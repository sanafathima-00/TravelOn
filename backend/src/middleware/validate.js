const { ApiError } = require('../utils/ApiError');

const validate = (schema, options = {}) => {
  const source = options.source || 'body';
  return (req, res, next) => {
    const data = source === 'query' ? { ...req.query, ...req.params } : { ...req.body, ...req.params };
    const result = schema.safeParse(data);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      const message = Object.entries(errors)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join('; ');
      return next(new ApiError(400, message));
    }
    req.validated = result.data;
    next();
  };
};

module.exports = { validate };
