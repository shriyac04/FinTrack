import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const Navbar = ({ isDarkMode, setIsDarkMode, toggleSidebar, sidebarOpen }) => {
    return (
        <div className="fixed top-0 left-0 w-full bg-[#23275e] text-white flex items-center justify-between px-6 py-3 shadow-md z-30">
            {/* Sidebar Toggle and App Name */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 bg-[#23275e] text-white rounded-full shadow-lg focus:outline-none hover:bg-blue-800 transition duration-200 transform hover:scale-105"
                >
                    {sidebarOpen ? '✖' : '☰'}
                </button>
                <h1 className="text-xl font-bold">FinTrack</h1>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-4">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={() => setIsDarkMode(!isDarkMode)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    <div className="absolute flex items-center justify-center w-5 h-5 top-[2px] left-[2px] peer-checked:left-[22px] transition-all">
                        {isDarkMode ? <FaMoon className="text-blue-600" /> : <FaSun className="text-yellow-500" />}
                    </div>
                </label>
            </div>
        </div>
    );
};

export default Navbar;
