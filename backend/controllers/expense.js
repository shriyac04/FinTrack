const Expense = require('../models/ExpenseModel');

// Add Expense
exports.addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;
  const userId = req.user._id;

  try {
    if (!title || !amount || !category || !description || !date || amount <= 0) {
      return res.status(400).json({ message: 'Invalid input fields' });
    }

    const expense = new Expense({ title, amount, category, description, date, userId });
    await expense.save();
    res.status(201).json({ message: 'Expense added successfully', data: expense });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Expenses
exports.getExpenses = async (req, res) => {
  const userId = req.user._id;

  try {
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ message: 'Success', data: expenses });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


exports.getUserExpenses = async (req, res) => {
  const userId = req.user.id; // Extract userId from authenticated user

  try {
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 }); // Query expenses for this user
    res.status(200).json({ message: 'Success', data: expenses });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

