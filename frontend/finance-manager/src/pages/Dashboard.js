import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Doughnut, Pie } from "react-chartjs-2";
import { getIncomes, getExpenses, userData, getUserIncomes, getUserExpenses, addBudget, updateBudget, getBudget } from "../services/api";
import { FaUserCircle, FaSun, FaMoon } from "react-icons/fa";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { format } from 'date-fns';
import paisaHai from "../images/paisaHai.png"
import saveMoney from "../images/saveMoney.png"
ChartJS.register(ArcElement, Tooltip, Legend);




function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  // const user = location.state?.user || { name: 'Guest', createdYear: 'Unknown' };
  const [budget, setBudget] = useState(0); 
  const [feedback, setFeedback] = useState("");
  const [user, setUser] = useState(null); // State to store user data
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState();
  const [editableName, setEditableName] = useState();

  useEffect(() => {
    console.log("re rendered");
    fetchData();
  },[]);

//   useEffect(() => {
// const response=  addBudget(budget);

//   },budget);

useEffect(() => {
  fetchBudget(); // Fetch budget when the component mounts
  console.log("triggered budget");
  
}, []);

const fetchBudget = async () => {
  try {
    const response = await getBudget(); // Call the API to get the budget
    setBudget(response.data.budget); // Update the state with the fetched budget
  } catch (error) {
    console.error("Error fetching budget:", error.response?.data || error.message);
  }
};




  const fetchData = async () => {
  try {
    const userResponse = await userData();
    const userInfo = userResponse.data.user;
    setUser(userInfo); 
    setEditableName(userInfo.name);

    const incomeResponse = await getUserIncomes();
    const expenseResponse = await getUserExpenses();

    const allIncomes = incomeResponse.data.data || [];
    const allExpenses = expenseResponse.data.data || [];

    // Filter data by currentYear
    const filteredIncomes = allIncomes.filter(
      (income) => new Date(income.date).getFullYear() === currentYear
    );
    const filteredExpenses = allExpenses.filter(
      (expense) => new Date(expense.date).getFullYear() === currentYear
    );

    setIncomes(filteredIncomes);
    setExpenses(filteredExpenses);
    setTotalIncome(filteredIncomes.reduce((sum, income) => sum + (income.amount || 0), 0));
    setTotalExpense(filteredExpenses.reduce((sum, expense) => sum + (expense.amount || 0), 0));
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

  useEffect(() => {
    fetchData();
  }, [currentYear]); // Refetch data when currentYear changes
  



  

  // const calculateTotals = (incomes, expenses) => {
  //     const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  //     const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  //     setTotalIncome(totalIncome);
  //     setTotalExpense(totalExpense);
  // };
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
      const interval = setInterval(() => {
          setCurrentTime(new Date());
      }, 1000); // Update time every second

      return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  // Format time and date
  const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formattedDate = currentTime.toLocaleDateString();





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
    navigate("/login");
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
  useEffect(() => {
    // Update feedback based on budget utilization
    if (totalExpense > budget) {
      setFeedback("You are over budget!");
    } else {
      setFeedback("You are within your budget!");
    }
  }, [budget, totalExpense]);

  const handleBudgetChange = (e) => {
    console.log(e);
    
    setBudget(e.target.value);
  };



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

        {/* Live Clock and Date  with toggle*/}
        <div className="flex items-center space-x-6">
                <div className="flex flex-col items-end">
                    <span className="text-sm font-medium">{formattedDate}</span>
                    <span className="text-lg font-bold">{formattedTime}</span>
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
                <p>Member since {user?.createdAt ? format(new Date(user.createdAt), 'yyyy-MM-dd') : "N/A"}</p>
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

        <div className="p-6 flex items-center justify-end space-x-4">
  <label htmlFor="year-select" className="text-lg font-semibold"
  
  >
    Select Year:
  </label>
  <select
  id="year-select"
  value={currentYear}
  onChange={(e) => setCurrentYear(parseInt(e.target.value, 10))}
  className={`p-2 border rounded-md ${
    isDarkMode
      ? "bg-black text-white border-gray-700"
      : "bg-white text-black border-gray-300"
  }`}
>
  {Array.from({ length: 10 }, (_, i) => (
    <option key={i} value={new Date().getFullYear() - i}>
      {new Date().getFullYear() - i}
    </option>
  ))}
</select>

</div>
{/* Charts Section */}

<div className="flex flex-wrap justify-center">
  {/* Income vs Expenses Chart */}
  <div
    className="p-5 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
    style={{
      maxWidth: "400px",
      height: "400px",
      overflow: "hidden",
      marginRight: "20px",
    }}
  >
    <h3 className="text-md font-bold mb-2">Income vs Expenses</h3>
    <Doughnut
      data={doughnutData}
      options={{
        maintainAspectRatio: true,
        responsive: true,
      }}
      style={{
        maxHeight: "350px",
        maxWidth: "350px",
        margin: "0 auto",
      }}
    />
  </div>

  {/* Expense Breakdown */}
  <div
    className="p-5 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg"
    style={{
      maxWidth: "400px",
      height: "400px",
      overflow: "hidden",
    }}
  >
    <h3 className="text-md font-bold mb-2">Expense Breakdown</h3>
    <Pie
      data={pieData}
      options={{
        maintainAspectRatio: true,
        responsive: true,
      }}
      style={{
        maxHeight: "350px",
        maxWidth: "350px",
        margin: "0 auto",
      }}
    />
  </div>


{/* Budget and Balance Updates Section */}
<div className="flex flex-wrap gap-x-4 justify-between p-4">
  {/* Budget Card */}
  <div
    className={`p-6 w-80 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg ${
      isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
    }`}
  >
    <h2 className="text-lg font-bold mb-4 text-orange-600">Budget Manager</h2>
    <p className="mb-2 text-lg">
      Total Expenses: <span className="font-bold">₹{totalExpense}</span>
    </p>
    <input
      type="range"
      min="1000"
      max="100000"
      step="500"
      value={budget}
      onChange={(e) => {setBudget(parseFloat(e.target.value))}}
      onMouseUp={async () => {
        try {
          const response = await updateBudget({budget}); // Call your API to save the budget
          console.log("Budget saved:", response.data);
        } catch (error) {
          console.error("Error saving budget:", error);
        }
      }}
      className="w-full mb-4"
    />
    <p className="mb-4 text-lg">
      Current Budget: <span className="font-bold">₹{budget}</span>
    </p>
    <div
      className={`p-2 rounded ${
        totalExpense > budget ? "bg-red-500 text-white" : "bg-green-500 text-white"
      }`}
    >
      {feedback}
    </div>
    <div className="flex justify-center items-center">
      <img src={totalExpense > budget ? saveMoney : paisaHai} alt="" className="h-40 p-5"/>
    </div>
  </div>

{/* Balance Updates Card */}
{/* Balance Updates Card */}
<div
  className={`p-6 rounded-lg shadow-md transition-transform duration-300 transform hover:scale-105 hover:shadow-lg ${
    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
  } w-80`}
>
  <h2 className="text-lg font-bold mb-4 text-blue-600">
    Balance Updates
  </h2>
  <ul
    className="max-h-72 overflow-y-auto space-y-4 scrollbar-hidden px-2"
    style={{
      scrollbarWidth: "none", // For Firefox
      msOverflowStyle: "none", // For Internet Explorer
      paddingRight: "10px", // Create space between elements and the scrollbar
    }}
  >
    {expenses.map((expense, index) => (
      <li
        key={`expense-${index}`}
        className="flex justify-between items-center p-2 bg-red-100 rounded-lg shadow-sm"
      >
        <span className="text-red-600 font-bold">- ₹{expense.amount}</span>
        <span className="text-gray-600 text-sm italic">{expense.title}</span>
      </li>
    ))}
    {incomes.map((income, index) => (
      <li
        key={`income-${index}`}
        className="flex justify-between items-center p-2 bg-green-100 rounded-lg shadow-sm"
      >
        <span className="text-green-600 font-bold">+ ₹{income.amount}</span>
        <span className="text-gray-600 text-sm italic">{income.title}</span>
      </li>
    ))}
  </ul>
</div>


</div>










</div>






      </div>
      
    </div>
  );
}

export default Dashboard;
