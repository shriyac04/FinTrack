import React, { useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TeamMemberCard from '../components/Team';
import ProductCard from '../components/ProductCard';

function Home() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const navigate = useNavigate();

    const logo = require('../images/Financify.png'); // Adjust the path to your logo

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const teamMembers = [
        { name: 'Shriya Choudhary', position: 'Full Stack Developer', description: 'Visionary leader with 10+ years in financial technology.', image: 'https://via.placeholder.com/150' },
        { name: 'Shruti', position: 'Full Stack Developer', description: 'Tech enthusiast driving innovation in finance.', image: 'https://via.placeholder.com/150' },
        { name: 'Saurabh Priyadarshi', position: 'Full Stack Developer', description: 'Bringing ideas to life with seamless project management.', image: 'https://via.placeholder.com/150' },
        { name: 'Saurabh', position: 'Full Stack Developer', description: 'Expert in digital marketing and branding.', image: 'https://via.placeholder.com/150' }
    ];

    const products = [
        { title: 'Expenses', description: 'Track and categorize your spending with ease.', icon: '💸' },
        { title: 'Incomes', description: 'Record your income sources and track your earnings.', icon: '💵' },
        { title: 'Loan Management', description: 'Manage your loans effectively.', icon: '🏦' }
    ];

    return (
        <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}w-full overflow-x-hidden`}>
            {/* Navbar */}
<div
    className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 shadow-md z-30 ${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'
    }`}
>
    {/* Logo */}
    <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={() => scrollToSection('home')}
    >
        <img src={logo} alt="Financify Logo" className="w-[50px] h-[50px] object-contain" />
    </div>

    {/* Navigation Links */}
    <div className="flex items-center gap-[20px]">
        <h1
            className="text-lg hover:text-blue-300 transition cursor-pointer"
            onClick={() => scrollToSection('home')}
        >
            Home
        </h1>
        <h1
            className="text-lg hover:text-blue-300 transition cursor-pointer"
            onClick={() => scrollToSection('about')}
        >
            About Us
        </h1>
        <h1
            className="text-lg hover:text-blue-300 transition cursor-pointer"
            onClick={() => scrollToSection('products')}
        >
            Products
        </h1>
        <h1
            className="text-lg hover:text-blue-300 transition cursor-pointer"
            onClick={() => scrollToSection('contact')}
        >
            Contact Us
        </h1>
    </div>

    {/* Right Section */}
    <div className="flex items-center space-x-4">
        {/* Dark Mode Toggle */}
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:bg-yellow-500 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            <div className="absolute flex items-center justify-center w-4 h-4 top-[2px] left-[2px] peer-checked:left-[20px] transition-all">
                {isDarkMode ? <FaMoon className="text-yellow-500" /> : <FaSun className="text-yellow-500" />}
            </div>
        </label>
       
    </div>
</div>

            {/* Page Content */}
            <div className="pt-[70px]">
                {/* Welcome Section */}
                <div
            id="home"
            className={`w-full py-16 ${
                isDarkMode
                    ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white'
                    : 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 text-gray'
            }`}
            style={{ marginTop: 0 }}
        >
            <div className="container mx-auto text-center">
                {/* Smooth Fade and Slide-In for Heading */}
                <motion.h1
                    className="text-6xl font-bold mb-6"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }} // Replay the animation on every view
                    transition={{
                        duration: 1,
                        ease: 'easeInOut',
                    }}
                >
                    <br />
                    Welcome to Financify
                </motion.h1>

                {/* Smooth Fade and Slide-In for Paragraph */}
                <motion.p
                    className="text-lg max-w-3xl mx-auto mb-8"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }} // Replay the animation on every view
                    transition={{
                        duration: 1,
                        delay: 0.3,
                        ease: 'easeInOut',
                    }}
                >
                    Your ultimate solution for managing your finances. Track incomes, expenses, set goals, and much more!
                </motion.p>

                {/* Button with Subtle Hover Effect */}
                <motion.button
                    className="mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg transition hover:bg-blue-700"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false }} // Replay the animation on every view
                    transition={{
                        duration: 1.5,
                        delay: 0.6,
                        ease: 'easeOut',
                    }}
                    onClick={() => navigate('/signup')}
                >
                    Get Started
                </motion.button>
            </div>
        </div>
           {/* About Us Section */}
           <div id="about" className={`py-12 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-blue-100 text-gray-800'}`}>
    <div className="container mx-auto text-center">
        <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            <br />
            About Us
        </motion.h2>
        <motion.p
            className="text-lg mb-8"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            Meet the dedicated team behind Financify, committed to helping you achieve your financial goals.
        </motion.p>

        {/* Flexbox Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8 place-items-center">
            {teamMembers.map((member, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05 }}
                >
                    <TeamMemberCard {...member} isDarkMode={isDarkMode} />
                </motion.div>
            ))}
        </div>
    </div>
</div>


                {/* Products Section */}
                <div id="products" className={`py-12 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-blue-200 text-gray-800'}`}>
                    <div className="container mx-auto text-center">
                        <motion.h2 className="text-4xl font-bold mb-6" initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            <br />
                            Our Products
                        </motion.h2>
                        <motion.p className="text-lg mb-8" initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                            Discover the tools and features that make Financify your ultimate financial management solution.
                        </motion.p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map((product, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    whileHover={{ scale: 1.05, rotate: 1 }}
                                >
                                    <ProductCard {...product} isDarkMode={isDarkMode} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
{/* Contact Us Section */}
<div id="contact" className={`py-12 ${isDarkMode ? 'bg-blue-900 text-white' : 'bg-blue-100 text-gray-800'}`}>
    <div className="container mx-auto text-center">
        <motion.h2
            className="text-4xl font-bold mb-6"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            Contact Us
        </motion.h2>
        <motion.p
            className="text-lg mb-8"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            We'd love to hear from you! Reach out to us using the form below or through our contact details.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className={`p-6 rounded-lg shadow-md mx-auto w-full max-w-md ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}
            >
                <form className="space-y-4">
                    <input
                        type="text"
                        placeholder="Your Name"
                        className={`w-full p-3 rounded-lg border focus:ring-2 ${
                            isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                                : 'bg-white border-gray-300 focus:ring-blue-500'
                        }`}
                    />
                    <input
                        type="email"
                        placeholder="Your Email"
                        className={`w-full p-3 rounded-lg border focus:ring-2 ${
                            isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                                : 'bg-white border-gray-300 focus:ring-blue-500'
                        }`}
                    />
                    <textarea
                        rows="4"
                        placeholder="Your Message"
                        className={`w-full p-3 rounded-lg border focus:ring-2 ${
                            isDarkMode
                                ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
                                : 'bg-white border-gray-300 focus:ring-blue-500'
                        }`}
                    ></textarea>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Send Message
                    </button>
                </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 text-left"
            >
                <div className="flex items-center">
                    <i className="fas fa-phone-alt text-blue-300 text-2xl mr-4"></i>
                    <p className="text-lg">+1 234 567 890</p>
                </div>
                <div className="flex items-center">
                    <i className="fas fa-envelope text-blue-300 text-2xl mr-4"></i>
                    <p className="text-lg">support@financify.com</p>
                </div>
                <div className="flex items-center">
                    <i className="fas fa-map-marker-alt text-blue-300 text-2xl mr-4"></i>
                    <p className="text-lg">123 Finance St, Money City, Wealthyland</p>
                </div>
            </motion.div>
        </div>
    </div>
</div>

            </div>
        </div>
    );
}

export default Home;
