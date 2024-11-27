import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import NavBar from "../components/NavBar"; // Import NavBar
import Sidebar from "../components/Sidebar"; // Import Sidebar
import { addExpense, getExpenses, deleteExpense } from "../services/api"; // Import Expense API
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await getExpenses();
      const expenses = response.data.data || [];
      console.log(expenses);
      setExpenses(expenses);
      setTotalExpense(expenses.reduce((sum, exp) => sum + exp.amount, 0));
      const monthly = Array(12).fill(0);
      expenses.forEach((exp) => {
        const month = new Date(exp.date).getMonth();
        monthly[month] += exp.amount;
      });
      setMonthlyData(monthly);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleAddExpense = async () => {
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

  const chartData = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Expense",
        data: monthlyData,
        backgroundColor: "rgba(255, 99, 132, 0.7)",
        borderWidth: 1,
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
      <Sidebar sidebarOpen={sidebarOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-24 ${
          sidebarOpen ? "ml-64" : ""
        }`}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-red-700">
          Expense Manager
        </h1>

        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4">
          {/* Add Expense Form */}
          <div
            className={`p-4 rounded-lg shadow-md ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Add Expense
            </h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: parseFloat(e.target.value) || "" })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full p-2 border rounded"
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

          {/* Stats and Chart */}
          <div
            className={`p-4 rounded-lg shadow-md flex flex-col justify-between ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
              <h2 className="text-sm font-semibold">Total Expense</h2>
              <p className="text-xl font-bold">${totalExpense}</p>
            </div>
            <div className="flex-grow">
              <Bar
                data={chartData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </div>
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
              <tr className="bg-red-100">
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Amount</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(expenses) ? (
                expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-red-50">
                    <td className="p-2 border">{exp.title}</td>
                    <td className="p-2 border">
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td className="p-2 border">${exp.amount}</td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500">
                    No expenses found.
                  </td>
                </tr>
              )}
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
