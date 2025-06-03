const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const User = require('../models/User');

require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

router.get('/subscribe', ensureAuthenticated, async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: 4900, // ₹49 in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    });

    res.render('subscribe', {
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      order,
      user: req.user,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    res.status(500).send('Error creating order');
  }
});

router.post('/subscribe', ensureAuthenticated, async (req, res) => {
  try {
    // You should verify payment using Razorpay signature (recommended)
    await User.updateOne({ _id: req.user._id }, { isSubscribed: true });
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Subscription update failed:', error);
    res.status(500).send('Subscription failed');
  }
});

module.exports = router;
