import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ sidebarOpen, handleLogout }) => {
    const navigate = useNavigate(); // Initialize navigate hook

    return (
        <div
            className={`fixed top-16 left-0 h-full bg-[#23275e] text-white shadow-lg transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition-transform duration-300 z-20`}
            style={{ width: '250px' }}
        >
            <ul className="p-4 space-y-4 flex flex-col h-full">
                <li
                    className="cursor-pointer hover:bg-gray-700 p-2 rounded-md transition transform hover:scale-105"
                    onClick={() => navigate('/dashboard')} // Navigate to Dashboard
                >
                    Dashboard
                </li>
                <li
                    className="cursor-pointer hover:bg-gray-700 p-2 rounded-md transition transform hover:scale-105"
                    onClick={() => navigate('/income')} // Navigate to Incomes
                >
                    Incomes
                </li>
                <li
                    className="cursor-pointer hover:bg-gray-700 p-2 rounded-md transition transform hover:scale-105"
                    onClick={() => navigate('/expense')} // Navigate to Expenses
                >
                    Expenses
                </li>
                <li className="mt-auto">
                    <button
                        
                        className="w-full bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition"
                        onClick={() => navigate('/')}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
