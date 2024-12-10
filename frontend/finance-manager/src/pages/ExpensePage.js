import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { addExpense, getUserExpenses, deleteExpense } from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { saveAs } from "file-saver";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpensePage = () => {
  const [deleteMode, setDeleteMode] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [form, setForm] = useState({
    title: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });
  const [customTag, setCustomTag] = useState({ title: "", amount: "" });
  const [tags, setTags] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [totalExpense, setTotalExpense] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedPreference = localStorage.getItem('darkMode');
    return savedPreference === 'true'; // Convert string to boolean
});
  const [searchQuery, setSearchQuery] = useState("");

  const commonExpenses = [
    { title: "Rent", amount: 20000, category: "Housing", description: "Monthly house rent" },
    { title: "Groceries", amount: 5000, category: "Food", description: "Monthly groceries" },
    { title: "Transportation", amount: 3000, category: "Travel", description: "Daily commute" },
  ];

  const [filteredCommonExpenses, setFilteredCommonExpenses] = useState(commonExpenses);

  useEffect(() => {
    fetchExpenses();
  }, [filterDate]);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
}, [isDarkMode]);


  const fetchExpenses = async () => {
    try {
      const response = await getUserExpenses();
      const allExpenses = response.data.data || [];
      const filteredByDate = filterDate
        ? allExpenses.filter(
            (exp) => new Date(exp.date).toISOString().slice(0, 7) === filterDate
          )
        : allExpenses;

      setExpenses(filteredByDate);
      setFilteredExpenses(filteredByDate);

      const total = filteredByDate.reduce((sum, exp) => sum + exp.amount, 0);
      setTotalExpense(total);

      const categories = {};
      filteredByDate.forEach((exp) => {
        categories[exp.category] =
          (categories[exp.category] || 0) + exp.amount;
      });
      setCategoryData(categories);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleAddExpense = async (data) => {
    console.log(data);
    
    if (
      !data.title ||
      !data.amount ||
      !data.date ||
      !data.category ||
      !data.description
    ) {
      alert("All fields are required");
      return;
    }
    try {
      await addExpense(data);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = expenses.filter(
      (exp) =>
        exp.title.toLowerCase().includes(query.toLowerCase()) ||
        exp.category.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredExpenses(filtered);
  };

  const handleAddCustomTag = () => {
    const { title, amount } = customTag;
    if (title.trim() && amount > 0) {
      setTags([...tags, customTag]);
      setCustomTag({ title: "", amount: "" });
    } else {
      alert("Please provide both a valid title and amount for the custom tag.");
    }
  };

  const handleTagClick = (tag) => {
    const today = new Date().toISOString().split("T")[0];
    const newExpense = {
      title: tag.title,
      amount: parseFloat(tag.amount),
      date: today,
      category: "Custom",
      description: "Added from custom tag",
    };
    handleAddExpense(newExpense);
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
      <NavBar
        isDarkMode={isDarkMode}
        setIsDarkMode={() => setIsDarkMode((prevMode) => !prevMode)}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      <Sidebar sidebarOpen={sidebarOpen} isDarkMode={isDarkMode} />

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


            <select
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const selectedExpense = expenses.find((exp) => exp._id === selectedId);
                  if (selectedExpense) {
                    setForm({
                      ...form,
                      title: selectedExpense.title,
                      amount: selectedExpense.amount,
                      category: selectedExpense.category,
                      description: selectedExpense.description,
                    });
                  }
                }}
                className={`w-full p-2 border rounded mb-4 ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
                }`}
              >
                <option value="">Select an Existing Expense</option>
                {filteredExpenses.map((exp) => (
                  <option key={exp._id} value={exp._id}>
                    {exp.title} - ₹{exp.amount}
                  </option>
                ))}
              </select>





              {["Title", "Amount", "Date", "Category", "Description"].map(
                (field) => (
                  <input
                    key={field}
                    type={field === "Amount" ? "number" : field === "Date" ? "date" : "text"}
                    placeholder={field}
                    value={form[field.toLowerCase()]}
                    onChange={(e) =>
                      setForm({ ...form, [field.toLowerCase()]: e.target.value })
                    }
                    className={`w-full p-2 border rounded ${
                      isDarkMode ? "bg-gray-700 text-white" : "bg-white text-black"
                    }`}
                  />
                )
              )}
              <button
                type="button"
                onClick={() => handleAddExpense(form)}
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

        
{/* Common Expenses */}
<div
    className={`p-4 rounded-lg shadow-md relative ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    }`}
>
    {/* Trash Icon to Enable Delete Mode */}
    <button
        className={`absolute top-2 right-2 p-2 rounded-full ${
            isDarkMode
                ? "bg-red-700 hover:bg-red-600 text-white"
                : "bg-red-500 hover:bg-red-400 text-white"
        }`}
        onClick={() => {
            // Toggle delete mode on/off
            setDeleteMode((prev) => !prev);
        }}
    >
        🗑️ {/* Trash Icon */}
    </button>

    <h2 className="text-lg font-semibold text-red-600 mb-4">Common Expenses</h2>
    {/* Combined Tags (Pre-existing + Custom) */}
    <ul className="space-y-3">
        {/* Render Pre-existing Tags */}
        {commonExpenses.map((expense, index) => (
            <li
                key={index}
                className={`p-2 rounded-lg border flex justify-between items-center cursor-pointer ${
                    isDarkMode
                        ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                        : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => {
                    if (!deleteMode) {
                        const today = new Date().toISOString().split("T")[0]; // Add today's date
                        handleAddExpense({
                            ...expense,
                            date: today,
                        });
                    }
                }}
            >
                <div>
                    <div className="flex justify-between">
                        <span>{expense.title}</span>
                        <span>₹{expense.amount}</span>
                    </div>
                    <p className="text-sm text-gray-500">{expense.description}</p>
                </div>
                {/* Show '-' button only in delete mode */}
                {deleteMode && (
                    <button
                        className={`ml-2 p-1 rounded text-xs ${
                            isDarkMode
                                ? "bg-red-700 hover:bg-red-600 text-white"
                                : "bg-red-500 hover:bg-red-400 text-white"
                        }`}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the main click
                            const updatedCommonExpenses = commonExpenses.filter(
                                (_, i) => i !== index
                            );
                            setFilteredCommonExpenses(updatedCommonExpenses); // Update filtered common expenses
                        }}
                    >
                        -
                    </button>
                )}
            </li>
        ))}

        {/* Render Custom Tags */}
        {tags.map((tag, index) => (
            <li
                key={index}
                className={`p-2 rounded-lg border flex justify-between items-center cursor-pointer ${
                    isDarkMode
                        ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                        : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => {
                    if (!deleteMode) {
                        const today = new Date().toISOString().split("T")[0]; // Automatically set today's date
                        handleAddExpense({
                            title: tag.title,
                            amount: tag.amount,
                            date: today,
                            category: tag.category,
                            description: tag.description,
                        });
                    }
                }}
            >
                <div>
                    <div className="flex justify-between">
                        <span>{tag.title}</span>
                        <span>₹{tag.amount}</span>
                    </div>
                    <p className="text-sm text-gray-500">{tag.description}</p>
                </div>
                {/* Show '-' button only in delete mode */}
                {deleteMode && (
                    <button
                        className={`ml-2 p-1 rounded text-xs ${
                            isDarkMode
                                ? "bg-red-700 hover:bg-red-600 text-white"
                                : "bg-red-500 hover:bg-red-400 text-white"
                        }`}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering the main click
                            const updatedTags = tags.filter((_, i) => i !== index);
                            setTags(updatedTags); // Update custom tags
                        }}
                    >
                        -
                    </button>
                )}
            </li>
        ))}
    </ul>

    {/* Custom Tag Section */}
    <div className="mt-4">
        <div className="flex items-center mb-4">
            {/* Dropdown to Select Existing Expense */}
            <select
                value={customTag?.id || ""} // Bind value to the selected expense's _id
                onChange={(e) => {
                    const selectedExpense = expenses.find(
                        (exp) => exp._id === e.target.value
                    ); // Find the selected expense
                    if (selectedExpense) {
                        setCustomTag({
                            id: selectedExpense._id, // Save _id for proper selection tracking
                            title: selectedExpense.title, // Set title as the selected value
                            category: selectedExpense.category,
                            amount: selectedExpense.amount,
                            description: selectedExpense.description, // Add description
                        });
                    }
                }}
                className={`w-full p-2 border rounded ${
                    isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-300"
                }`}
            >
                <option value="">Select an Expense</option> {/* Default option */}
                {expenses.map((exp) => (
                    <option key={exp._id} value={exp._id}>
                        {exp.title} - ₹{exp.amount}
                    </option>
                ))}
            </select>

            {/* Add Tag Button */}
            <button
                onClick={() => {
                    if (customTag.title) {
                        setTags([...tags, customTag]); // Add selected expense as a new tag
                        setCustomTag({
                            title: "",
                            category: "",
                            amount: "",
                            description: "",
                        }); // Reset after adding
                    } else {
                        alert("Please select an expense from the dropdown.");
                    }
                }}
                className={`ml-2 p-2 rounded ${
                    isDarkMode
                        ? "bg-blue-700 hover:bg-blue-600 text-white"
                        : "bg-blue-500 hover:bg-blue-400 text-white"
                }`}
            >
                +
            </button>
        </div>
    </div>
</div>


        <div
          className={`p-4 rounded-lg shadow-md mx-4 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-red-600">
              Expense Records
            </h2>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Search by title or category"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className={`p-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                }`}
              />
              <button
                onClick={() => {
                  const csvContent = [
                    ["Title", "Date", "Amount", "Category", "Description"],
                    ...expenses.map((exp) => [
                      exp.title,
                      new Date(exp.date).toLocaleDateString(),
                      exp.amount,
                      exp.category,
                      exp.description,
                    ]),
                  ]
                    .map((row) => row.join(","))
                    .join("\n");

                  const blob = new Blob([csvContent], {
                    type: "text/csv;charset=utf-8;",
                  });
                  saveAs(blob, "expense_statement.csv");
                }}
                className={`p-2 rounded ${
                  isDarkMode
                    ? "bg-green-700 hover:bg-green-600 text-white"
                    : "bg-green-500 hover:bg-green-400 text-white"
                }`}
              >
                Download Statement
              </button>
            </div>
          </div>
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
              {filteredExpenses.map((exp) => (
                <tr key={exp._id}>
                  <td className="p-2 border">{exp.title}</td>
                  <td className="p-2 border">
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">₹{exp.amount}</td>
                  <td className="p-2 border">{exp.category}</td>
                  <td className="p-2 border">
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
          {filteredExpenses.length === 0 && (
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
