const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions'); // Transactions Routes
const userRoutes = require('./routes/user'); // User Authentication Routes

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', userRoutes); // User Routes
app.use('/api', transactionRoutes); // Transactions Routes

// Server Start
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
