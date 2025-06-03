const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const razorpay = require('../razorpay');
const User = require('../models/User');

// Middleware to check auth
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ message: 'Unauthorized' });
}

// 1) Create Razorpay order
router.post('/create-order', ensureAuthenticated, async (req, res) => {
  try {
    const options = {
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,  // <-- fixed here with backticks
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Order creation failed' });
  }
});

// 2) Verify payment and update subscription
router.post('/verify-payment', ensureAuthenticated, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generated_signature === razorpay_signature) {
    try {
      await User.updateOne({ _id: req.user._id }, { isSubscribed: true });
      return res.json({ success: true, message: 'Subscription activated' });
    } catch (err) {
      console.error('DB update error:', err);
      return res.status(500).json({ success: false, message: 'Database update failed' });
    }
  } else {
    return res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});

module.exports = router;
