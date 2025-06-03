const express = require('express');
const router = express.Router();

router.post('/razorpay', express.json(), (req, res) => {
  const event = req.body;

  if (event.event === 'subscription.activated') {
    const userEmail = event.payload.subscription.entity.customer_email;
    // 🔐 Set user as subscribed in DB
    console.log(`Subscription activated for ${userEmail}`);
  }

  res.status(200).send('Webhook received');
});

module.exports = router;
