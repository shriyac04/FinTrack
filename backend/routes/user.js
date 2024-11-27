const express = require('express');
const { signup, login, profile } = require('../controllers/user'); // Adjust path as necessary
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile',authenticate,profile);
module.exports = router;
