const express = require('express');
const authRoutes = require('./authRoutes');
const hotelRoutes = require('./hotelRoutes');
const restaurantRoutes = require('./restaurantRoutes');
const localPostRoutes = require('./localPostRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/hotels', hotelRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/local-posts', localPostRoutes);

module.exports = router;
