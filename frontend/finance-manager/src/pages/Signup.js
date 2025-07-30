import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api';

const financeQuotes = [
  "A budget is telling your money where to go instead of wondering where it went.",
  "Financial freedom is available to those who learn about it and work for it.",
  "An investment in knowledge pays the best interest.",
  "It's not about having a lot of money. It's about knowing how to manage it.",
  "A penny saved is a penny earned.",
];

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });
  const [popupMessage, setPopupMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [randomQuote, setRandomQuote] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(false);
    try {
      const response = await signup(formData);
      const { user, token } = response.data;

      localStorage.setItem('token', token);

      // Show success popup
      setUserName(user.name);
      setPopupMessage(`Welcome, ${user.name}!`);
      setRandomQuote(financeQuotes[Math.floor(Math.random() * financeQuotes.length)]);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        setLoading(true);
        setTimeout(() => {
          navigate('/dashboard', { state: { user } });
        }, 2000);
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'An error occurred during signup. Please try again.';
      setPopupMessage(errorMessage);
      setShowPopup(true);

      setTimeout(() => setShowPopup(false), 2000);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex overflow-hidden">
      {/* Left Section: CSS Doodle */}
      <div className="w-2/3 flex items-center justify-center bg-black h-screen">
        <css-doodle>
          {`
            :doodle {
              @grid: 18x18;
              @size: 100%;
            }
            --hue: calc(180 + 1.5 * @x * @y);
            background: hsl(var(--hue), 50%, 70%);
            margin: -0.5px;
            transition: @r(.5s) ease;
            clip-path: polygon(@pick(
              '0 0, 100% 0, 100% 100%',
              '0 0, 100% 0, 0 100%',
              '0 0, 100% 100%, 0 100%',
              '100% 0, 100% 100%, 0 100%'
            ));
          `}
        </css-doodle>
      </div>

      {/* Right Section: Signup Form */}
      <div className="w-1/3 flex items-center justify-center h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-lg w-[90%] max-w-md space-y-6"
        >
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
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
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
          <p className="text-center mt-4">
            <span
              className="text-gray-600 cursor-pointer hover:underline"
              onClick={() => navigate('/')}
            >
              Back to Home
            </span>
          </p>
        </form>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed top-0 inset-x-0 flex justify-center mt-6 z-50">
          <div className="relative bg-black text-white px-8 py-4 rounded-lg shadow-lg animate-popup w-96 text-center">
            <h1 className="text-2xl font-bold mb-2">{popupMessage}</h1>
            <p className="text-sm italic">"{randomQuote}"</p>
          </div>
        </div>
      )}

      {/* Loading Animation */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-gray-300"></div>
        </div>
      )}

      {/* Popup Animation Styles */}
      <style>
        {`
          .animate-popup {
            animation: slideDown 0.5s ease-in-out, fadeOut 2s 1.5s forwards;
          }

          @keyframes slideDown {
            0% {
              transform: translateY(-50%);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            to {
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Signup;
