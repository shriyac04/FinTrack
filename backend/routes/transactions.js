const express = require('express');
const { addExpense, getExpenses, deleteExpense } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { validateRequest } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { getUserIncomes } = require('../controllers/income');
const { getUserExpenses } = require('../controllers/expense');

const router = express.Router();

router
  .post('/add-income', authenticate, validateRequest, addIncome)
  .get('/get-incomes', authenticate, getIncomes) // Supports pagination with query params
  
  .post('/add-expense', authenticate, validateRequest, addExpense)
  .get('/get-expenses', authenticate, getExpenses) // Supports pagination with query params
  
  router.get('/incomes', authenticate, getUserIncomes);
  router.get('/expenses', authenticate, getUserExpenses);
module.exports = router;
