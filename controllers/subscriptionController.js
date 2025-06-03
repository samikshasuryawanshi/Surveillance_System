const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription-cancelled`,
      customer_email: req.user.email,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const user = await User.findOne({ email: session.customer_email });
    if (user) {
      user.subscriptionActive = true;
      user.stripeCustomerId = session.customer;
      await user.save();
    }
  }

  res.json({ received: true });
};
