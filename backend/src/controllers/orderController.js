/**
 * Order Controller
 */

const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');
const stripe = require('../config/stripe');

// @route   POST /api/v1/orders
// @desc    Place a food order
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found',
      });
    }

    // Calculate totals
    let subtotal = 0;
    items.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    const tax = Math.round((subtotal * 0.05) * 100) / 100; // 5% tax
    const deliveryCharge = restaurant.deliveryRadius > 5 ? 50 : 30; // Mock delivery charge
    const totalAmount = subtotal + tax + deliveryCharge;

    const order = new Order({
      userId: req.user.id,
      restaurantId,
      items,
      deliveryAddress,
      subtotal,
      tax,
      deliveryCharge,
      totalAmount,
      paymentMethod: paymentMethod || 'Card',
      estimatedDeliveryTime: new Date(Date.now() + restaurant.deliveryTime * 60 * 1000),
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/orders
// @desc    Get user's orders
// @access  Private
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('restaurantId', 'name address')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/v1/orders/:id
// @desc    Get order details
// @access  Private
exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId')
      .populate('userId', 'firstName lastName phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PUT /api/v1/orders/:id/status
// @desc    Update order status
// @access  Private (Restaurant/Admin)
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Check authorization
    const restaurant = await Restaurant.findById(order.restaurantId);
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    order.status = status;
    if (status === 'Out for Delivery') {
      order.deliveryStartedAt = new Date();
    }
    if (status === 'Delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/v1/orders/:id/payment
// @desc    Process order payment
// @access  Private
exports.processOrderPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount: order.totalAmount,
    });
  } catch (error) {
    next(error);
  }
};
