const { ApiError } = require('../utils/ApiError');

exports.authorize = (...roles) => (req, res, next) => {
  if (!req.user) return next(new ApiError(401, 'Not authorized.'));
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, `Access denied. Required role: ${roles.join(' or ')}.`));
  }
  next();
};
