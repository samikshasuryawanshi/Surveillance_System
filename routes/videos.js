const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { uploadMiddleware, uploadVideo, getVideos } = require('../controllers/videoController');

router.post('/upload', auth, uploadMiddleware, uploadVideo);
router.get('/', auth, getVideos);

module.exports = router;
