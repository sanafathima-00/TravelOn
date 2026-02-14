const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ApiError } = require('../utils/ApiError');

const accessTokenExpiry = '15m';
const refreshTokenExpiry = '7d';

const generateTokens = (userId) => {
  const access = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: accessTokenExpiry }
  );
  const refresh = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: refreshTokenExpiry }
  );
  return { accessToken: access, refreshToken: refresh };
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.validated;
    const existing = await User.findOne({ email });
    if (existing) return next(new ApiError(400, 'Email already registered'));
    const user = await User.create({ name, email, password, role });
    const tokens = generateTokens(user._id);
    res.status(201).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...tokens
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.validated;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }
    const tokens = generateTokens(user._id);
    res.json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      ...tokens
    });
  } catch (err) {
    next(err);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.validated;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return next(new ApiError(401, 'User not found'));
    const tokens = generateTokens(user._id);
    res.json({ success: true, ...tokens });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};
