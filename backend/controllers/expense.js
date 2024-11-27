const Expense = require('../models/ExpenseModel');
const mongoose = require('mongoose');
// Add Expense
exports.addExpense = async (req, res) => {
  const { title, amount, category, description, date } = req.body;
  const userId = req.user?.id; // Extract userId from the authenticated user

  try {
    // Validate input fields
    if (!title || !amount || !category || !description || !date || amount <= 0) {
      return res.status(400).json({ message: 'Invalid input fields' });
    }

    // Create a new Expense entry
    const expense = new Expense({ title, amount, category, description, date, userId });

    // Save to the database
    await expense.save();

    // Send success response
    res.status(201).json({ message: 'Expense added successfully', data: expense });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get Incomes
exports.getExpenses = async (req, res) => {
  const userId = req.user._id; // Extract userId from the authenticated user

  try {
    // Query database for incomes that belong to the authenticated user
    const expenses = await Expense.find({ userId }).sort({ createdAt: -1 });

    // If no incomes are found, return an empty array
    if (!expenses.length) {
      return res.status(200).json({ message: 'No incomes found', data: [] });
    }

    // Respond with the fetched incomes
    res.status(200).json({ message: 'Success', data: expenses });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Incomes for Logged-In User
exports.getUserExpenses = async (req, res) => {
  const userId = req.user.id; // Extract userId from authenticated user

  try {
    const expenses= await Expense.find({ userId }).sort({ createdAt: -1 }); // Query incomes for this user
    res.status(200).json({ message: 'Success', data: expenses });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params; // Extract the expense ID from the route parameters
  const userId = req.user._id; // Extract the authenticated user's ID

  try {
    // Validate the expense ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid expense ID format' });
    }

    // Find the expense by ID and userId, and delete it
    const deletedExpense = await Expense.findByIdAndDelete({ _id: id, userId });

    // If no expense is found, return a 404 response
    if (!deletedExpense) {
      return res.status(404).json({ message: 'Expense not found or does not belong to the user' });
    }

    // Return a success response
    res.status(200).json({
      message: 'Expense deleted successfully',
      data: deletedExpense
    });
  } catch (error) {
    console.error('Error Deleting Expense:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};