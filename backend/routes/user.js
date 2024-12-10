const express = require('express');
const { signup, login, profile,updateBudget, getBudget } = require('../controllers/user'); // Adjust path as necessary
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/profile',authenticate,profile);
router.post('/budget',authenticate,updateBudget);
router.get('/getBudget', authenticate, getBudget);
module.exports = router;
