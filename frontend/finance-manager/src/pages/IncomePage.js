import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import NavBar from '../components/NavBar'; // Import NavBar component
import Sidebar from '../components/Sidebar'; // Import Sidebar component
import { addIncome, getIncomes, deleteIncome } from '../services/api';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const IncomePage = () => {
    const [income, setIncome] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [monthlyData, setMonthlyData] = useState([]);
    const [form, setForm] = useState({ title: '', amount: '', date: '', category: '', description: '' });
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar state
    const [isDarkMode, setIsDarkMode] = useState(false); // Dark mode state

    useEffect(() => {
        fetchIncomes();
    }, []);

    const fetchIncomes = async () => {
        try {
            const response = await getIncomes();
            console.log("response ",response);
            const incomes = response.data.data || [];
            console.log(incomes);
            setIncome(incomes);
            setTotalIncome(incomes.reduce((sum, inc) => sum + inc.amount, 0));
            const monthly = Array(12).fill(0);
            incomes.forEach((inc) => {
                const month = new Date(inc.date).getMonth();
                monthly[month] += inc.amount;
            });
            setMonthlyData(monthly);
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

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Monthly Income',
                data: monthlyData,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderWidth: 1,
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

                {/* Top Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 px-4">
                    {/* Add Income Form */}
                    <div className={`p-4 rounded-lg shadow-md ${
                        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                        <h2 className="text-lg font-semibold text-blue-600 mb-4">Add Income</h2>
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
                                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || '' })}
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
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={handleAddIncome}
                                className="w-full bg-blue-600 text-white py-2 rounded"
                            >
                                Add Income
                            </button>
                        </form>
                    </div>

                    {/* Stats and Chart */}
                    <div className={`p-4 rounded-lg shadow-md flex flex-col justify-between ${
                        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    }`}>
                        <div className="bg-blue-500 text-white p-3 rounded-lg mb-4 text-center">
                            <h2 className="text-sm font-semibold">Total Income</h2>
                            <p className="text-xl font-bold">${totalIncome}</p>
                        </div>
                        <div className="flex-grow">
                            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>

                {/* Income Records */}
                <div className={`p-4 rounded-lg shadow-md mx-4 ${
                    isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                }`}>
                    <h2 className="text-lg font-semibold mb-4 text-blue-600">Income Records</h2>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-blue-100">
                                <th className="p-2 border">Title</th>
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Amount</th>
                                <th className="p-2 border">Category</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {income.map((inc) => (
                                <tr key={inc._id} className="hover:bg-blue-50">
                                    <td className="p-2 border">{inc.title}</td>
                                    <td className="p-2 border">{new Date(inc.date).toLocaleDateString()}</td>
                                    <td className="p-2 border">${inc.amount}</td>
                                    <td className="p-2 border">{inc.category}</td>
                                    <td className="p-2 border text-center">
                                        <button
                                            onClick={() => handleDeleteIncome(inc._id)}
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {income.length === 0 && (
                        <p className="text-center text-gray-500 mt-4">No income records found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IncomePage;
