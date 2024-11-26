import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await login(formData);
            const user = response.data.user; // Extract user from the backend response
            alert('Login successful!');
            navigate('/dashboard', { state: { user } }); // Pass user to the dashboard
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred during login.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-[90%] max-w-md space-y-6">
                <h2 className="text-2xl font-bold text-center">Login</h2>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Login
                </button>
                <p className="text-center">
                    Don't have an account?{' '}
                    <span
                        className="text-blue-600 cursor-pointer hover:underline"
                        onClick={() => navigate('/signup')}
                    >
                        Sign up
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;
