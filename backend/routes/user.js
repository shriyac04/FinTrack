const express = require('express');
const { signup, login } = require('../controllers/user'); // Adjust path as necessary
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

module.exports = router;
