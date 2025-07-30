import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { addIncome, getIncomes, deleteIncome } from "../services/api";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { saveAs } from "file-saver";

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomePage = () => {
    const [deleteMode, setDeleteMode] = useState(false);
    const [income, setIncome] = useState([]);
    const [filteredIncome, setFilteredIncome] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [form, setForm] = useState({ title: "", amount: "", date: "", category: "", description: "" });
    const [customTag, setCustomTag] = useState({ title: "", amount: "" });
    const [tags, setTags] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // const [isDarkMode, setIsDarkMode] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedPreference = localStorage.getItem('darkMode');
        return savedPreference === 'true'; // Convert string to boolean
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [commonSearchQuery, setCommonSearchQuery] = useState("");

    const commonIncomes = [
        { title: "Monthly Salary", amount: 5000, category: "Salary", description: "Regular monthly salary" },
        { title: "Freelance Work", amount: 2000, category: "Freelance", description: "Income from freelance projects" },
        { title: "Investment Returns", amount: 1500, category: "Investment", description: "Returns from investments" },
    ];

    const [filteredCommonIncomes, setFilteredCommonIncomes] = useState(commonIncomes);

    useEffect(() => {
        fetchIncomes();
    }, []);

    useEffect(() => {
        localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);
    
    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    const fetchIncomes = async () => {
        try {
            const response = await getIncomes();
            const incomes = response.data.data || [];
            setIncome(incomes);
            setFilteredIncome(incomes);

            // Populate category data for the pie chart
            const categories = {};
            incomes.forEach((inc) => {
                categories[inc.category] = (categories[inc.category] || 0) + inc.amount;
            });
            setCategoryData(categories);
        } catch (error) {
            console.error("Error fetching incomes:", error);
        }
    };

    const handleAddIncome = async (data) => {
        if (!data.title || !data.amount || !data.date || !data.category || !data.description) {
            alert("All fields are required");
            return;
        }
        try {
            await addIncome(data);
            fetchIncomes();
        } catch (error) {
            console.error("Error adding income:", error);
        }
    };

    const handleDeleteIncome = async (id) => {
        try {
            await deleteIncome(id);
            fetchIncomes();
        } catch (error) {
            console.error("Error deleting income:", error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        const filtered = income.filter((inc) =>
            inc.title.toLowerCase().includes(query.toLowerCase()) ||
            inc.category.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredIncome(filtered);
    };

    const handleCommonSearch = (query) => {
        setCommonSearchQuery(query);
        const filtered = commonIncomes.filter((inc) =>
            inc.title.toLowerCase().includes(query.toLowerCase()) ||
            inc.category.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCommonIncomes(filtered);
    };

    const handleDownloadStatement = () => {
        const csvContent = [
            ["Title", "Date", "Amount", "Category", "Description"],
            ...income.map((inc) => [
                inc.title,
                new Date(inc.date).toLocaleDateString(),
                inc.amount,
                inc.category,
                inc.description,
            ]),
        ]
            .map((e) => e.join(","))
            .join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "income_statement.csv");
    };

    const handleDropdownSelect = (event) => {
        const selectedId = event.target.value;
        const selectedIncome = income.find((inc) => inc._id === selectedId);
        if (selectedIncome) {
            setForm({
                ...form,
                title: selectedIncome.title,
                amount: selectedIncome.amount,
                category: selectedIncome.category,
                description: selectedIncome.description,
            });
        }
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
        const newIncome = {
            title: tag.title,
            amount: parseFloat(tag.amount),
            date: today,
            category: "Custom",
            description: "Added from custom tag",
        };
        handleAddIncome(newIncome);
    };

    const pieChartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
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
                setIsDarkMode={toggleDarkMode}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                sidebarOpen={sidebarOpen}
            />

            <Sidebar sidebarOpen={sidebarOpen} />

            <div className={`transition-all duration-300 pt-24 ${sidebarOpen ? "ml-64" : ""}`}>
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Income Manager</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 px-4">
                    {/* Add Income Form */}
                    <div
                        className={`p-4 rounded-lg shadow-md ${
                            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                        }`}
                    >
                        <h2 className="text-lg font-semibold text-blue-600 mb-4">Add Income</h2>
                        <form>
                            <select
                                onChange={handleDropdownSelect}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-100 border-gray-300"
                                }`}
                            >
                                <option value="">Select an Existing Income</option>
                                {filteredIncome.map((inc) => (
                                    <option key={inc._id} value={inc._id}>
                                        {inc.title} - ₹{inc.amount}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-100 border-gray-300"
                                }`}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || "" })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-100 border-gray-300"
                                }`}
                            />
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-100 border-gray-300"
                                }`}
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-100 border-gray-300"
                                }`}
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? "bg-gray-700 border-gray-600 text-white"
                                        : "bg-gray-100 border-gray-300"
                                }`}
                            />
                            <button
                                type="button"
                                onClick={() => handleAddIncome(form)}
                                className={`w-full p-2 rounded ${
                                    isDarkMode
                                        ? "bg-blue-700 text-white hover:bg-blue-600"
                                        : "bg-blue-500 text-white hover:bg-blue-400"
                                }`}
                            >
                                Add Income
                            </button>
                        </form>
                    </div>

