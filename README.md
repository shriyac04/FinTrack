# FinTrack - Finance Manager Website

## Overview

FinTrack is a comprehensive finance management application designed to help users manage their income and expenses efficently. Built using modern web technologies,FinTrack offers an intutive interface and robust backend features,enabling users to track their finances with ease. 

- **Tech Stack:**
  * Frontend: React.js (CRA- Create React App)
  * Backend:  Express.js
  * Database: MongoDB
  * API Testing: Postman

** Features: **
**1. User Authentication:**
 * Secure login and signup system using encryption (e.g., bcrypt for hashing passwords).
  * JWT-based token authentication for secure session management.
    
 **2. Income and Expense Tracking:**
 * Add, edit, or delete income and expense records.
  * Categorize transactions for better financial insights.
    
**3. Dashboard:**
 * Visual representation of finances using charts and tables.
 * Monthly and yearly summaries for easy analysis.
   
 **4. Data Persistence:**
* Transactions are securely stored in MongoDB for easy retrieval and updates.
  
 **5. Responsive Design:**
 * User-friendly interface optimized for both desktop and mobile devices.
   
  **6. Error Handling and Validation:**
    *Input validation for user data using Joi or similar libraries.
    *Centralized error handling for smooth user experience.

 ## Installation and Setup
**Prerequisites**
* Node.js (v16 or later)
* MongoDB (local or cloud-based, e.g., MongoDB Atlas)
* Postman (for testing API endpoints)

**Steps to Run the Application**
**1.Clone the repository:**
```c
git clone https://github.com/your-username/fintrack.git
```
```c
cd fintrack
```
**Install dependencies for the backend:**
```c
cd backend
```
```c
npm install
```

**Set up environment variables:**
Create a .env file in the backend folder with the following keys:

PORT=Port_no
MONGO_URI=your-momgodb-url
JWT_SECRET=your-secret-key

**Start the backend server:**
```c
npm start
```
**Install dependencies for the frontend:**

```c
cd ../frontend
```
```c
npm install
```
**Start the React development server:**
```c
npm start
```
**Open the app in your browser:**


http://localhost:Port_no

**API Endpoints (Tested with Postman)**

**User Routes:**

- POST /api/users/signup – Register a new user.
- POST /api/users/login – Authenticate a user.
**Transaction Routes:**
- GET /api/incomes – Fetch all user's income.
- POST /api/add-income – Add a new income.
- DELETE /api/delete-income/:id – Remove an income.
- GET /api/expenses – Fetch all expenses.
- POST /api/add-expense – Add a new transaction.
- DELETE /api/delete-expense/:id – Remove a transaction.


## About The Developer 
This project was created as a learning experience to explore modern web development practices. Building FinTrack helped me improve my skills in full-stack development and understand the nuances of creating robust, secure applications.

