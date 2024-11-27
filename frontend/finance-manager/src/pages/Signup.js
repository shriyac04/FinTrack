import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false); // Loading state for feedback
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await signup(formData);
      const { user, token } = response.data; // Extract user and token from backend response

      // Save token to localStorage
      // localStorage.setItem('token', token);

      alert(`Signup successful! Welcome, ${user.name}.`);
      setLoading(false); // Stop loading
      navigate('/login', { state: { user } }); // Redirect to dashboard with user data
    } catch (error) {
      setLoading(false); // Stop loading
      const errorMessage =
        error.response?.data?.message || 'An error occurred during signup. Please try again.';
      alert(errorMessage);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg w-[90%] max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
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
          className={`w-full py-2 rounded transition ${
            loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <p className="text-center">
          Already have an account?{' '}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate('/login')}
          >
            Log in
          </span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
