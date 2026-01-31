/**
 * Auth Routes
 */

const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const { signupSchema, loginSchema } = require('../validators/schemas');
const authController = require('../controllers/authController');

// Public routes
router.post('/signup', validateRequest(signupSchema), authController.signup);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', authController.refreshAccessToken);

// Private routes
router.get('/me', verifyToken, authController.getProfile);

module.exports = router;
