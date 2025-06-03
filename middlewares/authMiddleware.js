// middlewares/authMiddleware.js

const protect = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Not authorized' });
};

module.exports = { protect };