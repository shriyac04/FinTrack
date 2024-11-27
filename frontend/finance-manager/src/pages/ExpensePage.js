import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import NavBar from "../components/NavBar"; // Import NavBar
import Sidebar from "../components/Sidebar"; // Import Sidebar
import { addExpense, getUserExpenses, deleteExpense } from "../services/api"; // Import Expense API
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [categoryData, setCategoryData] = useState({});
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });
  const [filterDate, setFilterDate] = useState(""); // State for filtering data
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  useEffect(() => {
    fetchExpenses();
  }, [filterDate]); // Re-fetch data when the filter date changes

  const fetchExpenses = async () => {
    try {
      const response = await getUserExpenses();
      const allExpenses = response.data.data || [];
      
      // Filter expenses based on the selected filterDate (if any)
      const filteredExpenses = filterDate
        ? allExpenses.filter((exp) => {
            const expenseDate = new Date(exp.date).toISOString().slice(0, 7);
            return expenseDate === filterDate;
          })
        : allExpenses;

      setExpenses(filteredExpenses);

      // Calculate total expenses
      const total = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalExpense(total);

      // Prepare category data for the Pie chart
      const categories = {};
      filteredExpenses.forEach((exp) => {
        categories[exp.category] = (categories[exp.category] || 0) + exp.amount;
      });
      setCategoryData(categories);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.amount ||
      !form.date ||
      !form.category ||
      !form.description
    ) {
      alert("All fields are required");
      return;
    }
    try {
      await addExpense(form);
      setForm({
        title: "",
        amount: "",
        date: "",
        category: "",
        description: "",
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div
      className={`relative min-h-screen transition-all duration-500 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* NavBar */}
      <NavBar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} isDarkMode={isDarkMode} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-24 ${
          sidebarOpen ? "ml-64" : ""
        }`}
      >
        <h1
          className={`text-2xl font-bold text-center mb-6 ${
            isDarkMode ? "text-red-400" : "text-red-700"
          }`}
        >
          Expense Manager
        </h1>

        {/* Filter and Pie Chart Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 px-4">
          {/* Add Expense Form */}
          <div
            className={`p-4 rounded-lg shadow-md ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-semibold mb-4 text-red-600">
              Add Expense
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={`w-full p-2 border rounded ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) || "" })
                }
                className={`w-full p-2 border rounded ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={`w-full p-2 border rounded ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`w-full p-2 border rounded ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className={`w-full p-2 border rounded ${
                  isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                }`}
              />
              <button
                type="button"
                onClick={handleAddExpense}
                className="w-full bg-red-600 text-white py-2 rounded"
              >
                Add Expense
              </button>
            </form>
          </div>

          {/* Pie Chart Section */}
          <div
            className={`p-4 rounded-lg shadow-md flex flex-col items-center ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-semibold text-center mb-4">
              Category Breakdown
            </h2>
            <input
              type="month"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className={`w-full mb-4 p-2 border rounded ${
                isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            />
            <div className="w-full max-w-xs h-56">
              <Pie
                data={pieChartData}
                options={{
                  plugins: {
                    legend: {
                      labels: {
                        color: isDarkMode ? "white" : "black",
                      },
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </div>

          {/* Total Expense */}
          <div
            className={`p-4 rounded-lg shadow-md flex flex-col justify-center items-center ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-semibold mb-2 text-red-600">
              Total Expense
            </h2>
            <p className="text-3xl font-bold">₹{totalExpense}</p>
          </div>
        </div>

        {/* Expense Records */}
        <div
          className={`p-4 rounded-lg shadow-md mx-4 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <h2 className="text-lg font-semibold mb-4 text-red-600">
            Expense Records
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className={`${isDarkMode ? "bg-gray-700" : "bg-red-100"}`}>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp._id}
                  className={`hover:${
                    isDarkMode ? "bg-gray-600" : "bg-red-50"
                  }`}
                >
                  <td className="p-2 border">{exp.title}</td>
                  <td className="p-2 border">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">₹{exp.amount}</td>
                  <td className="p-2 border">{exp.category}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDeleteExpense(exp._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {expenses.length === 0 && (
            <p className="text-center text-gray-500 mt-4">
              No expense records found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensePage;
