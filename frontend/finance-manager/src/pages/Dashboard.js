import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Doughnut, Pie } from "react-chartjs-2";
import { getIncomes, getExpenses, userData, getUserIncomes, getUserExpenses } from "../services/api";
import { FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  // const user = location.state?.user || { name: 'Guest', createdYear: 'Unknown' };

  const [user, setUser] = useState(null); // State to store user data
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState();
  const [editableName, setEditableName] = useState();

  useEffect(() => {
    console.log("re rendered");
    fetchData();
  },[]);

  const fetchData = async () => {
    try {
      const userResponse = await userData();
      const userInfo = userResponse.data.user;
      setUser(userInfo); // Set user data in state
      setEditableName(userInfo.name); // Set editable name
      console.log("User Data:", userInfo);
      setUserName(userInfo.name);
      setEditableName(userInfo.name);

      const incomeResponse = await getUserIncomes();
      const expenseResponse = await getUserExpenses();
        // console.log("income Response",incomeResponse);
        // console.log("expense response",expenseResponse);
        const idata = incomeResponse.data.data  || [];
        const edata = expenseResponse.data.data || [];
        setIncomes(idata);
        setTotalIncome((idata.reduce((sum, exp) => sum + exp.amount, 0)));
        setTotalExpense((edata.reduce((sum, exp) => sum + exp.amount, 0)));
        setExpenses(edata);
            // setTotalIncome(idata.reduce((sum, inc) => sum + inc.amount, 0));
    //   setIncomes(incomeResponse.data.data.amount || []);
    //   setExpenses(expenseResponse.data.data.amount || []);    
    //   calculateTotals(
    //     idata || [],
    //     edata || []
    //   );
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // const calculateTotals = (incomes, expenses) => {
  //     const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  //     const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  //     setTotalIncome(totalIncome);
  //     setTotalExpense(totalExpense);
  // };

  const calculateTotals = (incomes , expenses) => {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpense = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      
    );
    setTotalIncome(totalIncome);
    setTotalExpense(totalExpense);
  };

  const expenseCategories = (expenses || []).reduce((categories, expense) => {
    const { category, amount } = expense;
    categories[category] = (categories[category] || 0) + amount;
    return categories;
  }, {});

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/");
  };

  const saveName = async () => {
    try {
        // setUser((prevUser) => ({ ...prevUser, name: editableName })); // Update user state
        setIsEditing(false);
    } catch (error) {
        console.error('Error saving name:', error);
    }
};


  const getCardStyles = (type) => {
    const styles = {
      light: {
        income: { backgroundColor: "#28A745", color: "white" },
        expense: { backgroundColor: "#DC3545", color: "white" },
        balance: { backgroundColor: "#007BFF", color: "white" },
      },
      dark: {
        income: { backgroundColor: "#218838", color: "white" },
        expense: { backgroundColor: "#C82333", color: "white" },
        balance: { backgroundColor: "#0056B3", color: "white" },
      },
    };
    return isDarkMode ? styles.dark[type] : styles.light[type];
  };

  const doughnutData = {
    labels: ["Incomes", "Expenses"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#4CAF50", "#FF5252"],
        hoverOffset: 4,
      },
    ],
  };
  // console.log(expenses); // Debug: Check if `expenses` is defined and an array
  // const expenseCategories = expenses.reduce((categories, expense) => {
  //     const { category, amount } = expense;
  //     categories[category] = (categories[category] || 0) + amount;
  //     return categories;
  // }, {});

  const pieData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
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
      className={`dashboard relative min-h-screen transition-all duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 w-full bg-[#23275e] text-white flex items-center justify-between px-6 py-3 shadow-md z-30">
        {/* Sidebar Toggle and Website Name */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-[#23275e] text-white rounded-full shadow-lg focus:outline-none hover:bg-blue-800 transition duration-200 transform hover:scale-105"
          >
            {sidebarOpen ? "✖" : "☰"}
          </button>
          <h1 className="text-xl font-bold">FinTrack</h1>
        </div>

        {/* Dark Mode Toggle with Icons */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
              <div className="absolute flex items-center justify-center w-5 h-5 top-[2px] left-[2px] peer-checked:left-[22px] transition-all">
                {isDarkMode ? (
                  <FaMoon className="text-blue-600" />
                ) : (
                  <FaSun className="text-yellow-500" />
                )}
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-full bg-[#23275e] text-white shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-20`}
        style={{ width: "250px" }}
      >
        <ul className="p-4 space-y-4 flex flex-col h-full">
          <li
            className="cursor-pointer hover:bg-gray-700 p-2 rounded-md transition transform hover:scale-105"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </li>
          <li
            className="cursor-pointer hover:bg-gray-700 p-2 rounded-md transition transform hover:scale-105"
            onClick={() => navigate("/income")} // Correct placement of onClick
          >
            Incomes
          </li>
          <li
            className="cursor-pointer hover:bg-gray-700 p-2 rounded-md transition transform hover:scale-105"
            onClick={() => navigate("/expense")} // Correct placement of onClick
          >
            Expenses
          </li>
          {/* Spacer to push logout to the bottom */}
          <li className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Content Section */}
      <div
        className={`transition-all duration-300 pt-24 ${
          sidebarOpen ? "ml-64" : ""
        }`}
      >
        {/* Profile Section */}
        <div
          className={`profile flex items-center p-6 rounded-lg shadow-md mx-6 mb-6 ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
          }`}
        >
          <div className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full shadow">
            <FaUserCircle className="text-5xl text-blue-500 filter grayscale" />
          </div>
          <div className="ml-6">
            {isEditing ? (
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className="p-2 border rounded-md flex-grow"
                />
                <button
                  onClick={saveName}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p>Member since {user?.createdAt || "N/A"}</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
          <div
            className="p-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            style={getCardStyles("income")}
          >
            <h2 className="text-lg font-bold">Total Income</h2>
            <p className="text-4xl font-extrabold mt-2">₹{totalIncome}</p>
          </div>
          <div
            className="p-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            style={getCardStyles("expense")}
          >
            <h2 className="text-lg font-bold">Total Expense</h2>
            <p className="text-4xl font-extrabold mt-2">₹{totalExpense}</p>
          </div>
          <div
            className="p-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
            style={getCardStyles("balance")}
          >
            <h2 className="text-lg font-bold">Balance</h2>
            <p className="text-4xl font-extrabold mt-2">
            ₹{totalIncome - totalExpense}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          <div className="p-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-lg font-bold mb-4">Income vs Expenses</h3>
            <Doughnut data={doughnutData} />
          </div>
          <div className="p-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg">
            <h3 className="text-lg font-bold mb-4">Expense Breakdown</h3>
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
