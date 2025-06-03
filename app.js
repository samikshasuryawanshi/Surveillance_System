const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// Models
const User = require('./models/User');
const Device = require('./models/Device');
const Video = require('./models/Video');

// Routes
const authRoutes = require('./routes/auth');
const deviceRoutes = require('./routes/devices');
const videoRoutes = require('./routes/videos');
const subscriptionRoutes = require('./routes/subscription');

dotenv.config();
const app = express();

const razorpayRoutes = require('./routes/razorpayRoutes');
app.use('/api/razorpay', razorpayRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Setup (single session middleware with MongoStore)
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());

// Passport Config
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Google Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        user = await User.create({
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name?.givenName,
          lastName: profile.name?.familyName,
          email: profile.emails[0].value,
          photo: profile.photos[0].value,
        });
      }
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use Routes
app.use('/', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/subscription', subscriptionRoutes); // Make sure subscriptionRoutes handles /subscribe routes

// Public Route
app.get('/', (req, res) => {
  res.render('login'); // views/login.ejs must exist
});

// Auth Middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

// Protected Dashboard Route
app.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const devices = await Device.find({ userId: req.user._id });
    const recordedVideos = await Video.find({ userId: req.user._id }).sort({ uploadedAt: -1 });

    res.render('dashboard', {
      user: req.user,
      devices,
      recordedVideos,
    });

  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Error loading dashboard');
  }
});

app.get('/subscribe', ensureAuthenticated, (req, res) => {
  res.render('subscribe', {
    user: req.user,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  });
});


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));