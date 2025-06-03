const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { addDevice, getDevices } = require('../controllers/deviceController');

router.post('/', auth, addDevice);
router.get('/', auth, getDevices);

module.exports = router;
