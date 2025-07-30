const Income = require('../models/IncomeModel');
const mongoose = require('mongoose');
// Add Income
exports.addIncome = async (req, res) => {
  const { title, amount, category, description, date } = req.body;
  const userId = req.user?.id; // Extract userId from the authenticated user

  try {
    // Validate input fields
    if (!title || !amount || !category || !description || !date || amount <= 0) {
      return res.status(400).json({ message: 'Invalid input fields' });
    }

    // Create a new Income entry
    const income = new Income({ title, amount, category, description, date, userId });

    // Save to the database
    await income.save();

    // Send success response
    res.status(201).json({ message: 'Income added successfully', data: income });
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get Incomes
exports.getIncomes = async (req, res) => {
  const userId = req.user._id; // Extract userId from the authenticated user

  try {
    // Query database for incomes that belong to the authenticated user
    const incomes = await Income.find({ userId }).sort({ createdAt: -1 });

    // If no incomes are found, return an empty array
    if (!incomes.length) {
      return res.status(200).json({ message: 'No incomes found', data: [] });
    }

    // Respond with the fetched incomes
    res.status(200).json({ message: 'Success', data: incomes });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Incomes for Logged-In User
exports.getUserIncomes = async (req, res) => {
  const userId = req.user.id; // Extract userId from authenticated user
  // if(userId){
  //   console.log(`userId ${userId}`);
  // }
  // else{
  //   console.log('userId is null');
  // }
  console.log("helllooo");
  try {
    const incomes = await Income.find({ userId }).sort({ createdAt: -1 }); // Query incomes for this user
    res.status(200).json({ message: 'Success', data: incomes });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params; // Extract the income ID from the route parameters
  const userId = req.user._id; // Extract the authenticated user's ID

  try {
    // Validate the income ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid income ID format' });
    }

    // Find the income by ID and userId, and delete it
    const deletedIncome = await Income.findByIdAndDelete({ _id: id, userId });

    // If no income is found, return a 404 response
    if (!deletedIncome) {
      return res.status(404).json({ message: 'Income not found or does not belong to the user' });
    }

    // Return a success response
    res.status(200).json({
      message: 'Income deleted successfully',
      data: deletedIncome
    });
  } catch (error) {
    console.error('Error Deleting Income:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};