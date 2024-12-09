import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { userData } from '../services/api'; // Replace with the correct import for your API call

const Navbar = ({ isDarkMode, setIsDarkMode, toggleSidebar, sidebarOpen }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [userName, setUserName] = useState("Guest"); // Default to "Guest" if no user data

    // Fetch user data on mount
    useEffect(() => {
        setIsDarkMode(localStorage.getItem("theme"));
        const fetchUser = async () => {
            try {
                const userResponse = await userData();
                const userInfo = userResponse?.data?.user;
                if (userInfo) {
                    setUserName(userInfo.name || "Guest"); // Set user's name or default to "Guest"
                    console.log("Fetched User Data:", userInfo);
                } else {
                    console.warn("No user data found in response.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error.message);
            }
        };

        fetchUser();
    }, []);

    // Update clock every second
    useEffect(() => {
        
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Clear interval on unmount
    }, []);

    useEffect(()=>{
        localStorage.setItem("theme",isDarkMode);

    },isDarkMode)





    // Format time and date
    const formattedTime = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedDate = currentTime.toLocaleDateString();

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

            {/* User Greeting, Clock, and Dark Mode Toggle */}
            <div className="flex items-center space-x-6">
                {/* User Greeting and Clock */}
                <div className="flex flex-col items-end">
                <span className="text-white font-bold text-base">Hi, {userName}</span>                    <span className="text-sm">
                        {formattedDate} | {formattedTime}
                    </span>
                </div>

                {/* Dark Mode Toggle */}
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
