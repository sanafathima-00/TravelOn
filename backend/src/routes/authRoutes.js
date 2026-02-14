const express = require('express');
const { validate } = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { signupSchema, loginSchema, refreshSchema } = require('../validators/authValidator');
const { register, login, refreshToken, getMe } = require('../controllers/authController');

const router = express.Router();

router.post('/register', validate(signupSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshSchema), refreshToken);
router.get('/me', protect, getMe);

module.exports = router;
