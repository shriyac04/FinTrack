const express = require('express');
const { addExpense, getExpenses } = require('../controllers/expense');
const { addIncome, getIncomes} = require('../controllers/income');
const { validateRequest } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');
const { getUserIncomes } = require('../controllers/income');
const { getUserExpenses } = require('../controllers/expense');
const { deleteIncome } = require('../controllers/income');
const { deleteExpense } = require('../controllers/expense');
const router = express.Router();

router.post('/add-income', authenticate, validateRequest, addIncome);
router.get('/get-incomes', authenticate, getIncomes); // Supports pagination with query params
  
router.post('/add-expense', authenticate, validateRequest, addExpense);
router.get('/get-expenses', getExpenses); // Supports pagination with query params
  
  router.get('/incomes', authenticate, getUserIncomes);
  router.get('/expenses', authenticate, getUserExpenses);
  router.delete('/incomes/:id', authenticate, deleteIncome);
  router.delete('/expenses/:id', authenticate, deleteExpense);



  module.exports = router;
