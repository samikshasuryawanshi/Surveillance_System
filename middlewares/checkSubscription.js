module.exports = function ensureSubscription(req, res, next) {
  if (req.isAuthenticated() && req.user?.isSubscribed) {
    return next();
  }
  res.status(403).render('subscribe', {
    message: "Access denied. Please subscribe to view cloud recordings.",
    user: req.user,
  });
};