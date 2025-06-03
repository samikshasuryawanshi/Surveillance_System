// routes/payment.js
const express = require('express');
const router = express.Router();
const razorpay = require('../razorpay');

router.post('/create-subscription', async (req, res) => {
  try {
    const { userId, planId } = req.body; // store planId from Razorpay dashboard
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 12, // e.g., 12 months
    });

    res.json({ subscriptionId: subscription.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

module.exports = router;