import axios from 'axios';

// Configure Axios instance
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Replace with your backend's base URL
  withCredentials:true
});

// Add Authorization Header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const signup = (data) => API.post('/signup', data);
export const login = (data) => API.post('/login', data);
export const userData = () => API.get('/profile')
// Income APIs
export const addIncome = (data) => API.post('/add-income', data);
export const getIncomes = () => API.get('/incomes');
export const deleteIncome = (id) => API.delete(`/incomes/${id}`);
export const getUserIncomes = () => API.get('/incomes');

// Expense APIs
export const addExpense = (data) => API.post('/add-expense', data);
export const getExpenses = () => API.get('/get-expenses');
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getUserExpenses = () => API.get('/expenses');
