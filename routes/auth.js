const express = require('express');
const passport = require('passport');
const router = express.Router();

// GET /login — render login.ejs
router.get('/login', (req, res) => {
  res.render('login'); // Make sure views/login.ejs exists
});

// GET /auth/google — start Google OAuth
router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// GET /auth/google/callback — Google OAuth redirect
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/dashboard'); // On success
  }
);

// POST /logout — log user out and redirect to login
router.post('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

module.exports = router;