import axios from 'axios';

// Configure Axios instance
const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Replace with your backend's base URL
});

// User APIs
export const saveUser = (data) => API.post('/user', data); // Save new user
export const getUser = (email) => API.get(`/user/${email}`); // Get user by email
export const signup = (data) => API.post('/signup', data); // User signup
export const login = (data) => API.post('/login', data); // User login
export const updateUserProfile = (userId, updatedData) => API.put(`/users/${userId}`, updatedData); // Update user

// Income APIs
export const addIncome = (data) => API.post('/add-income', data); // Add new income
export const getIncomes = () => API.get('/get-incomes'); // Get all incomes
export const deleteIncome = (id) => API.delete(`/delete-income/${id}`); // Delete income by ID

// Expense APIs
export const addExpense = (data) => API.post('/add-expense', data); // Add new expense
export const getExpenses = () => API.get('/get-expense'); // Get all expenses
export const deleteExpense = (id) => API.delete(`/delete-expense/${id}`); // Delete expense by ID
