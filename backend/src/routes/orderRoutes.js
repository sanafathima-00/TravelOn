/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const { verifyToken, authorize } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

// All routes require authentication
router.post('/', verifyToken, orderController.createOrder);
router.get('/', verifyToken, orderController.getUserOrders);
router.get('/:id', verifyToken, orderController.getOrderDetails);
router.put('/:id/status', verifyToken, authorize('admin', 'local'), orderController.updateOrderStatus);
router.post('/:id/payment', verifyToken, orderController.processOrderPayment);

module.exports = router;
