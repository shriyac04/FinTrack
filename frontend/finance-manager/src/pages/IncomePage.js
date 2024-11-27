import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import { addIncome, getIncomes, deleteIncome } from '../services/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const IncomePage = () => {
    const [income, setIncome] = useState([]);
    const [categoryData, setCategoryData] = useState({});
    const [form, setForm] = useState({ title: '', amount: '', date: '', category: '', description: '' });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        try {
            const response = await getIncomes();
            const incomes = response.data.data || [];
            setIncome(incomes);

            // Populate category data
            const categories = {};
            incomes.forEach((inc) => {
                categories[inc.category] = (categories[inc.category] || 0) + inc.amount;
            });
            setCategoryData(categories);
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
    };

    const handleAddIncome = async () => {
        if (!form.title || !form.amount || !form.date || !form.category || !form.description) {
            alert('All fields are required');
            return;
        }
        try {
            await addIncome(form);
            setForm({ title: '', amount: '', date: '', category: '', description: '' });
            fetchIncomes();
        } catch (error) {
            console.error('Error adding income:', error);
        }
    };

    const handleDeleteIncome = async (id) => {
        try {
            await deleteIncome(id);
            fetchIncomes();
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    const pieChartData = {
        labels: Object.keys(categoryData),
        datasets: [
            {
                data: Object.values(categoryData),
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                ],
                hoverOffset: 4,
            },
        ],
    };

    return (
        <div
            className={`relative min-h-screen transition-all duration-500 ${
                isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
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
            <div className={`transition-all duration-300 pt-24 ${sidebarOpen ? 'ml-64' : ''}`}>
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Income Manager</h1>

                {/* Top Section: Form and Pie Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4">
                    {/* Add Income Form */}
                    <div className={`p-4 rounded-lg shadow-md ${
                        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                        <h2 className="text-lg font-semibold text-blue-600 mb-4">Add Income</h2>
                        <form>
                            <input
                                type="text"
                                placeholder="Title"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-100 border-gray-300'
                                }`}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={form.amount}
                                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || '' })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-100 border-gray-300'
                                }`}
                            />
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-100 border-gray-300'
                                }`}
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-100 border-gray-300'
                                }`}
                            />
                            <textarea
                                placeholder="Description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className={`w-full p-2 border rounded mb-4 ${
                                    isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white'
                                        : 'bg-gray-100 border-gray-300'
                                }`}
                            />
                            <button
                                type="button"
                                onClick={handleAddIncome}
                                className={`w-full p-2 rounded ${
                                    isDarkMode
                                        ? 'bg-blue-700 text-white hover:bg-blue-600'
                                        : 'bg-blue-500 text-white hover:bg-blue-400'
                                }`}
                            >
                                Add Income
                            </button>
                        </form>
                    </div>

                    {/* Pie Chart Section */}
                    <div className={`p-4 rounded-lg shadow-md flex flex-col items-center ${
                        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                        <h2 className="text-lg font-semibold text-center mb-4">Category Breakdown</h2>
                        <div className="w-full max-w-xs h-56">
                            <Pie
                                data={pieChartData}
                                options={{
                                    plugins: {
                                        legend: {
                                            labels: {
                                                color: isDarkMode ? 'white' : 'black',
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
                <div className={`p-4 rounded-lg shadow-md mx-4 ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <h2
                        className={`text-lg font-semibold mb-4 ${
                            isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`}
                    >
                        Income Records
                    </h2>
                    <table className="w-full text-sm">
                        <thead>
                            <tr
                                className={`${
                                    isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-gray-900'
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
                            {income.map((inc) => (
                                <tr
                                    key={inc._id}
                                    className={`${
                                        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'
                                    }`}
                                >
                                    <td className={`p-2 border ${isDarkMode ? 'text-gray-300' : ''}`}>
                                        {inc.title}
                                    </td>
                                    <td className={`p-2 border ${isDarkMode ? 'text-gray-300' : ''}`}>
                                        {new Date(inc.date).toLocaleDateString()}
                                    </td>
                                    <td className={`p-2 border ${isDarkMode ? 'text-gray-300' : ''}`}>
                                        ₹{inc.amount}
                                    </td>
                                    <td className={`p-2 border ${isDarkMode ? 'text-gray-300' : ''}`}>
                                        {inc.category}
                                    </td>
                                    <td className="p-2 border text-center">
                                        <button
                                            onClick={() => handleDeleteIncome(inc._id)}
                                            className={`px-2 py-1 rounded ${
                                                isDarkMode
                                                    ? 'bg-red-700 hover:bg-red-600 text-white'
                                                    : 'bg-red-500 hover:bg-red-400 text-white'
                                            }`}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {income.length === 0 && (
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