{/* Common Income Section */}
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

    <h2 className="text-lg font-semibold text-blue-600 mb-4">Common Income</h2>
    {/* Combined Tags (Pre-existing + Custom) */}
    <ul className="space-y-3">
        {/* Render Pre-existing Tags */}
        {commonIncomes.map((income, index) => (
            <li
                key={index}
                className={`p-2 rounded-lg border flex justify-between items-center cursor-pointer ${
                    isDarkMode
                        ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
                        : "bg-gray-100 text-black border-gray-300 hover:bg-gray-200"
                }`}
                onClick={() => {
                    if (!deleteMode) {
                        // Add income logic when not in delete mode
                        handleAddIncome({
                            ...income,
                            date: new Date().toISOString().split("T")[0], // Add today's date
                        });
                    }
                }}
            >
                <div>
                    <div className="flex justify-between">
                        <span>{income.title}</span>
                        <span>₹{income.amount}</span>
                    </div>
                    <p className="text-sm text-gray-500">{income.description}</p>
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
                            const updatedCommonIncomes = commonIncomes.filter(
                                (_, i) => i !== index
                            );
                            setFilteredCommonIncomes(updatedCommonIncomes); // Update filtered common incomes
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
                        handleAddIncome({
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
            {/* Dropdown to Select Existing Income */}


            <select
                value={customTag?.id || ""} // Bind value to the selected income's _id
                onChange={(e) => {
                    const selectedIncome = income.find((inc) => inc._id === e.target.value); // Find the selected income
                    if (selectedIncome) {
                        setCustomTag({
                            id: selectedIncome._id, // Save _id for proper selection tracking
                            title: selectedIncome.title, // Set title as the selected value
                            category: selectedIncome.category,
                            amount: selectedIncome.amount,
                            description: selectedIncome.description, // Add description
                        });
                    }
                }}
                className={`w-full p-2 border rounded ${
                    isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-100 border-gray-300"
                }`}
            >
                <option value="">Select an Income</option> {/* Default option */}
                {income.map((inc) => (
                    <option key={inc._id} value={inc._id}>
                        {inc.title} - ₹{inc.amount}
                    </option>
                ))}
            </select>


            {/* Add Tag Button */}
            <button
                onClick={() => {
                    if (customTag.title) {
                        setTags([...tags, customTag]); // Add selected income as a new tag
                        setCustomTag({ title: "", category: "", amount: "", description: "" }); // Reset after adding
                    } else {
                        alert("Please select an income from the dropdown.");
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




                    {/* Pie Chart Section */}
                    <div
                        className={`p-4 rounded-lg shadow-md flex flex-col items-center ${
                            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                        }`}
                    >
                        <h2 className="text-lg font-semibold text-center mb-4">Category Breakdown</h2>
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
                </div>

                {/* Income Records Table */}
                <div
                    className={`p-4 rounded-lg shadow-md mx-4 ${
                        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                    }`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2
                            className={`text-lg font-semibold ${
                                isDarkMode ? "text-blue-400" : "text-blue-600"
                            }`}
                        >
                            Income Records
                        </h2>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Search by title or category"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className={`p-2 border rounded ${
                                    isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-100 border-gray-300"
                                }`}
                            />
                            <button
                                onClick={handleDownloadStatement}
                                className={`p-2 rounded ${
                                    isDarkMode ? "bg-green-700 hover:bg-green-600 text-white" : "bg-green-500 hover:bg-green-400 text-white"
                                }`}
                            >
                                Download Statement
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className={`${
                                    isDarkMode ? "bg-gray-700 text-white" : "bg-blue-100 text-gray-900"
                                }`}
                            >
                                <th className="p-2 border">Title</th>
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Amount</th>
                                <th className="p-2 border">Category</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredIncome.map((inc) => (
                                <tr
                                    key={inc._id}
                                    className={`${
                                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"
                                    }`}
                                >
                                    <td className={`p-2 border ${isDarkMode ? "text-gray-300" : ""}`}>
                                        {inc.title}
                                    </td>
                                    <td className={`p-2 border ${isDarkMode ? "text-gray-300" : ""}`}>
                                        {new Date(inc.date).toLocaleDateString()}
                                    </td>
                                    <td className={`p-2 border ${isDarkMode ? "text-gray-300" : ""}`}>
                                        ₹{inc.amount}
                                    </td>
                                    <td className={`p-2 border ${isDarkMode ? "text-gray-300" : ""}`}>
                                        {inc.category}
                                    </td>
                                    <td className="p-2 border text-center">
                                        <button
                                            onClick={() => handleDeleteIncome(inc._id)}
                                            className={`px-2 py-1 rounded ${
                                                isDarkMode
                                                    ? "bg-red-700 hover:bg-red-600 text-white"
                                                    : "bg-red-500 hover:bg-red-400 text-white"
                                            }`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredIncome.length === 0 && (
                        <p className="text-center mt-4 text-sm text-gray-400">
                            No income records found.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncomePage;
